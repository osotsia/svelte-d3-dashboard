<script>
    import { scenarioStore } from '../stores/scenarioStore.svelte.js';
    import Icon from './Icon.svelte';

    const scenariosList = $derived(Object.keys(scenarioStore.scenarios).sort());

    function handleLoad(name) {
        if (scenarioStore.isDirty && !confirm(`You have unsaved changes. Discard them and load "${name}"?`)) {
            return;
        }
        scenarioStore.loadScenario(name);
    }

    function handleNew() {
        if (scenarioStore.isDirty && !confirm('You have unsaved changes. Discard them and start a new scenario?')) {
            return;
        }
        scenarioStore.newScenario();
    }

    function handleSave() {
        const name = prompt('Enter scenario name:', scenarioStore.activeScenarioName || '');
        if (name && name.trim()) {
            scenarioStore.saveCurrentScenario(name.trim());
        }
    }

    function handleDelete() {
        const name = scenarioStore.activeScenarioName;
        if (!name) return;
        if (confirm(`Are you sure you want to delete scenario "${name}"?`)) {
            scenarioStore.deleteScenario(name);
        }
    }
</script>

<div class="scenario-manager">
    <div class="scenarios-list">
        {#each scenariosList as name (name)}
            <button 
                class="scenario-item" 
                class:active={name === scenarioStore.activeScenarioName} 
                onclick={() => handleLoad(name)}
            >
                {name}
                {#if name === scenarioStore.activeScenarioName && scenarioStore.isDirty}
                    <span class="dirty-indicator">*</span>
                {/if}
            </button>
        {/each}
    </div>
    <div class="scenario-controls">
        <button onclick={handleNew} title="New Scenario">
            <Icon name="new"/>
        </button>
        <button onclick={handleSave} disabled={!scenarioStore.isDirty} title="Save current scenario">
            <Icon name="save"/>
        </button>
        <button onclick={handleDelete} disabled={!scenarioStore.activeScenarioName} title="Delete selected scenario">
            <Icon name="trash"/>
        </button>
    </div>
</div>

<style>
    /* Styles are unchanged */
    .scenario-manager { display: flex; align-items: center; gap: 1rem; }
    .scenarios-list { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .scenario-item { background-color: var(--bg-color); border: 1px solid var(--border-color); border-radius: 5px; padding: 0.4rem 0.8rem; font-size: 0.9rem; cursor: pointer; position: relative; }
    .scenario-item:hover { border-color: #aaa; }
    .scenario-item.active { background-color: var(--active-color); border-color: var(--active-border); color: var(--header-color); font-weight: 600; }
    .scenario-controls { display: flex; gap: 0.5rem; }
    .scenario-controls button { background: none; border: none; cursor: pointer; color: var(--text-color-light); padding: 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .scenario-controls button:hover:not(:disabled) { background-color: var(--bg-color); color: var(--text-color); }
    .scenario-controls button:disabled { color: #ccc; cursor: not-allowed; }
    .dirty-indicator { color: var(--active-border); font-weight: bold; margin-left: 4px; }
</style>