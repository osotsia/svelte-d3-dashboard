<script>
    import { scenarioStore } from '../stores/scenarioStore.svelte.js';
    import { dataStore } from '../stores/dataStore.svelte.js';
    import { modules } from '../modules/module-registry.js';
    import ModuleBox from './ModuleBox.svelte';

    let { id } = $props();

    // --- Data Loading and Prop Assembly ---
    const moduleConfig = modules[id];
    // Assign the component constructor to a capitalized variable.
    const Component = moduleConfig?.component;

    const dynamicProps = $derived(moduleConfig?.mapStateToProps
        ? moduleConfig.mapStateToProps(dataStore, scenarioStore.workingState)
        : {});

    const finalProps = $derived({ ...moduleConfig?.props, ...dynamicProps });
    
    // --- State and Event Handlers ---
    const isPinned = $derived(scenarioStore.workingState?.pinned.some(p => p.id === id));

    function handleTogglePin(event) {
        const { id, title } = event.detail;
        const currentPins = scenarioStore.workingState?.pinned || [];
        const isCurrentlyPinned = currentPins.some(item => item.id === id);
        
        const newPins = isCurrentlyPinned
            ? currentPins.filter(item => item.id !== id)
            : [...currentPins, { id, title }];
            
        scenarioStore.updateWorkingState({ pinned: newPins });
    }

    function handleUpdate(event) {
        if (moduleConfig?.handleUpdate) {
            moduleConfig.handleUpdate(event);
        }
    }
</script>

{#if moduleConfig && Component}
    <ModuleBox
        id={moduleConfig.id}
        title={moduleConfig.title}
        layout={moduleConfig.layout}
        explanation={moduleConfig.explanation}
        isPinned={isPinned}
        on:togglePin={handleTogglePin}
    >
        <Component
            {...finalProps}
            on:update={handleUpdate}
        />
    </ModuleBox>
{/if}