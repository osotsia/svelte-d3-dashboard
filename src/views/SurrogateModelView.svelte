<script>
    import AnalysisGrid from '../components/common/AnalysisGrid.svelte';
    import AnalysisLoader from '../components/common/AnalysisLoader.svelte';

    const analysisIds = ['model-card', 'feature-importance', 'residuals'];
</script>

<AnalysisGrid>
    {#each analysisIds as id (id)}
        <AnalysisLoader {id} />
    {/each}
</AnalysisGrid>