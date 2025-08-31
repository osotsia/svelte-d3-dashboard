<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    export let data = [];
    export let yKey = 'label';
    export let xKey = 'value';
    export let yLabel = '';
    export let xLabel = '';

    let width = 500;
    let height = 300;
    const margin = { top: 20, right: 30, bottom: 60, left: 120 };
    let svgEl, xAxisG, yAxisG;

    $: innerWidth = width - margin.left - margin.right;
    $: innerHeight = height - margin.top - margin.bottom;

    $: yScale = d3.scaleBand()
        .domain(data.map(d => d[yKey]))
        .range([0, innerHeight])
        .padding(0.1);

    $: xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[xKey])])
        .range([0, innerWidth]);

    $: if (xAxisG && yAxisG) {
        const xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(".2f"));
        d3.select(xAxisG).call(xAxis);
        const yAxis = d3.axisLeft(yScale);
        d3.select(yAxisG).call(yAxis);
    }

    onMount(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (!entries || !entries.length) return;
            width = entries[0].contentRect.width;
        });
        resizeObserver.observe(svgEl.parentElement);
        return () => resizeObserver.disconnect();
    });
</script>

<div class="chart-container">
    <svg bind:this={svgEl} {width} {height} viewBox="0 0 {width} {height}" style="max-width: 100%;">
        <g transform="translate({margin.left}, {margin.top})">
            <g bind:this={xAxisG} transform="translate(0, {innerHeight})" class="axis x-axis"></g>
            <g bind:this={yAxisG} class="axis y-axis"></g>
            {#each data as d (d[yKey])}
                <rect
                    class="bar"
                    x={xScale(0)}
                    y={yScale(d[yKey])}
                    width={xScale(d[xKey])}
                    height={yScale.bandwidth()}
                >
                    <title>{d[yKey]}: {d[xKey].toFixed(3)}</title>
                </rect>
            {/each}
            <text class="axis-label" x={innerWidth / 2} y={innerHeight + 45} text-anchor="middle">
                {xLabel}
            </text>
            <text class="axis-label" x={-innerHeight / 2} y={-margin.left + 20} transform="rotate(-90)" text-anchor="middle">
                {yLabel}
            </text>
        </g>
    </svg>
</div>

<style>
    .chart-container { width: 100%; }
    .bar { fill: var(--active-border); transition: fill 0.2s; }
    .bar:hover { fill: var(--header-color); }
    .axis :global(text) { font-size: 0.8rem; }
    .axis-label { font-size: 0.9rem; font-weight: 500; fill: var(--text-color-light); }
</style>