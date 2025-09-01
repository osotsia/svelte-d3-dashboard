import BarChart from '../../components/ui/BarChart.svelte';

export default {
    id: 'sobol',
    title: 'Sobol Indices (True Model)',
    component: BarChart,
    layout: 'default',
    explanation: 'Sobol indices measure sensitivity, i.e. how much the output variance dependents on each input parameter, separating direct effects (S1) from total effects including interactions (ST).',
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
    }
};