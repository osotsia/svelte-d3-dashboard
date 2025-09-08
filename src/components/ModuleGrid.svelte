<script>
    // MODIFICATION: Add a default value ('') to the className binding.
    // This makes the 'class' prop optional, resolving the error.
    let { class: className = '', children, ...rest } = $props();
</script>

<div class="view-container {className || ''}" {...rest}>
    {@render children()}
</div>

<style>
    .view-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-unit);
    }

    .view-container.allow-three-columns {
        @media (min-width: 1400px) {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 768px) {
        .view-container {
            grid-template-columns: 1fr;
        }
    }

    :global(.view-container > .module-box.full-width) {
        grid-column: 1 / -1;
    }
</style>