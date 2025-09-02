<script>
    // The maxColumns prop is no longer necessary as this behavior is now the default.
</script>

<div class="view-container">
    <slot></slot>
</div>

<style>
    .view-container {
        display: grid;
        /* Default to a two-column layout that allows items to shrink. */
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-unit);
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