<script>
    import { scenarioStore } from '../../stores/scenarioStore.svelte.js';
    import { technoEconomicModel, parameterRanges } from '../../lib/model.js';

    const lcohResult = $derived(
        scenarioStore.workingState?.parameters.capital_cost
        ? technoEconomicModel(scenarioStore.workingState.parameters)
        : 0
    );
    
    const formatValue = (key, value) => {
        if (value === undefined) return '';
        const options = { maximumFractionDigits: key === 'efficiency' || key === 'interest_rate' ? 3 : 0 };
        return value.toLocaleString(undefined, options);
    };

    function handleInput(key, event) {
        const newParameters = {
            ...scenarioStore.workingState.parameters,
            [key]: Number(event.currentTarget.value)
        };
        scenarioStore.updateWorkingState({ parameters: newParameters });
    }
</script>

<h2 class="panel-title">Model Calculator</h2>
<div class="lcoh-result-box">
    <span>Levelized Cost of Heat (LCOH)</span>
    <span class="lcoh-value">{lcohResult.toFixed(2)} <span class="lcoh-unit">($/Unit)</span></span>
</div>

{#if scenarioStore.workingState}
    {#each Object.entries(parameterRanges) as [key, config] (key)}
        {@const id = `slider-${key}`}
        <div class="slider-group">
            <label for={id}>
                {key.replace(/_/g, ' ')}: 
                <span class="slider-value">
                    {formatValue(key, scenarioStore.workingState.parameters[key])}
                </span>
            </label>
            <input 
                type="range" 
                {id} 
                min={config.min} 
                max={config.max} 
                step={config.step} 
                value={scenarioStore.workingState.parameters[key]}
                oninput={(e) => handleInput(key, e)}
            />
        </div>
    {/each}
{/if}

<style>
    .panel-title { margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; color: var(--header-color); }
    .lcoh-result-box { background-color: var(--bg-color); border-radius: 6px; padding: 1rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; }
    .lcoh-value { font-size: 2rem; font-weight: 600; color: var(--header-color); }
    .lcoh-unit { font-size: 1.2rem; font-weight: 400; color: var(--text-color-light); }
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
        display: inline-block;
        min-width: 40px; 
        text-align: right;
    }
</style>