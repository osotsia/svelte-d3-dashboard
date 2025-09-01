<script>
    import { scenarioStore } from '../../stores/scenarioStore.js';
    import { technoEconomicModel, parameterRanges } from '../../lib/model.js';

    // --- STATE & CALCULATIONS ---
    $: currentParameters = $scenarioStore.workingState.parameters || {};
    // @ts-ignore
    $: lcohResult = currentParameters.capital_cost ? technoEconomicModel(currentParameters) : 0;
    
    // --- EVENT HANDLERS ---
    function handleInput() {
        scenarioStore.setParameters(currentParameters);
    }
</script>

<h2 class="panel-title">Model Calculator</h2>
<div class="lcoh-result-box">
    <span>Levelized Cost of Heat (LCOH)</span>
    <span class="lcoh-value">{lcohResult.toFixed(2)}</span>
</div>

{#each Object.entries(parameterRanges) as [key, config] (key)}
    {@const id = `slider-${key}`}
    {@const format = (v) => v.toLocaleString(undefined, { maximumFractionDigits: key === 'efficiency' || key === 'interest_rate' ? 3 : 0 })}

    <div class="slider-group">
        <label for={id}>
            {key.replace(/_/g, ' ')}: 
            <span class="slider-value">
                {#if currentParameters[key] !== undefined}
                    {format(currentParameters[key])}
                {/if}
            </span>
        </label>
        <input 
            type="range" 
            {id} 
            min={config.min} 
            max={config.max} 
            step={config.step} 
            bind:value={currentParameters[key]} 
            on:input={handleInput} 
        />
    </div>
{/each}

<style>
    .panel-title { margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; color: var(--header-color); }
    .lcoh-result-box { background-color: var(--bg-color); border-radius: 6px; padding: 1rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; }
    .lcoh-value { font-size: 2rem; font-weight: 600; color: var(--header-color); }

    .slider-group { margin-bottom: 1rem; }
    .slider-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; }
    .slider-group input[type="range"] { width: 100%; cursor: pointer; }
    .slider-value { 
        font-weight: bold; 
        color: var(--header-color); 
        background-color: var(--active-color); 
        padding: 2px 6px; 
        border-radius: 4px; 
        font-size: 0.9em;
        /* Prevent layout shift when value is not yet available */
        display: inline-block;
        min-width: 40px; 
        text-align: right;
    }
</style>