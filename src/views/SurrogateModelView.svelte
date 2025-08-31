<script>
    import AnalysisGridView from './AnalysisGridView.svelte';
    import { dataStore } from '../stores/dataStore.js';
    import { scenarioStore } from '../stores/scenarioStore.js';
    import { analyses } from '../analyses/index.js';
    import { analysisMappers } from '../lib/analysisMappers.js';

    const analysisIds = ['model-card', 'feature-importance', 'residuals'];

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
        .filter(Boolean);
</script>

<AnalysisGridView analyses={analysesWithProps} maxColumns={2} />