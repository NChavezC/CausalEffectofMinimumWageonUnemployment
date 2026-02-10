############################################################
# BUILD ANNUAL STATE PANEL (state × year)
# Minimum Wage → Employment in Leisure & Hospitality
#
# SOURCES (FRED via fredr):
# - Federal minimum wage (annual): STTMINWGFG
# - State minimum wage (annual):  STTMINWG{abbr}  (may be NA if federal applies)
# - Binding minimum wage: max(state, federal) with federal filling NAs
# - Outcome (monthly → annual mean): {abbr}LEIH  (e.g., CALEIH, UTLEIH)
# - Control (monthly → annual mean): {abbr}UR
#
# Output: state_panel_annual_ready.csv
############################################################

# ----------------------------------------------------------
# Resolve script directory (RStudio-safe, fallback to wd)
# ----------------------------------------------------------
get_script_dir <- function() {
  if (requireNamespace("rstudioapi", quietly = TRUE) &&
      rstudioapi::isAvailable()) {
    return(dirname(rstudioapi::getActiveDocumentContext()$path))
  } else {
    warning("rstudioapi not available; using current working directory.")
    return(getwd())
  }
}

SCRIPT_DIR <- get_script_dir()

suppressPackageStartupMessages({
  library(dplyr)
  library(tidyr)
  library(purrr)
  library(readr)
  library(lubridate)
  library(fredr)
})

# -----------------------
# PARAMETERS (edit here later)
# -----------------------
YEAR_START <- 1990
YEAR_END   <- 2024

OUT_DIR  <- SCRIPT_DIR
OUT_FILE <- file.path(SCRIPT_DIR, "state_panel_annual_ready.csv")

# -----------------------
# FRED API KEY
# -----------------------
if (Sys.getenv("FRED_API_KEY") == "") {
  stop("FRED API key not found. Set env var FRED_API_KEY.")
}
fredr_set_key(Sys.getenv("FRED_API_KEY"))

# -----------------------
# States (50 + DC)
# -----------------------
states <- tibble(
  abbr = as.character(state.abb),
  name = as.character(state.name)
) %>%
  add_row(abbr = "DC", name = "District of Columbia")

# -----------------------
# Helpers
# -----------------------
get_fred_series <- function(series_id) {
  fredr(series_id = series_id) %>%
    transmute(
      date  = as.Date(date),
      value = as.numeric(value)
    )
}

safe_get <- function(series_id) {
  out <- tryCatch(get_fred_series(series_id), error = function(e) NULL)
  if (is.null(out) || nrow(out) == 0) {
    return(tibble(date = as.Date(character()), value = numeric()))
  }
  out
}

to_annual_mean <- function(df) {
  df %>%
    mutate(year = lubridate::year(date)) %>%
    filter(year >= YEAR_START, year <= YEAR_END) %>%
    group_by(year) %>%
    summarise(value = mean(value, na.rm = TRUE), .groups = "drop")
}

# -----------------------
# 1) Federal minimum wage (annual): STTMINWGFG
# -----------------------
fed_mw_annual <- safe_get("STTMINWGFG") %>%
  to_annual_mean() %>%
  rename(fed_min_wage = value)

if (nrow(fed_mw_annual) == 0) {
  stop("Federal minimum wage series STTMINWGFG returned no data. Check API key / connectivity.")
}

# -----------------------
# 2) State minimum wage (annual): STTMINWG{abbr}
# -----------------------
state_mw_annual <- states %>%
  mutate(series = paste0("STTMINWG", abbr)) %>%
  mutate(tbl = map(series, safe_get)) %>%
  transmute(abbr, name, annual = map(tbl, to_annual_mean)) %>%
  unnest(annual) %>%
  rename(state_min_wage = value)

# -----------------------
# 3) Construct binding minimum wage:
#    binding = max(state, federal), with federal filling NA state MW
# -----------------------
mw_annual <- tidyr::expand_grid(
  abbr = states$abbr,
  year = seq.int(YEAR_START, YEAR_END, by = 1)
) %>%
  left_join(states, by = "abbr") %>%
  left_join(state_mw_annual, by = c("abbr", "name", "year")) %>%
  left_join(fed_mw_annual,   by = "year") %>%
  mutate(
    # If state MW is NA (federal-only states), binding should be federal.
    # If both exist, binding is the higher of the two.
    min_wage = pmax(state_min_wage, fed_min_wage, na.rm = TRUE)
  ) %>%
  select(abbr, name, year, min_wage, state_min_wage, fed_min_wage)

