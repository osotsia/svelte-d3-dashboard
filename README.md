# LCOH Dashboard

**Visit the Dashboard:** https://osotsia.github.io/svelte-d3-dashboard/

This is a self-contained, interactive web application for exploring the drivers of Levelized Cost of Heat (LCOH), ie the lifetime (projected) cost of a heat-generating solution divided by the total amount of heat it will generate. It is designed for techno-economic analysts to run scenarios, understand parameter sensitivities, and evaluate the performance of a surrogate machine learning model (used in cases where evaluating the true model is costly).

For ease of use, this entire application is compiled into a single, portable HTML file with no external dependencies, with the option of later integrating a python backend.

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

## **FAQ**

**Q1: What is the primary objective of the LCOH Workbench project?**
The objective is to accelerate techno-economic analysis and improve report consistency. It integrates a real-time calculator, scenario management, and visualizations into a single interface, consolidating workflows previously split across spreadsheets and model scripts.

**Q2: Why was Svelte 5 chosen for the front-end framework?**
Svelte 5 was chosen for code conciseness, performance, and a small bundle size, suitable for data-intensive applications. It compiles components to efficient JavaScript, and its rune-based reactivity (`$state`, `$derived`) simplifies state management, reducing code complexity and potential errors.

**Q3: Can I upload my own dataset or connect a different model?**
No. All model logic and analytical data are pre-compiled into the application. User-provided data or models would require a future version with a backend service.

**Q4: Where is my scenario data stored?**
Scenario data is saved only in your browser's `localStorage` and is not sent to a server. This ensures privacy but means data is not accessible on other devices and will be lost if browser data is cleared.

**Q5: How can I export a report from the Workbench?**
The application lacks a dedicated export function. Use your browser’s "Print" command and select "Save as PDF" to generate a static document of the Report view, which includes your pinned analyses and comments.