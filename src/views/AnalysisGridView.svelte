<script>
    export let maxColumns = null;
    
    $: gridStyle = maxColumns ? `grid-template-columns: repeat(${maxColumns}, 1fr);` : '';
</script>

<div class="view-container" style={gridStyle}>
    <slot></slot>
</div>

<style>
    .view-container {
        display: grid;
        /* Increased minmax to fix original squishing bug and prevent wrapping */
        grid-template-columns: repeat(auto-fill, minmax(550px, 1fr));
        gap: var(--spacing-unit);
    }
    /* Adjusted selector to work with slotted AnalysisBox components */
    :global(.view-container > .analysis-box.full-width) {
        grid-column: 1 / -1;
    }
</style>