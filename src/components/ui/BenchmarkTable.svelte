<script>
    export let headers = [];
    export let rows = [];
</script>

<div class="table-container">
    <table>
        <thead>
            <tr>
                {#each headers as header}
                    <th>{header}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each rows as row}
                <tr>
                    {#each row as cell, i}
                        <td style:text-align={i === 0 ? 'left' : 'right'}>{cell}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .table-container {
        overflow-x: auto;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
    }
    th, td {
        padding: 0.75rem 1rem;
        border: 1px solid var(--border-color);
    }
    th {
        background-color: var(--bg-color);
        font-weight: 600;
        text-align: left;
        color: var(--text-color-light);
    }
    tbody tr:nth-child(even) {
        background-color: var(--bg-color);
    }
    td {
        font-family: monospace, sans-serif;
    }
</style>