import FeatureImportanceChart from './FeatureImportanceChart.svelte';

export default {
    id: 'feature-importance',
    title: 'Feature Importance (XGBoost)',
    component: FeatureImportanceChart,
    layout: 'default',
    explanation: 'This chart ranks input parameters by their contribution to the surrogate model\'s predictions, indicating which factors the model relies on most.',
    props: {
        xKey: 'importance',
        yKey: 'feature',
        xLabel: 'Importance (Gain)',
        yLabel: 'Parameter'
    },
    // FIX: Standardized function signature
    getData: ($dataStore, $workingState) => ({
        data: $dataStore['feature-importance']?.data || []
    })
};