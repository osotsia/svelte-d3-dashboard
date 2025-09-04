<script>
    import { createEventDispatcher } from 'svelte';
    import * as d3 from 'd3';
    import Axis from './Axis.svelte';

    let { data = [], keys = [], colorKey = '', selections = {} } = $props();

    function processData(inputData, dimensionKeys, selectionsMap, colorDimensionKey, lineGen, colorScale) {
        if (!inputData || !dimensionKeys || !lineGen || !colorScale) return [];
        return inputData.map(d => {
            const isActive = Array.from(selectionsMap).every(([key, [min, max]]) => {
                const value = d[key];
                return value >= min && value <= max;
            });
            return {
                ...d,
                path: lineGen(d3.cross(dimensionKeys, [d], (key, d) => [key, d[key]])),
                stroke: isActive ? colorScale(d[colorDimensionKey]) : "#d1d1d1",
                opacity: isActive ? 0.7 : 0.2,
                isActive
            };
        }).sort((a, b) => a.isActive - b.isActive);
    }

    const dispatch = createEventDispatcher();
    const margin = { top: 30, right: 10, bottom: 20, left: 10 };
    let width = 1100;
    
    const selectionsMap = $derived(new Map(Object.entries(selections)));
    const height = $derived(keys.length * 180 + margin.top + margin.bottom);
    
    const x = $derived(new Map(Array.from(keys, key =>
        [key, d3.scaleLinear(d3.extent(data, d => d[key]), [margin.left, width - margin.right])]
    )));
    
    const y = $derived(d3.scalePoint(keys, [margin.top, height - margin.bottom]));
    const color = $derived(d3.scaleSequential(x.get(colorKey)?.domain(), d3.interpolateBrBG));
    
    const lineGenerator = $derived(d3.line()
        .defined(([, value]) => value != null)
        .x(([key, value]) => x.get(key)(value))
        .y(([key]) => y(key)));

    const pathData = $derived(processData(data, keys, selectionsMap, colorKey, lineGenerator, color));

    function handleBrush(event) {
        const { key, extent } = event.detail;
        const newSelections = { ...selections };
        if (extent === null) {
            delete newSelections[key];
        } else {
            newSelections[key] = extent;
        }
        dispatch('update', newSelections);
    }
</script>

<div class="chart-container">
    <svg {width} {height} viewBox="0 0 {width} {height}" style="max-width: 100%;">
        <g fill="none" stroke-width="1.5">
            {#each pathData as d, i (i)}
                <path d={d.path} stroke={d.stroke} stroke-opacity={d.opacity}>
                    <title>{keys.map(key => `${key}: ${d[key]}`).join("\n")}</title>
                </path>
            {/each}
        </g>
        <g class="axes">
            {#each keys as key}
                <Axis
                    pcpKey={key}
                    scale={x.get(key)}
                    transform="translate(0,{y(key)})"
                    on:brush={handleBrush}
                    selectionExtent={selections[key] || null}
                />
            {/each}
        </g>
    </svg>
</div>

<style>
    .chart-container { width: 100%; }
    .axes :global(.domain) { stroke: #aaa; }
    .axes :global(.tick line) { stroke: #ddd; }
    .axes :global(.selection) { fill: var(--header-color); fill-opacity: 0.2; stroke: var(--header-color); }
</style>