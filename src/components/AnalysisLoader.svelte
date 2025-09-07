<script>
    import { scenarioStore } from '../stores/scenarioStore.svelte.js';
    import { dataStore } from '../stores/dataStore.svelte.js';
    import { modules } from '../modules/module-registry.js';
    import AnalysisBox from './AnalysisBox.svelte';

    let { id } = $props();

    // --- Data Loading and Prop Assembly ---
    const staticConfig = modules[id];
    // Assign the component constructor to a capitalized variable.
    const Component = staticConfig?.component;

    const dynamicProps = $derived(staticConfig?.mapStateToProps
        ? staticConfig.mapStateToProps(dataStore, scenarioStore.workingState)
        : {});

    const finalProps = $derived({ ...staticConfig?.props, ...dynamicProps });
    
    // --- State and Event Handlers ---
    const isPinned = $derived(scenarioStore.workingState?.pinned.some(p => p.id === id));

    function handleTogglePin(event) {
        const { id, title } = event.detail;
        const currentPins = scenarioStore.workingState?.pinned || [];
        const isCurrentlyPinned = currentPins.some(item => item.id === id);
        
        const newPins = isCurrentlyPinned
            ? currentPins.filter(item => item.id !== id)
            : [...currentPins, { id, title }];
            
        scenarioStore.updateWorkingState({ pinned: newPins });
    }

    function handleUpdate(event) {
        if (staticConfig?.handleUpdate) {
            staticConfig.handleUpdate(event);
        }
    }
</script>

{#if staticConfig && Component}
    <AnalysisBox
        id={staticConfig.id}
        title={staticConfig.title}
        layout={staticConfig.layout}
        explanation={staticConfig.explanation}
        isPinned={isPinned}
        on:togglePin={handleTogglePin}
    >
        <Component
            {...finalProps}
            on:update={handleUpdate}
        />
    </AnalysisBox>
{/if}