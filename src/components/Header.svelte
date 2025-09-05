<script lang="ts">
    import { activeView } from '../stores/viewStore.svelte.js';
    import ScenarioControls from './ScenarioControls.svelte';
    import { viewOrder } from '../views/view-registry.js';

    const views = viewOrder;
</script>

<header class="app-header">
    <div class="title-and-nav">
        <h1>LCOH Workbench</h1>
        <!-- MODIFICATION: Added ARIA role and label for navigation landmark -->
        <nav role="navigation" aria-label="Main Views">
            {#each views as view}
                <button 
                    class:active={activeView.value === view} 
                    onclick={() => activeView.set(view)}
                    aria-current={activeView.value === view ? 'page' : undefined}
                >
                    {view}
                </button>
            {/each}
        </nav>
    </div>
    <div class="scenario-controls-wrapper">
        <ScenarioControls />
    </div>
</header>

<style>
    /* Styles are unchanged */
    .app-header { display: flex; align-items: center; flex-wrap: wrap; gap: 1rem; padding: 1rem var(--spacing-unit); background-color: var(--panel-bg); border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .title-and-nav { display: flex; align-items: center; gap: 2rem; }
    .scenario-controls-wrapper { margin-left: auto; }
    h1 { margin: 0; font-size: 1.5rem; color: var(--header-color); }
    nav { display: flex; gap: 0.5rem; }
    nav button { background: none; border: none; font-size: 1rem; padding: 0.5rem 1rem; cursor: pointer; border-radius: 6px; color: var(--text-color-light); font-weight: 500; }
    nav button:hover { background-color: var(--bg-color); color: var(--text-color); }
    nav button.active { background-color: var(--active-color); color: var(--active-border); font-weight: 600; }
</style>