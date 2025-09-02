<script>
    import { scenarioStore } from '../../stores/scenarioStore.js';
    import { dataStore } from '../../stores/dataStore.js';
    import { analyses } from '../../analyses/index.js';
    import AnalysisBox from '../ui/AnalysisBox.svelte';

    export let id;

    // --- Data Loading and Prop Assembly ---
    $: staticConfig = analyses[id];
    $: dynamicProps = staticConfig?.mapper
        ? staticConfig.mapper($dataStore, $scenarioStore.workingState)
        : {};
    $: finalProps = { ...staticConfig?.props, ...dynamicProps };
    
    // --- State and Event Handlers ---
    $: isPinned = $scenarioStore.workingState.pinned.some(p => p.id === id);

    function handleTogglePin(event) {
        const { id, title } = event.detail;
        const currentPins = $scenarioStore.workingState.pinned || [];
        const isCurrentlyPinned = currentPins.some(item => item.id === id);
        
        const newPins = isCurrentlyPinned
            ? currentPins.filter(item => item.id !== id)
            : [...currentPins, { id, title }];
            
        scenarioStore.setPinnedItems(newPins);
    }

    function handleUpdate(event) {
        // Generic handler: invokes updater if defined in the analysis config.
        if (staticConfig?.updater) {
            staticConfig.updater(event);
        }
    }
</script>

{#if staticConfig}
    <AnalysisBox
        id={staticConfig.id}
        title={staticConfig.title}
        layout={staticConfig.layout}
        explanation={staticConfig.explanation}
        isPinned={isPinned}
        on:togglePin={handleTogglePin}
    >
        <svelte:component
            this={staticConfig.component}
            {...finalProps}
            on:update={handleUpdate}
        />
    </AnalysisBox>
{/if}