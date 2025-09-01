<script>
    import AnalysisGridView from './AnalysisGridView.svelte';
    import AnalysisLoader from '../components/common/AnalysisLoader.svelte';

    const analysisIds = ['model-card', 'feature-importance', 'residuals'];
</script>

<AnalysisGridView maxColumns={2}>
    {#each analysisIds as id (id)}
        <AnalysisLoader {id} />
    {/each}
</AnalysisGridView>