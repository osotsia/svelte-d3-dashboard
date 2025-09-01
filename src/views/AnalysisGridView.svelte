<script>
    import { scenarioStore } from '../stores/scenarioStore.js';
    import AnalysisBox from '../components/ui/AnalysisBox.svelte';

    export let analyses = [];
    export let maxColumns = null;
    
    $: gridStyle = maxColumns ? `grid-template-columns: repeat(${maxColumns}, 1fr);` : '';

    function handleUpdate(event, id) {
        if (id === 'pcp') {
            scenarioStore.setPcpSelections(event.detail);
        }
    }

    function handleTogglePin(event) {
        const { id, title } = event.detail;
        const currentPins = $scenarioStore.workingState.pinned || [];
        const isCurrentlyPinned = currentPins.some(item => item.id === id);
        
        const newPins = isCurrentlyPinned
            ? currentPins.filter(item => item.id !== id)
            : [...currentPins, { id, title }];
            
        scenarioStore.setPinnedItems(newPins);
    }
</script>

<div class="view-container" style={gridStyle}>
    {#each analyses as analysis (analysis.id)}
        {@const isPinned = $scenarioStore.workingState.pinned.some(p => p.id === analysis.id)}
        <AnalysisBox
            id={analysis.id}
            title={analysis.title}
            layout={analysis.layout}
            explanation={analysis.explanation}
            isPinned={isPinned}
            on:togglePin={handleTogglePin}
        >
            <svelte:component
                this={analysis.component}
                {...analysis.props}
                on:update={(e) => handleUpdate(e, analysis.id)}
            />
        </AnalysisBox>
    {/each}
</div>

<style>
    .view-container {
        display: grid;
        /* Changed auto-fit to auto-fill to prevent single items from stretching */
        grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
        gap: var(--spacing-unit);
    }
    :global(.view-container > .full-width) {
        grid-column: 1 / -1;
    }
</style>