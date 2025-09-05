import ParallelCoordinatesPlot from './ParallelCoordinatesPlot.svelte';
import { scenarioStore } from '../../stores/scenarioStore.svelte.js';
import type { ModuleConfig } from '../../lib/types';

const config: ModuleConfig = {
    id: 'pcp',
    title: 'Parallel Coordinates Plot',
    component: ParallelCoordinatesPlot,
    layout: 'full-width',
    view: 'Key Drivers', 
    explanation: 'This plot shows relationships between model inputs and LCOH. Each line represents one model run, allowing for visual filtering and correlation analysis. Note: This plot is interactive. Try selecting a range of values on one axis.',
    props: {
        colorKey: 'LCOH'
    },
    mapper: ($dataStore, $workingState) => ({
        data: $dataStore.pcp?.data || [],
        keys: ($dataStore.pcp?.axes || []).map(axis => axis.name),
        selections: $workingState?.pcpSelections || {}
    }),
    updater: (event) => {
        scenarioStore.updateWorkingState({ pcpSelections: event.detail });
    }
};


export default config;
