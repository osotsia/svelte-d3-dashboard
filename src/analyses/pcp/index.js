import ParallelCoordinatesPlot from './ParallelCoordinatesPlot.svelte';

export default {
    id: 'pcp',
    title: 'Parallel Coordinates Plot',
    component: ParallelCoordinatesPlot,
    layout: 'full-width',
    explanation: 'This plot shows relationships between model inputs and a single output. Each line represents one model run, allowing for visual filtering and correlation analysis.',
    props: {
        colorKey: 'LCOH'
    }
};