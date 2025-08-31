<script>
    import { scenarioStore } from '../../stores/scenarioStore.js';
    import Icon from '../ui/Icon.svelte';

    let scenariosList = [];
    $: scenariosList = Object.keys($scenarioStore.scenarios).sort();
</script>

<div class="scenario-manager">
    <div class="scenarios-list">
        {#each scenariosList as name}
            <button class="scenario-item" class:active={name === $scenarioStore.activeScenarioName} on:click={() => scenarioStore.loadScenario(name)}>
                {name}
            </button>
        {/each}
    </div>
    <div class="scenario-controls">
        <button on:click={() => scenarioStore.saveCurrentScenario(prompt('Enter scenario name:'))} title="Save current parameters">
            <Icon name="save"/>
        </button>
        <button on:click={() => scenarioStore.deleteScenario($scenarioStore.activeScenarioName)} disabled={!$scenarioStore.activeScenarioName} title="Delete selected scenario">
            <Icon name="trash"/>
        </button>
    </div>
</div>

<style>
    .scenario-manager { display: flex; align-items: center; gap: 1rem; }
    .scenarios-list { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .scenario-item { background-color: var(--bg-color); border: 1px solid var(--border-color); border-radius: 5px; padding: 0.4rem 0.8rem; font-size: 0.9rem; cursor: pointer; }
    .scenario-item:hover { border-color: #aaa; }
    .scenario-item.active { background-color: var(--active-color); border-color: var(--active-border); color: var(--header-color); font-weight: 600; }
    .scenario-controls { display: flex; gap: 0.5rem; }
    .scenario-controls button { background: none; border: none; cursor: pointer; color: var(--text-color-light); padding: 6px; border-radius: 50%; }
    .scenario-controls button:hover:not(:disabled) { background-color: var(--bg-color); color: var(--text-color); }
    .scenario-controls button:disabled { color: #ccc; cursor: not-allowed; }
</style>