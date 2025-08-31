import SobolChart from './SobolChart.svelte';

export default {
    id: 'sobol',
    title: 'Sobol Indices (True Model)',
    component: SobolChart,
    layout: 'default',
    explanation: 'Sobol indices measure sensitivity, i.e. how much of the output variance is dependent on each input parameter, separating direct effects (S1) from total effects including interactions (ST).',
    props: {
        yKey: 'param',
        xKeys: ['S1', 'ST'],
        confKeys: ['S1_conf', 'ST_conf'],
        xLabel: 'Sobol Index Value'
    },
    getData: ($dataStore, $workingState) => {
        const data = $dataStore.sobol?.indices || [];
        // Sort data by the total-order index (ST) in descending order for clearer visualization.
        const sortedData = [...data].sort((a, b) => b.ST - a.ST);
        return {
            data: sortedData
        };
    }
};