# -----------------------
# 4) Control: unemployment rate (monthly → annual mean), {abbr}UR
# -----------------------
ur_annual <- states %>%
  mutate(series = paste0(abbr, "UR")) %>%
  mutate(tbl = map(series, safe_get)) %>%
  transmute(abbr, name, annual = map(tbl, to_annual_mean)) %>%
  unnest(annual) %>%
  rename(unemp_rate = value)

# -----------------------
# 5) Outcome: L&H employment (monthly → annual mean), {abbr}LEIH
#    Examples: CALEIH, UTLEIH
# -----------------------
lh_emp_annual <- states %>%
  mutate(series = paste0(abbr, "LEIH")) %>%
  mutate(tbl = map(series, safe_get)) %>%
  transmute(abbr, name, annual = map(tbl, to_annual_mean)) %>%
  unnest(annual) %>%
  rename(emp_lh = value)

# -----------------------
# Diagnostics (coverage)
# -----------------------
cat("\n==== COVERAGE (within window) ====\n")
cat("Window:", YEAR_START, "to", YEAR_END, "\n")
cat("Federal MW years:", n_distinct(fed_mw_annual$year), "\n")
cat("Binding MW states:", n_distinct(mw_annual$abbr), " rows:", nrow(mw_annual), "\n")
cat("Unemp states     :", n_distinct(ur_annual$abbr), " rows:", nrow(ur_annual), "\n")
cat("L&H emp states   :", n_distinct(lh_emp_annual$abbr), " rows:", nrow(lh_emp_annual), "\n")

# -----------------------
# 6) Build balanced state × year panel
# -----------------------
panel <- tidyr::expand_grid(
  abbr = states$abbr,
  year = seq.int(YEAR_START, YEAR_END, by = 1)
) %>%
  left_join(states, by = "abbr") %>%
  left_join(mw_annual,      by = c("abbr", "name", "year")) %>%
  left_join(ur_annual,      by = c("abbr", "name", "year")) %>%
  left_join(lh_emp_annual,  by = c("abbr", "name", "year"))

# -----------------------
# 7) Treatment timing variables (annual; did::att_gt-compatible)
#    Treatment defined using *binding* minimum wage.
# -----------------------
panel <- panel %>%
  arrange(abbr, year) %>%
  group_by(abbr) %>%
  mutate(
    min_wage_lag = lag(min_wage),
    mw_increase  = if_else(!is.na(min_wage_lag) & !is.na(min_wage) & (min_wage > min_wage_lag), 1L, 0L),
    first_treat_year = if_else(any(mw_increase == 1L), min(year[mw_increase == 1L]), NA_integer_),
    g = if_else(is.na(first_treat_year), 0L, first_treat_year),
    post = if_else(g > 0L & year >= g, 1L, 0L),
    event_time = if_else(g > 0L, year - g, NA_integer_)
  ) %>%
  ungroup()

# -----------------------
# 8) Transform outcome
# -----------------------
panel <- panel %>%
  mutate(
    ln_emp_lh = if_else(!is.na(emp_lh) & emp_lh > 0, log(emp_lh), NA_real_)
  )

# -----------------------
# 9) Sanity checks
# -----------------------
cat("\n==== FINAL PANEL SUMMARY ====\n")
cat("Years:", min(panel$year, na.rm = TRUE), "-", max(panel$year, na.rm = TRUE), "\n")
cat("States:", n_distinct(panel$abbr), "\n")
cat("Never-treated states:", sum(panel %>% distinct(abbr, g) %>% pull(g) == 0L, na.rm = TRUE), "\n")

cat("\nMissingness (share NA):\n")
print(panel %>%
        summarise(
          min_wage = mean(is.na(min_wage)),
          emp_lh   = mean(is.na(emp_lh)),
          unemp    = mean(is.na(unemp_rate))
        ))

# Quick check: show a few federal-only states if any
cat("\nExamples where state_min_wage is NA but federal exists (federal-only states):\n")
print(panel %>%
        filter(is.na(state_min_wage) & !is.na(fed_min_wage)) %>%
        distinct(abbr, name) %>%
        slice(1:10))

# -----------------------
# 10) Export
# -----------------------
dir.create(OUT_DIR, showWarnings = FALSE, recursive = TRUE)
readr::write_csv(panel, OUT_FILE)
cat("\nSaved:", OUT_FILE, "\n")
