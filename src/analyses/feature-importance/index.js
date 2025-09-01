import BarChart from '../../components/ui/BarChart.svelte';

export default {
    id: 'feature-importance',
    title: 'Feature Importance (XGBoost)',
    component: BarChart,
    layout: 'default',
    explanation: 'This chart ranks input parameters by their contribution to the surrogate model\'s predictions, indicating which factors the model relies on most.',
    props: {
        xKeys: ['importance'], // Use the new xKeys array
        yKey: 'feature',
        xLabel: 'Importance (Gain)',
        yLabel: 'Parameter',
        showLegend: false // Explicitly disable legend
    },
    mapper: ($dataStore, $workingState) => ({
        data: $dataStore['feature-importance']?.data || []
    })
};