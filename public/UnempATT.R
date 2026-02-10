############################################################
# Stacked Event Study for "Sharp" Minimum Wage Increases
# Definition of event: ΔMW >= n_sigma * sigma_state
# Estimation: fixest (state FE + year FE), SE clustered by state
#
# INPUT:  /mnt/data/state_panel_annual_ready.csv
# OUTPUT: event-study plot + printed support + pretrend Wald test + ATT summary
############################################################

suppressPackageStartupMessages({
  library(dplyr)
  library(readr)
  library(stringr)
  library(fixest)
  library(ggplot2)
  library(purrr)
})

# Outcome variable in your dataset (edit if different)
y_var <- "unemp_rate"

# Minimum wage level variable in your dataset (edit if different)
mw_level_var <- "min_wage"

# Event-time window
L <- 3   # leads (pre)
F <- 5   # lags (post)

# Threshold for "sharp" increase (EDIT THIS)
n_sigma <- 3

# Reference period (year immediately before the increase)
ref_event_time <- -1

# Save plot?
save_plot <- TRUE
plot_path <- "event_study_sharp_mw.png"

# ---------------------------
# LOAD DATA
# ---------------------------
infile <- "state_panel_annual_ready.csv"
stopifnot(file.exists(infile))

df <- read_csv(infile, show_col_types = FALSE) %>%
  arrange(abbr, year)

required_cols <- c("abbr", "year", y_var, mw_level_var)
missing_cols <- setdiff(required_cols, names(df))
if (length(missing_cols) > 0) {
  stop("Missing required columns: ", paste(missing_cols, collapse = ", "))
}

# Ensure correct types
df <- df %>%
  mutate(
    abbr = as.character(abbr),
    year = as.integer(year)
  ) %>%
  arrange(abbr, year)

# -----------------------------
# CONSTRUCT ΔMW AND STATE-SPECIFIC SIGMA
# -----------------------------
df <- df %>%
  group_by(abbr) %>%
  mutate(
    d_mw = .data[[mw_level_var]] - lag(.data[[mw_level_var]])
  ) %>%
  ungroup()

mw_sigma <- df %>%
  filter(!is.na(d_mw), d_mw > 0) %>%
  group_by(abbr) %>%
  summarise(
    sigma_mw = sd(d_mw, na.rm = TRUE),
    n_pos_changes = n(),
    .groups = "drop"
  )

df <- df %>%
  left_join(mw_sigma, by = "abbr")

# Define "sharp" increases:
df <- df %>%
  mutate(
    mw_increase_sigma = as.integer(
      !is.na(d_mw) & !is.na(sigma_mw) & (d_mw >= n_sigma * sigma_mw)
    )
  )

# Quick diagnostics
n_events_raw <- sum(df$mw_increase_sigma == 1, na.rm = TRUE)
n_states <- n_distinct(df$abbr)
year_rng <- range(df$year, na.rm = TRUE)

cat("\n==================== DATA CHECK ====================\n")
cat(sprintf("States: %d\nYears:  %d to %d\n", n_states, year_rng[1], year_rng[2]))
cat(sprintf("Sharp events (ΔMW >= %0.2f*sigma_state): %d\n", n_sigma, n_events_raw))
cat("====================================================\n\n")

# -----------------------------
# BUILD EVENT LIST (EVERY SHARP INCREASE IS AN EVENT)
# -----------------------------
events <- df %>%
  filter(mw_increase_sigma == 1) %>%
  transmute(
    abbr,
    event_year = year
  ) %>%
  distinct() %>%
  arrange(abbr, event_year) %>%
  mutate(event_id = row_number())

if (nrow(events) == 0) {
  stop("No events found for the chosen n_sigma. Try lowering n_sigma or verify MW data.")
}

# For clean-control screening (any sharp increase in a window):
inc_by_state_year <- df %>%
  filter(mw_increase_sigma == 1) %>%
  select(abbr, year) %>%
  distinct()

# -----------------------------
# STACKED PANEL CONSTRUCTION (CLEAN CONTROLS + DROP OVERLAPS)
# -----------------------------
make_stack_for_one_event <- function(e_abbr, e_year, e_id, L, F, df, inc_by_state_year) {
  
  years_window <- (e_year - L):(e_year + F)
  
  # States with ANY sharp increase in the calendar window:
  states_with_inc_in_window <- inc_by_state_year %>%
    filter(year %in% years_window) %>%
    distinct(abbr) %>%
    pull(abbr)
  
  # Overlap check: treated state has another sharp increase inside window (besides e_year)
  treated_has_overlap <- inc_by_state_year %>%
    filter(abbr == e_abbr, year %in% years_window, year != e_year) %>%
    nrow() > 0
  
  if (treated_has_overlap) return(NULL)
  
  # Clean control states: no sharp increases in the window
  control_states <- setdiff(unique(df$abbr), states_with_inc_in_window)
  
  # Sample for this event: treated state + clean controls
  sample_states <- c(e_abbr, control_states)
  
  out <- df %>%
    filter(abbr %in% sample_states, year %in% years_window) %>%
    mutate(
      event_id = e_id,
      event_year = e_year,
      treated_event = as.integer(abbr == e_abbr),
      event_time = year - event_year
    )
  
  out
}

