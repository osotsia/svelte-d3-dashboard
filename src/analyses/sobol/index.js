import SobolChart from './SobolChart.svelte';

export default {
    id: 'sobol',
    title: 'Sobol Indices (True Model)',
    component: SobolChart,
    layout: 'default',
    explanation: 'Sobol indices measure how much of the output variance is dependent on each input parameter, i.e. sensitivity, separating direct effects (S1) from total effects including interactions (ST).',
    props: {
        yKey: 'param',
        xKeys: ['S1', 'ST'],
        confKeys: ['S1_conf', 'ST_conf'],
        xLabel: 'Sobol Index Value'
    },
    getData: ($dataStore) => ({
        data: $dataStore.sobol?.indices || []
    })
};