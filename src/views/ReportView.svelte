<script>
    import { scenarioStore } from '../stores/scenarioStore.js';
    // Import the new and updated components
    import AnalysisGrid from '../components/common/AnalysisGrid.svelte';
    import AnalysisLoader from '../components/common/AnalysisLoader.svelte';
    import Calculator from '../components/ui/ModelCalculator.svelte';

    // --- EVENT HANDLERS ---
    function handleNarrativeInput(event) {
        scenarioStore.setNarrative(event.target.value);
    }
</script>

<div class="report-grid">
    <!-- Model Details Panel (unchanged) -->
    <div class="panel model-panel">
        <h2 class="panel-title">Model Details</h2>
        <div class="model-explanation">
            <p>This is a simplified model for a system with a stable fossil-fuel combustion input. The LCOH is calculated as a sum of non-linear functions representing capital, financing, operational, and interaction effects:</p>
            <p class="math"><em>LCOH = f(C, η, r, F) = Base + Finance + Ops + Interaction</em></p>
            <ul>
                <li><strong>Base Cost:</strong> A polynomial function combining a linear penalty for high capital cost (<em>C</em>) with a cubic term for efficiency (<em>η</em>), representing diminishing returns at high efficiency levels.</li>
                <li><strong>Financing Cost:</strong> An exponential function of the interest rate (<em>r</em>), reflecting the compounding nature of financing. It also includes an interaction term with capital cost.</li>
                <li><strong>Operational Cost:</strong> A function of fuel cost (<em>F</em>) with a reciprocal relationship to efficiency (<em>~1/η</em>), where higher efficiency significantly reduces operational expenses.</li>
                <li><strong>Interaction Effect:</strong> A trigonometric (cosine) function that models complex, non-monotonic interactions between fuel cost and interest rate, introducing cyclical effects.</li>
            </ul>
        </div>
    </div>

    <!-- LCOH Calculator Panel -->
    <div class="panel controls-panel">
        <Calculator />
    </div>

    <!-- Analyst's Narrative Panel -->
    <div class="panel narrative-panel">
        <h2 class="panel-title">Analyst's Narrative</h2>
        <textarea 
            placeholder="Summarize findings, context, and recommendations here..."
            value={$scenarioStore.workingState.narrative || ''}
            on:input={handleNarrativeInput}
        ></textarea>
    </div>

    <!-- Pinned Items Panel -->
    <div class="panel pinned-items-panel">
        <h2 class="panel-title">Pinned Analyses</h2>
        {#if !$scenarioStore.workingState.pinned || $scenarioStore.workingState.pinned.length === 0}
            <div class="placeholder">Click the pin icon on an analysis in other views to add it to this report.</div>
        {:else}
            <AnalysisGrid>
                {#each $scenarioStore.workingState.pinned as pinnedItem (pinnedItem.id)}
                    <AnalysisLoader id={pinnedItem.id} />
                {/each}
            </AnalysisGrid>
        {/if}
    </div>
</div>


<style>
    .report-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--spacing-unit); }
    .panel { background-color: var(--panel-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: var(--spacing-unit); box-shadow: 0 2px 4px rgba(0,0,0,0.04); }
    .panel-title { margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; color: var(--header-color); }
    .model-panel { grid-column: 1 / span 5; }
    .controls-panel { grid-column: 6 / span 7; }
    .narrative-panel, .pinned-items-panel { grid-column: 1 / -1; }
    textarea { width: 100%; height: 120px; resize: vertical; border: 1px solid var(--border-color); border-radius: 6px; padding: 0.75rem; font-family: inherit; font-size: 0.95rem; }
    .placeholder { display: flex; align-items: center; justify-content: center; min-height: 200px; color: var(--text-color-light); background-color: var(--bg-color); border-radius: 6px; text-align: center; padding: 1rem; }
    @media (max-width: 1200px) { 
        .model-panel, 
        .controls-panel, 
        .narrative-panel { 
            grid-column: 1 / -1; 
        } 
    }
</style>