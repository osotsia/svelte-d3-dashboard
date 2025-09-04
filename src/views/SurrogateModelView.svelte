<script>
    import AnalysisGrid from '../components/AnalysisGrid.svelte';
    import AnalysisLoader from '../components/AnalysisLoader.svelte';

    const analysisIds = ['model-card', 'feature-importance', 'residuals'];
</script>

<AnalysisGrid>
    {#each analysisIds as id (id)}
        <AnalysisLoader {id} />
    {/each}
</AnalysisGrid>