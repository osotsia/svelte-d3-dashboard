<script>
    import AnalysisGrid from '../components/AnalysisGrid.svelte';
    import AnalysisLoader from '../components/AnalysisLoader.svelte';

    // These IDs correspond to the static data definitions in analyses/static_data.js
    const dataItemIds = [
        'assumption-efficiency',
        'assumption-capital-costs',
        'assumption-labor',
        'benchmark-lcoh'
    ];
</script>

<AnalysisGrid>
    {#each dataItemIds as id (id)}
        <AnalysisLoader {id} />
    {/each}
</AnalysisGrid>