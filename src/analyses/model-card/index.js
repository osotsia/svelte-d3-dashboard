import ModelCardDisplay from './ModelCardDisplay.svelte';

export default {
    id: 'model-card',
    title: 'Surrogate Model Card',
    component: ModelCardDisplay,
    layout: 'default',
    explanation: 'Key metadata and performance metrics for the trained XGBoost surrogate model.',
    props: {},
    // FIX: Standardized function signature
    getData: ($dataStore, $workingState) => ({
        data: $dataStore.model_card || {}
    })
};