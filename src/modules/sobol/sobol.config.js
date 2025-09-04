import BarChart from '../../components/BarChart.svelte';

export default {
    id: 'sobol',
    title: 'Sobol Indices (True Model)',
    component: BarChart,
    layout: 'default',
    explanation: 'Sobol indices measure sensitivity, i.e. how much the output variance depends on each input parameter, separating direct effects (S1) from total effects including interactions (ST).',
    props: {
        yKey: 'param',
        xKeys: ['S1', 'ST'],
        xLabel: 'Sobol Index Value',
        showLegend: true, // Enable the legend
        legendLabels: { // Provide descriptive labels
            'S1': 'S1 (First-order)',
            'ST': 'ST (Total-order)'
        },
        errorBarKeys: { // Map value keys to confidence keys
            'S1': 'S1_conf',
            'ST': 'ST_conf'
        }
    },
    mapper: ($dataStore, $workingState) => {
        const data = $dataStore.sobol?.indices || [];
        const sortedData = [...data].sort((a, b) => b.ST - a.ST);
        return { data: sortedData };
    }
};