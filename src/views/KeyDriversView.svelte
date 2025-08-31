<script>
    import AnalysisGridView from './AnalysisGridView.svelte';
    import { dataStore } from '../stores/dataStore.js';
    import { scenarioStore } from '../stores/scenarioStore.js';
    import { analyses } from '../analyses/index.js';
    import { analysisMappers } from '../lib/analysisMappers.js';

    const analysisIds = ['sobol', 'pcp'];

    $: analysesWithProps = analysisIds
        .map(id => {
            const staticConfig = analyses[id];
            if (!staticConfig) return null;

            const dynamicProps = analysisMappers[id] 
                ? analysisMappers[id]($dataStore, $scenarioStore.workingState)
                : {};

            return {
                ...staticConfig,
                props: { ...staticConfig.props, ...dynamicProps }
            };
        })
        .filter(Boolean)
        .sort((a, b) => {
            const isAFullWidth = a.layout === 'full-width';
            const isBFullWidth = b.layout === 'full-width';
            if (isAFullWidth === isBFullWidth) return 0;
            return isAFullWidth ? 1 : -1;
        });
</script>

<AnalysisGridView analyses={analysesWithProps} />