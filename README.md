# LCOH Dashboard

**Visit the Dashboard:** https://osotsia.github.io/svelte-d3-dashboard/

This is a self-contained, interactive web application for exploring the drivers of Levelized Cost of Heat (LCOH). It is designed for techno-economic analysts to run scenarios, understand parameter sensitivities, and evaluate the performance of a surrogate machine learning model (used in cases where evaluating the true model is costly).

For ease of use, this entire application is compiled into a single, portable HTML file with no external dependencies. Future versions would integrate a python backend.

## Features

*   **Interactive Scenario Analysis**
    *   **LCOH Calculator:** Sliders for real-time parameter adjustments and impact analysis.
    *   **Scenario Management:** Save, load, and compare named scenarios.

*   **Sensitivity & Driver Analysis**
    *   **Sobol Indices:** Quantify input impact on model variance (direct vs. total effects).
    *   **Parallel Coordinates Plot:** Visually filter and identify input/output correlations.

*   **Surrogate Model Diagnostics**
    *   **Model Card:** Key performance metrics (R², RMSE) and metadata.
    *   **Permutation Importance:** Rank parameter influence on surrogate model predictions.
    *   **Residuals Plot:** Diagnose model fit and systematic bias.

*   **Data & Assumptions**
    *   **Document Assumptions:** Log and display core model inputs, sources, and justifications.
    *   **Track Benchmarks:** View model outputs alongside external data for comparison.

*   **Customizable Reporting**
    *   **Pinboard System:** Pin any analysis, assumption, or benchmark to a central report.
    *   **Analyst Notebook:** Add qualitative summaries and notes to each scenario.