stacked <- purrr::pmap_dfr(
  list(events$abbr, events$event_year, events$event_id),
  ~ make_stack_for_one_event(..1, ..2, ..3, L, F, df, inc_by_state_year)
)

if (nrow(stacked) == 0) {
  stop("Stacked dataset is empty after overlap filtering. Consider smaller (L,F) or lower n_sigma.")
}

# -----------------------------
# SUPPORT BY EVENT TIME (TRANSPARENCY)
# -----------------------------
support <- stacked %>%
  group_by(event_time) %>%
  summarise(
    obs = n(),
    events = n_distinct(event_id),
    treated_obs = sum(treated_event == 1),
    control_obs = sum(treated_event == 0),
    .groups = "drop"
  ) %>%
  arrange(event_time)

cat("\n==================== SUPPORT BY EVENT TIME ====================\n")
print(support)
cat("==============================================================\n\n")

# -----------------------------
# EVENT-STUDY REGRESSION
# state FE + year FE; cluster SE by state
# -----------------------------
fml <- as.formula(
  paste0(y_var, " ~ i(event_time, treated_event, ref = ", ref_event_time, ") | abbr + year")
)

es <- feols(
  fml,
  data = stacked,
  cluster = ~ abbr
)

cat("\n==================== EVENT-STUDY MODEL SUMMARY ====================\n")
print(summary(es))
cat("==================================================================\n\n")

# -----------------------------
# EVENT-STUDY PLOT
# -----------------------------
png_temp <- NULL
if (save_plot) {
  png(filename = plot_path, width = 1000, height = 650)
  png_temp <- TRUE
}

iplot(
  es,
  main = sprintf("Stacked event-study: sharp MW increases (n_sigma=%0.2f)", n_sigma),
  xlab = "Event time (t - event year)",
  ylab = sprintf("Effect on %s relative to t = %d", y_var, ref_event_time),
  ref.line = 0
)

if (save_plot && !is.null(png_temp)) {
  dev.off()
  cat(sprintf("Saved plot to: %s\n\n", plot_path))
}

# -----------------------------
# PRE-TREND WALD TEST (JOINT): all event_time < 0 (excluding ref) = 0
# -----------------------------
cn <- names(coef(es))

# Keep i() terms
i_terms <- cn[str_detect(cn, "^event_time::")]

# Exclude reference period
i_terms <- i_terms[!str_detect(i_terms, paste0("^event_time::", ref_event_time, "\\b"))]

# Keep only negative event times (leads)
lead_terms <- i_terms[str_detect(i_terms, "^event_time::-[0-9]+\\b")]

cat("\n==================== PRE-TREND WALD TEST ====================\n")
if (length(lead_terms) == 0) {
  cat("No lead coefficients found (check L, ref_event_time, or coefficient naming).\n")
} else {
  cat("Lead terms tested:\n")
  print(lead_terms)
  cat("\nWald test (H0: all leads = 0):\n")
  print(wald(es, lead_terms))
}
cat("============================================================\n\n")

# -----------------------------
# COMPUTE A SINGLE "ATT" SUMMARY FOR POST-PERIOD
# Definition used here (transparent and editable):
#   ATT = average of post coefficients over event_time in {0,1,...,F}
# relative to ref_event_time = -1
# Uses delta method with clustered vcov.
# -----------------------------
V <- vcov(es)              # clustered vcov (since cluster= specified)
b <- coef(es)

post_times <- 0:F

# Identify coefficient names for each post time in a robust way:
coef_for_time <- function(t, coef_names) {
  # fixest names typically start with "event_time::t"
  # and include treated_event interaction automatically
  hits <- coef_names[str_detect(coef_names, paste0("^event_time::", t, "\\b"))]
  if (length(hits) == 0) return(NA_character_)
  if (length(hits) > 1) {
    # If multiple hits (rare), keep the first but warn
    warning(sprintf("Multiple coefficient matches for event_time=%d. Using first: %s", t, hits[1]))
  }
  hits[1]
}

post_coef_names <- sapply(post_times, coef_for_time, coef_names = names(b))
post_coef_names <- post_coef_names[!is.na(post_coef_names)]

if (length(post_coef_names) == 0) {
  stop("No post coefficients found. Check F or coefficient naming from fixest.")
}

