# LCOH Dashboard

**Visit the Dashboard:** https://osotsia.github.io/svelte-d3-dashboard/

This is a self-contained, interactive web application for exploring the drivers of Levelized Cost of Heat (LCOH). It is designed for techno-economic analysts to run scenarios, understand parameter sensitivities, and evaluate the performance of a surrogate machine learning model (used in cases where evaluating the true model is costly).

For ease of use, this entire application is compiled into a single, portable HTML file with no external dependencies. Future versions would integrate a python backend.

## Features

- **Interactive LCOH Calculator:** Adjust model parameters (capital cost, efficiency, interest rate, fuel cost) with sliders to see the immediate impact on LCOH.
- **Scenario Management:** Save, load, and delete parameter scenarios to compare different cases.

- **Key Driver Analysis:**
    - **Sobol Indices:** View a global sensitivity analysis of the true techno-economic model to understand which parameters contribute most to output variance.
    - **Parallel Coordinates Plot:** Visually explore relationships between all input parameters and the LCOH output across thousands of model runs.

- **Surrogate Model Evaluation:**
    - **Model Card:** Review key metadata and performance metrics (Normalized RMSE, R-squared) of the XGBoost surrogate model.
    - **Feature Importance:** See which features the surrogate model relies on most heavily.
    - **Residuals vs. Fitted Plot:** Diagnose the surrogate model's error patterns.
    
- **Custom Reporting:** Pin any analysis to the main report page to build a customized view, complete with a narrative section for analyst notes.
