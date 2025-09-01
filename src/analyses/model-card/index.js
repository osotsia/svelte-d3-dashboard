import ModelCardDisplay from './ModelCardDisplay.svelte';

export default {
    id: 'model-card',
    title: 'Surrogate Model Card',
    component: ModelCardDisplay,
    layout: 'default',
    explanation: 'Key metadata and performance metrics for the XGBoost surrogate model. We train a surrogate when the original model is slow or otherwise costly to evaluate.',
    props: {},
    mapper: ($dataStore, $workingState) => ({
        data: $dataStore.model_card || {}
    })
};