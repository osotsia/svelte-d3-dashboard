import ModelCardDisplay from './ModelCardDisplay.svelte';

export default {
    id: 'model-card',
    title: 'Model Card (Surrogate)',
    component: ModelCardDisplay,
    layout: 'default',
    explanation: 'We train a surrogate when the original model is slow or otherwise costly to evaluate. Below: key metadata and performance metrics for the XGBoost surrogate model.',
    props: {},
    mapper: ($dataStore, $workingState) => ({
        data: $dataStore.model_card || {}
    })
};