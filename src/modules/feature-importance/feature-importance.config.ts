import BarChart from '../../components/BarChart.svelte';
import type { ModuleConfig } from '../../lib/types';

const config: ModuleConfig = {
    id: 'feature-importance',
    title: 'Feature Importance (Surrogate)',
    component: BarChart,
    layout: 'default',
    view: 'Surrogate Model', 
    explanation: 'This chart ranks input parameters by their contribution to the surrogate model\'s predictions, indicating which factors the model relies on most.',
    props: {
        xKeys: ['importance'], // Use the new xKeys array
        yKey: 'feature',
        xLabel: 'Normalized Permutation Importance',
        showLegend: false, // Explicitly disable legend
        errorBarKeys: { // Map value keys to confidence keys
            'importance': 'importance_conf'
        }
    },
    mapStateToProps: (dataStore, workingState) => ({
        data: dataStore['feature-importance']?.data || []
    })
};
export default config;
