import BarChart from '../../components/ui/BarChart.svelte';

export default {
    id: 'feature-importance',
    title: 'Feature Importance (Surrogate)',
    component: BarChart,
    layout: 'default',
    explanation: 'This chart ranks input parameters by their contribution to the surrogate model\'s predictions, indicating which factors the model relies on most. Importance is measured via permutation on the test set.',
    props: {
        xKeys: ['importance'], // Use the new xKeys array
        yKey: 'feature',
        xLabel: 'Normalized Permutation Importance',
        yLabel: 'Parameter',
        showLegend: false, // Explicitly disable legend
        errorBarKeys: { // Map value keys to confidence keys
            'importance': 'importance_conf'
        }
    },
    mapper: ($dataStore, $workingState) => ({
        data: $dataStore['feature-importance']?.data || []
    })
};