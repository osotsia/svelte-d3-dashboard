<script>
    // The maxColumns prop is no longer necessary as this behavior is now the default.
</script>

<!-- 
  MODIFICATION: Added `{$$props.class || ''}`.
  This takes any class string passed to <AnalysisGrid> and adds it to this div.
-->
<div class="view-container {$$props.class || ''}">
    <slot></slot>
</div>

<style>
    .view-container {
        display: grid;
        /* Default to a two-column layout that allows items to shrink. */
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-unit);
    }

    /* New class for views that can support 3 columns */
    .view-container.allow-three-columns {
        /* On sufficiently wide screens, switch to 3 columns */
        @media (min-width: 1400px) {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    /* On smaller screens (e.g., portrait tablets and phones), switch to a single column. */
    @media (max-width: 768px) {
        .view-container {
            grid-template-columns: 1fr;
        }
    }

    :global(.view-container > .analysis-box.full-width) {
        grid-column: 1 / -1;
    }
</style>