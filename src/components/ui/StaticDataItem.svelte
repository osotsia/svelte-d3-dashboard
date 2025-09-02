<script>
    export let data = {};
</script>

<div class="data-item-grid">
    {#each Object.entries(data) as [key, value]}
        <div class="item-row">
            <span class="item-key">{key}</span>
            <span class="item-value">{value}</span>
        </div>
    {/each}
</div>

<style>
    .data-item-grid {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    .item-row {
        display: grid;
        grid-template-columns: 100px 1fr;
        align-items: baseline;
        gap: 1rem;
        font-size: 0.95rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--bg-color);
    }
    .item-key {
        color: var(--text-color-light);
        font-weight: 600;
        text-align: right;
    }
    .item-value {
        font-family: monospace, sans-serif;
        word-break: break-word;
    }
</style>