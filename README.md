# LCOH Analysis Workbench

**Visit Site:** https://osotsia.github.io/svelte-d3-dashboard/

The LCOH Analysis Workbench is a self-contained, interactive web application for exploring the drivers of Levelized Cost of Heat (LCOH). It is designed for techno-economic analysts to run scenarios, understand parameter sensitivities, and evaluate the performance of a surrogate machine learning model (used in cases where evaluating the true model is costly).

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

## Architecture (Svelte)

The frontend is a single-page application built with Svelte, structured for modularity and clear data flow.

-   **State Management (Svelte Stores):**
    -   `src/stores/dataStore.js`: Holds the large, static JSON payload. It is treated as immutable by the application.
    -   `src/stores/scenarioStore.js`: Manages all dynamic, user-driven state. This includes the current slider parameters, saved scenarios, the analyst's narrative, pinned analyses, and any active chart selections.

-   **Component Structure & Data Flow:** The application follows a "smart container, dumb component" pattern to decouple logic from presentation.
    -   **Views (`ReportView`, `KeyDriversView`, etc.):** These are top-level "smart" components. They subscribe to the Svelte stores and are responsible for orchestrating the display of analyses for a given page.
    -   **Central Mappers (`lib/analysisMappers.js`):** Views use these centralized functions to transform the raw global state from the stores into the specific props required by each analysis component. This centralizes the state-to-props mapping logic.
    -   **Layout Components (`AnalysisGridView`, `AnalysisBox`):** These are "dumb" presentation components. `AnalysisGridView` receives a fully prepared list of analyses and their props, arranging them in a grid. `AnalysisBox` is a generic wrapper that provides a consistent header and pinning functionality.
    -   **Chart Components (`SobolChart`, `ParallelCoordinatesPlot`, etc.):** These are highly reusable, "dumb" components that receive all their data and configuration via props and emit events for user interactions. They have no knowledge of the global stores.

-   **Modularity (Adding a New Analysis):** The architecture is designed to make adding new analyses straightforward:
    1.  Create the new Svelte chart component.
    2.  Add a static configuration for it in `analyses/index.js`.
    3.  Add a corresponding state-to-props function in `lib/analysisMappers.js`.
    4.  Add the new analysis `id` to the desired view component's list.