w <- rep(1 / length(post_coef_names), length(post_coef_names))
names(w) <- post_coef_names

att_est <- sum(w * b[names(w)])

# Delta method: Var(w'b) = w' V w
V_sub <- V[names(w), names(w), drop = FALSE]
att_var <- as.numeric(t(w) %*% V_sub %*% w)
att_se <- sqrt(att_var)

att_z <- att_est / att_se
att_p <- 2 * pnorm(-abs(att_z))

# -----------------------------
# PRINT RESULTS BLOCK
# -----------------------------
design_desc <- sprintf(
  "Stacked event-study; events: ΔMW >= %0.2f*sigma_state; window [%d, %d]; clean controls; drop overlaps",
  n_sigma, -L, F
)

sample_desc <- sprintf(
  "%d stacked events; %d states in stacked sample; %d obs",
  n_distinct(stacked$event_id), n_distinct(stacked$abbr), nrow(stacked)
)

estimand_desc <- sprintf(
  "ATT = mean post coefficients for event_time in {0,...,%d} relative to t=%d",
  F, ref_event_time
)

cat(sprintf(
  "
==================== RESULTS ====================
Design:   %s
Sample:   %s
Estimand: %s

ATT:               %0.4f
Cluster-robust SE: %0.4f
p-value:           %0.4g
=================================================
",
  design_desc, sample_desc, estimand_desc,
  att_est, att_se, att_p
))


# -----------------------------
# WALD TEST BLOCK
# -----------------------------

# All coefficient names
cn <- names(coef(es))

# Keep event-study terms
es_terms <- cn[grepl("^event_time::", cn)]

# Drop the reference period (t = -1)
es_terms <- es_terms[!grepl("^event_time::-1\\b", es_terms)]

# Keep only leads (t < 0)
lead_terms <- es_terms[grepl("^event_time::-[0-9]+\\b", es_terms)]

lead_terms

pretrend_test <- wald(es, lead_terms)
print(pretrend_test)


# -----------------------------
# EVENT-STUDY PLOT BLOCK
# -----------------------------

plot_title <- sprintf(
  "Effect of Sharp Minimum Wage Increases on Unemployment\n(Event-study, n_sigma = %0.1f)",
  n_sigma
)

iplot(
  es,
  main = plot_title,
  xlab = "Event time (years relative to increase)",
  ylab = "Change in unemployment rate (pp)\nrelative to year −1",
  ref.line = 0,
  col = "black",
  ci.col = "gray40",
  lwd = 2
)

abline(v = 0, lty = 2, col = "gray50")

# -----------------------------
# EXPORT ATT SUMMARY
# -----------------------------
library(jsonlite)

att_summary <- list(
  estimand = sprintf(
    "ATT = mean post coefficients for event_time in {0,...,%d} relative to t=%d",
    F, ref_event_time
  ),
  att = round(att_est, 4),
  se_cluster = round(att_se, 4),
  p_value = round(att_p, 4),
  n_events = n_distinct(stacked$event_id),
  n_states = n_distinct(stacked$abbr),
  n_obs = nrow(stacked),
  window = c(-L, F),
  n_sigma = n_sigma
)

write_json(
  att_summary,
  "att_summary.json",
  pretty = TRUE,
  auto_unbox = TRUE
)

cat("Exported ATT summary to: att_summary.json\n")

# -----------------------------
# EXPORT EVENT-STUDY SERIES 
# -----------------------------
library(dplyr)
library(stringr)
library(tibble)
library(jsonlite)

# ct is your coeftable(es) data.frame with rownames in term
ct <- fixest::coeftable(es) %>% as.data.frame()
ct$term <- rownames(ct)

event_plot <- ct %>%
  filter(str_detect(term, "^event_time::")) %>%
  mutate(
    # Extract the integer after "event_time::" and before ":" (works for -3, -2, 0, 1, ...)
    event_time = as.integer(str_match(term, "^event_time::(-?\\d+)")[, 2]),
    estimate = Estimate,
    se = `Std. Error`,
    ci_low = estimate - 1.96 * se,
    ci_high = estimate + 1.96 * se,
    is_ref = FALSE
  ) %>%
  select(event_time, estimate, se, ci_low, ci_high, is_ref) %>%
  arrange(event_time)

# Add reference period explicitly (normalized)
ref_row <- tibble(
  event_time = ref_event_time,
  estimate = 0,
  se = NA_real_,
  ci_low = NA_real_,
  ci_high = NA_real_,
  is_ref = TRUE
)

event_plot <- bind_rows(event_plot, ref_row) %>%
  arrange(event_time)

write_json(event_plot, "event_study_series.json", pretty = TRUE, auto_unbox = TRUE)
cat("Exported fixed event-study JSON: event_study_series.json\n")

