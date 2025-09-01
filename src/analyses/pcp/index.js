import ParallelCoordinatesPlot from './ParallelCoordinatesPlot.svelte';

export default {
    id: 'pcp',
    title: 'Parallel Coordinates Plot',
    component: ParallelCoordinatesPlot,
    layout: 'full-width',
    explanation: 'This interactive plot shows relationships between model inputs and LCOH. Each line represents one model run, allowing for visual filtering and correlation analysis.',
    props: {
        colorKey: 'LCOH'
    },
    mapper: ($dataStore, $workingState) => ({
        data: $dataStore.pcp?.data || [],
        keys: ($dataStore.pcp?.axes || []).map(axis => axis.name),
        selections: $workingState?.pcpSelections || {}
    })
};