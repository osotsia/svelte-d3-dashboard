import ResidualsPlot from './ScatterPlot.svelte';

export default {
    id: 'residuals',
    title: 'Residuals vs. Fitted (Surrogate)',
    component: ResidualsPlot,
    layout: 'default',
    explanation: 'Residuals are the errors between the surrogate model\'s predictions and the true model\'s outputs. A random, patternless scatter indicates a well-fitted model.',
    props: {
        xKey: 'fitted',
        yKey: 'residual',
        xLabel: 'Fitted LCOH Values',
        yLabel: 'LCOH Residuals'
    },
    mapper: ($dataStore, $workingState) => ({
        data: $dataStore.residuals?.data || []
    })
};