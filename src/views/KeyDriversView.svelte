<script>
    import AnalysisGrid from '../components/AnalysisGrid.svelte';
    import AnalysisLoader from '../components/AnalysisLoader.svelte';
    import { analyses } from '../modules/index.js';

    const analysisIds = ['sobol', 'pcp'];
    
    // Sort to ensure full-width items are rendered after standard items for proper grid flow.
    const sortedAnalysisIds = [...analysisIds].sort((a, b) => {
        const isAFullWidth = analyses[a]?.layout === 'full-width';
        const isBFullWidth = analyses[b]?.layout === 'full-width';
        if (isAFullWidth === isBFullWidth) return 0;
        return isAFullWidth ? 1 : -1;
    });
</script>

<AnalysisGrid>
    {#each sortedAnalysisIds as id (id)}
        <AnalysisLoader {id} />
    {/each}
</AnalysisGrid>