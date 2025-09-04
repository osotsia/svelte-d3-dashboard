<script>
    import AnalysisGrid from '../components/AnalysisGrid.svelte';
    import AnalysisLoader from '../components/AnalysisLoader.svelte';

    let { analysisModules = [] } = $props();

    const analysisIds = $derived(analysisModules.map(module => module.id));
</script>

<AnalysisGrid>
    {#each analysisIds as id (id)}
        <AnalysisLoader {id} />
    {/each}
</AnalysisGrid>