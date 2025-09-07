import BarChart from '../../components/BarChart.svelte';
// MODIFICATION: Import the type
import type { ModuleConfig } from '../../lib/types';

// MODIFICATION: Apply the ModuleConfig type to the exported object.
const config: ModuleConfig = {
    id: 'sobol',
    title: 'Sobol Indices (True Model)',
    component: BarChart,
    layout: 'default',
    view: 'Key Drivers', 
    explanation: 'Sobol indices measure sensitivity, i.e. how much the output variance depends on each input parameter, separating direct effects (S1) from total effects including interactions (ST).',
    props: {
        yKey: 'param',
        xKeys: ['S1', 'ST'],
        xLabel: 'Sobol Index Value',
        showLegend: true,
        legendLabels: {
            'S1': 'S1 (First-order)',
            'ST': 'ST (Total-order)'
        },
        errorBarKeys: {
            'S1': 'S1_conf',
            'ST': 'ST_conf'
        }
    },
    mapStateToProps: (dataStore, $workingState) => {
        // Assume dataStore.sobol.indices is properly typed elsewhere or cast here.
        const data = dataStore.sobol?.indices || [];
        const sortedData = [...data].sort((a, b) => b.ST - a.ST);
        return { data: sortedData };
    }
};

export default config;