/**
 * A centralized registry of functions that map global state to component props.
 * Each function takes the raw dataStore and workingState values and returns
 * an object of props for a specific analysis component.
 */
export const analysisMappers = {
    'sobol': ($dataStore, $workingState) => {
        const data = $dataStore.sobol?.indices || [];
        const sortedData = [...data].sort((a, b) => b.ST - a.ST);
        return { data: sortedData };
    },
    'pcp': ($dataStore, $workingState) => ({
        data: $dataStore.pcp?.data || [],
        keys: ($dataStore.pcp?.axes || []).map(axis => axis.name),
        selections: $workingState?.pcpSelections || {}
    }),
    'feature-importance': ($dataStore, $workingState) => ({
        data: $dataStore['feature-importance']?.data || []
    }),
    'residuals': ($dataStore, $workingState) => ({
        data: $dataStore.residuals?.data || []
    }),
    'model-card': ($dataStore, $workingState) => ({
        data: $dataStore.model_card || {}
    })
};