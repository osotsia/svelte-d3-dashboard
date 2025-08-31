<script>
    import { onMount } from 'svelte';
    import { activeView } from './stores/viewStore.js';
    import { scenarioStore } from './stores/scenarioStore.js';
    import { parameterRanges } from './lib/model.js';

    import Header from './components/common/Header.svelte';
    import ReportView from './views/ReportView.svelte';
    import KeyDriversView from './views/KeyDriversView.svelte';
    import SurrogateModelView from './views/SurrogateModelView.svelte';

    const viewComponents = {
        'Report': ReportView,
        'Key Drivers': KeyDriversView,
        'Surrogate Model': SurrogateModelView
    };

    onMount(() => {
        const defaultParams = Object.fromEntries(
            Object.entries(parameterRanges).map(([key, value]) => [key, value.default])
        );
        
        const defaultScenario = {
            parameters: defaultParams,
            narrative: '',
            pinned: [],
            pcpSelections: {}
        };
        scenarioStore.initialize(defaultScenario);
    });
</script>

<main>
    <Header />
    <svelte:component this={viewComponents[$activeView]} />
</main>