<script>
    let { data = {} } = $props();
</script>

<div class="info-grid">
    {#each Object.entries(data) as [key, value]}
        {#if value !== null && value !== undefined}
            <div class="info-item">
                <span class="info-key">{key.replace(/_/g, ' ')}</span>
                <span class="info-value">{value}</span>
            </div>
        {/if}
    {/each}
</div>

<style>
    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 0.75rem 1.5rem;
    }
    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        font-size: 0.95rem;
        border-bottom: 1px solid var(--bg-color);
        padding-bottom: 0.5rem;
    }
    .info-key {
        color: var(--text-color-light);
        text-transform: capitalize;
        padding-right: 1rem;
    }
    .info-value {
        font-weight: 600;
        text-align: right;
        font-family: monospace, sans-serif;
    }
</style>