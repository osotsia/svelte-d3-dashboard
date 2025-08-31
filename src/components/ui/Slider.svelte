<script>
    import { createEventDispatcher } from 'svelte';

    export let label = '';
    export let value = 0;
    export let min = 0;
    export let max = 100;
    export let step = 1;
    export let format = (v) => v.toLocaleString();

    const dispatch = createEventDispatcher();

    function onInput(event) {
        value = Number(event.target.value);
        dispatch('input', { value: value });
    }
</script>

<div class="slider-group">
    <label>
        {label}: <span class="slider-value">{format(value)}</span>
    </label>
    <input type="range" {min} {max} {step} bind:value={value} on:input={onInput} />
</div>

<style>
    .slider-group { margin-bottom: 1rem; }
    .slider-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; }
    .slider-group input[type="range"] { width: 100%; cursor: pointer; }
    .slider-value { font-weight: bold; color: var(--header-color); background-color: var(--active-color); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
</style>