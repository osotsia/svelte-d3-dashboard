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