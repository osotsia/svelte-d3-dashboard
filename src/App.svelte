<script>
    import { onMount } from 'svelte';
    import { activeView } from './stores/viewStore.svelte.js';
    import { scenarioStore } from './stores/scenarioStore.svelte.js';
    import { parameterRanges } from './lib/model.js';

    import Header from './components/Header.svelte';
    import ReportView from './views/ReportView.svelte';
    import KeyDriversView from './views/KeyDriversView.svelte';
    import SurrogateModelView from './views/SurrogateModelView.svelte';
    import DataView from './views/DataView.svelte';

    // Add initialized state flag.
    let initialized = $state(false);

    const viewComponents = {
        'Report': ReportView,
        'Key Drivers': KeyDriversView,
        'Surrogate Model': SurrogateModelView,
        'Data': DataView
    };

    const ActiveComponent = $derived(viewComponents[activeView.value]);

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

        // prevent race conditions.
        initialized = true;
    });
</script>

<main>
    <Header />
    {#if initialized}
        <ActiveComponent />
    {/if}
</main>