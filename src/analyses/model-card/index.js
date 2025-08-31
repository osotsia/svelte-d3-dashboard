import ModelCardDisplay from './ModelCardDisplay.svelte';

export default {
    id: 'model-card',
    title: 'Surrogate Model Card',
    component: ModelCardDisplay,
    layout: 'default', // Ensures it is not full-width
    explanation: 'Key metadata and performance metrics for the trained XGBoost surrogate model.',
    props: {}, // No specific props needed, data is passed directly
    getData: ($dataStore) => ({
        data: $dataStore.model_card || {}
    })
};