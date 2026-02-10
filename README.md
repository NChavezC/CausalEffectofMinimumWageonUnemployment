# Do Sharp Minimum Wage Increases Increase Unemployment?

**An applied causal inference project using stacked event studies on U.S. state-level data**

---

## Overview

This project estimates the **causal effect of sharp minimum wage increases on unemployment** in the United States.

Rather than asking whether _any_ minimum wage increase affects employment, the analysis focuses on **large, sudden (“sharp”) increases**, and studies how unemployment evolves **before and after** these policy changes using modern Difference-in-Differences methods.

The results are presented in an **interactive web app** designed as a slide-style narrative, suitable for policy, consulting, or applied data science audiences.

---

## Key Question

> **Do sharp minimum wage increases lead to higher unemployment in the short-to-medium run?**

---

## Data

- **Unit of observation:** U.S. state × year
- **Time span:** Multi-decade annual panel
- **Outcome:** State unemployment rate
- **Policy variable:** State minimum wage level

All data are obtained programmatically from the  
**Federal Reserve Economic Data (FRED) API**, ensuring transparency and reproducibility.

---

## Treatment Definition (Core Design Choice)

Not all minimum wage changes are treated as events.

A **sharp increase** is defined as:

$$
\Delta MW_{s,t} \ge n_{\sigma} \cdot \sigma_s
$$

where:

- $\Delta MW_{s,t}$ is the year-over-year change in the minimum wage
- $\sigma_s$ is the state-specific standard deviation of **positive** historical minimum wage changes
- $n_{\sigma} = 3$ in the baseline specification (user-adjustable)

Each qualifying increase is treated as a **separate event**, allowing states to contribute multiple events over time.

---

## Empirical Strategy

### Stacked Event-Study Design

- Each sharp minimum wage increase defines its own event
- Data are stacked around each event within a fixed window
- Event time is defined as:

$
\text{event\_time} = \text{year} - \text{event\_year}
$

**Baseline event window:** $[-3, 5]$

---

### Clean Controls

For each event:

- Control states must have **no sharp increases** in the same event window
- Treated events are dropped if the treated state experiences overlapping sharp increases

This enforces clean comparisons and avoids contamination from nearby policy changes.

---

## Estimation

The main specification is:

$$y_{s,t} = \alpha_s + \gamma_t - \sum_{k \neq -1} \beta_k\mathbf{1}[\text{event\_time}=k]\cdot\mathbf{1}[\text{treated\_event}]- \varepsilon_{s,t}$$

- $\alpha_s$: state fixed effects
- $\gamma_t$: year fixed effects
- Reference period: $t = -1$ (year before the increase)
- Inference: standard errors clustered at the **state level**

---

## Diagnostics: Pre-Trends

A joint Wald test is used to assess pre-treatment trends:

$$H_0: \beta_{-3} = \beta_{-2} = 0$$

- The null is not rejected at the 5% level
- The p-value is borderline at 10%

Results are therefore interpreted **conservatively**, and robustness checks are emphasized.

---

## Summary Effect (ATT)

To provide a scalar summary, the project reports an  
**Average Treatment Effect on the Treated (ATT)**:

- Defined as the average of post-event coefficients for $t = 0,\dots,5$
- Relative to $t = -1$
- Inference via the delta method using clustered variance–covariance estimates

Both dynamic effects and the ATT are reported transparently.

---

## Results (High-Level)

- Pre-treatment coefficients are generally close to zero
- Post-treatment estimates suggest a **modest increase in unemployment** following sharp minimum wage increases
- Effects persist for several years in the baseline specification
- Given borderline pre-trends, results should be interpreted as **suggestive rather than definitive**

---

## Robustness & Limitations

Robustness checks considered or implemented include:

- Alternative definitions of “sharp” increases ($n_\sigma$)
- Different event windows
- Clean-control sensitivity
- Placebo timing checks

Key limitations:

- Identification is **local**, not global
- Results apply only to **large, sudden increases**
- Mechanisms are not identified (e.g., hiring vs. participation)
- Unemployment is a high-level outcome

---

## Reproducibility

This project is fully reproducible:

- **Data ingestion:** FRED API
- **Estimation:** Scripted R pipeline (no manual steps)
- **Outputs:** Analysis-ready JSON files
- **Visualization:** React + Recharts web app consuming exported results

The separation between **analysis (R)** and **presentation (React)** mirrors industry best practices.

---

## Repository Structure

```text
.
├── public/
│   └── ├── UnempATT.R
│       ├── DatasetImport.R
│       ├── event_study_series.json
│       ├── event_study_sharp_mw.png
│       ├── state_panel_annual_ready.csv
│       └── att_summary.json
├── src/
│   ├── pages/
│   └── ui/
├── README.md
```
