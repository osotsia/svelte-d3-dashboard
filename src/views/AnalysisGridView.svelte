<script>
    import { analyses } from '../analyses/index.js';
    import { dataStore } from '../stores/dataStore.js';
    import { scenarioStore } from '../stores/scenarioStore.js';
    import AnalysisBox from '../components/ui/AnalysisBox.svelte';

    export let analysisIds = [];
    export let maxColumns = null;

    $: allAnalyses = analysisIds
        .map(id => analyses[id])
        .filter(Boolean);
    
    $: nonFullWidthCount = allAnalyses.filter(a => a.layout !== 'full-width').length;
    $: hasFullWidthItems = allAnalyses.some(a => a.layout === 'full-width');
    $: isThinLayoutScenario = nonFullWidthCount === 1 && hasFullWidthItems;

    $: viewAnalyses = [...allAnalyses].sort((a, b) => {
        const isAFullWidth = a.layout === 'full-width';
        const isBFullWidth = b.layout === 'full-width';
        if (isAFullWidth === isBFullWidth) return 0;
        return isAFullWidth ? 1 : -1;
    });
    
    $: gridStyle = maxColumns ? `grid-template-columns: repeat(${maxColumns}, 1fr);` : '';

    function handleUpdate(event, id) {
        if (id === 'pcp') {
            scenarioStore.setPcpSelections(event.detail);
        }
    }
</script>

<div class="view-container" style={gridStyle}>
    {#each viewAnalyses as analysis (analysis.id)}
        {@const effectiveLayout = isThinLayoutScenario && analysis.layout !== 'full-width' ? 'full-width' : analysis.layout}
        <AnalysisBox
            id={analysis.id}
            title={analysis.title}
            layout={effectiveLayout}
            explanation={analysis.explanation}
        >
            <svelte:component
                this={analysis.component}
                {...analysis.props}
                {...analysis.getData($dataStore, $scenarioStore.workingState)}
                on:update={(e) => handleUpdate(e, analysis.id)}
            />
        </AnalysisBox>
    {/each}
</div>

<style>
    .view-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
        gap: var(--spacing-unit);
    }
    :global(.view-container > .full-width) {
        grid-column: 1 / -1;
    }
</style>