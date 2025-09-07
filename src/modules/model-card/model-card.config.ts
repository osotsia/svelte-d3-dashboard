import ModelCardDisplay from './ModelCard.svelte';
import type { ModuleConfig } from '../../lib/types';

const config: ModuleConfig = {
    id: 'model-card',
    title: 'Model Card (Surrogate)',
    component: ModelCardDisplay,
    layout: 'default',
    view: 'Surrogate Model', 
    explanation: 'We train a surrogate when the original model is slow or otherwise costly to evaluate. Below: key metadata and performance metrics.',
    props: {},
    mapStateToProps: (dataStore, $workingState) => ({
        data: dataStore.model_card || {}
    })
};


export default config;
