<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    // This component was previously GroupedBarChart.svelte
    export let data = [];
    export let yKey = 'param';
    export let xKeys = ['S1', 'ST'];
    export let confKeys = ['S1_conf', 'ST_conf'];
    export let xLabel = '';
    
    let width = 600;
    let height = 400;
    const margin = { top: 20, right: 20, bottom: 60, left: 120 };
    let svgEl, xAxisG, yAxisG;

    $: innerWidth = width - margin.left - margin.right;
    $: innerHeight = height - margin.top - margin.bottom;

    $: yScale = d3.scaleBand()
        .domain(data.map(d => d[yKey]))
        .range([0, innerHeight])
        .padding(0.2);

    $: yInnerScale = d3.scaleBand()
        .domain(xKeys)
        .range([0, yScale.bandwidth()])
        .padding(0.05);
    
    $: xMax = d3.max(data, d => d3.max(xKeys, key => d[key] + d[confKeys[xKeys.indexOf(key)]]));
    $: xScale = d3.scaleLinear()
        .domain([0, xMax * 1.1]).nice()
        .range([0, innerWidth]);

    $: colorScale = d3.scaleOrdinal()
        .domain(xKeys)
        .range(['#1f77b4', '#ff7f0e']);

    $: if (xAxisG && yAxisG) {
        const xAxis = d3.axisBottom(xScale).ticks(5).tickSize(-innerHeight);
        d3.select(xAxisG).call(xAxis).selectAll('.tick text').style('font-size', '0.9rem');
        const yAxis = d3.axisLeft(yScale);
        d3.select(yAxisG).call(yAxis).selectAll('.tick text').style('font-size', '0.9rem');
    }
</script>

<div class="chart-container">
    <svg bind:this={svgEl} {width} {height} viewBox="0 0 {width} {height}" style="max-width: 100%;">
        <g transform="translate({margin.left}, {margin.top})">
            <g bind:this={xAxisG} transform="translate(0, {innerHeight})" class="axis x-axis"></g>
            <g bind:this={yAxisG} class="axis y-axis"></g>
            {#each data as d (d[yKey])}
                <g class="group" transform="translate(0, {yScale(d[yKey])})">
                    {#each xKeys as key, i}
                        {@const confKey = confKeys[i]}
                        {@const value = d[key]}
                        {@const conf = d[confKey]}
                        {@const barY = yInnerScale(key)}
                        <rect 
                            class="bar"
                            x={xScale(0)} 
                            y={barY} 
                            width={xScale(value)} 
                            height={yInnerScale.bandwidth()} 
                            fill={colorScale(key)}>
                            <title>{key}: {value.toFixed(3)} ± {conf.toFixed(3)}</title>
                        </rect>
                        {@const errorY = barY + yInnerScale.bandwidth() / 2}
                        <line class="error-line" x1={xScale(value - conf)} y1={errorY} x2={xScale(value + conf)} y2={errorY} />
                        <line class="error-tick" x1={xScale(value - conf)} y1={errorY - 4} x2={xScale(value - conf)} y2={errorY + 4} />
                        <line class="error-tick" x1={xScale(value + conf)} y1={errorY - 4} x2={xScale(value + conf)} y2={errorY + 4} />
                    {/each}
                </g>
            {/each}
            <text class="axis-label" x={innerWidth / 2} y={innerHeight + 45} text-anchor="middle">{xLabel}</text>
        </g>
    </svg>
    <div class="legend">
        {#each xKeys as key}
        <div class="legend-item">
            <span class="legend-color" style="background-color: {colorScale(key)}"></span>
            {key === 'S1' ? 'S1 (First-order)' : 'ST (Total-order)'}
        </div>
        {/each}
    </div>
</div>

<style>
    .chart-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
    .legend {
        display: flex;
        gap: 1rem;
        margin-top: 0.75rem;
        justify-content: center;
        font-size: 0.9em;
    }
    .legend-item { display: flex; align-items: center; gap: 0.4rem; }
    .legend-color { width: 14px; height: 14px; border-radius: 2px; }
    .axis.x-axis :global(.tick line) { stroke: var(--border-color); stroke-dasharray: 2,2; }
    .axis.x-axis :global(.domain) { display: none; }
    .axis.y-axis :global(.domain) { stroke: var(--text-color); }
    .error-line, .error-tick { stroke: #333; stroke-width: 1.5px; }
    .axis-label { font-size: 0.9rem; font-weight: 500; fill: var(--text-color-light); }
    .bar {
        transition: filter 0.2s ease-in-out;
    }
    .bar:hover {
        filter: brightness(85%);
    }
</style>