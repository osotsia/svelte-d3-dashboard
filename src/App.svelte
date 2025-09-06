<script>
    import { onMount } from 'svelte';
    import { activeView } from './stores/viewStore.svelte.js';
    import { scenarioStore } from './stores/scenarioStore.svelte.js';
    import { parameterRanges } from './lib/model.js';
    import { viewRegistry } from './views/view-registry.js';

    import Header from './components/Header.svelte';
    import ReportView from './views/ReportView.svelte';
    import GenericView from './views/GenericView.svelte';

    let initialized = $state(false);

    const viewComponents = {
        'Report': { component: ReportView, props: {} },
        'Key Drivers': { component: GenericView, props: { analysisModules: viewRegistry['Key Drivers'] } },
        'Surrogate Model': { component: GenericView, props: { analysisModules: viewRegistry['Surrogate Model'] } },
        'Data': { component: GenericView, props: { analysisModules: viewRegistry['Data'] } }
    };

    const ActiveViewConfig = $derived(viewComponents[activeView.value]);
    const ActiveComponent = $derived(ActiveViewConfig?.component);
    const activeProps = $derived(ActiveViewConfig?.props || {});

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

        initialized = true;
    });
</script>

<main>
    <Header />
    {#if initialized && ActiveComponent}
        <ActiveComponent {...activeProps} />
    {/if}
</main> 
