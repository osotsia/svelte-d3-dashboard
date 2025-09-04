<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    let { data = [], xKey = 'x', yKey = 'y', xLabel = '', yLabel = '' } = $props();

    function createPaddedScale(data, key, range, padding = 0.05) {
        if (!data || data.length === 0) {
            return d3.scaleLinear().domain([0, 1]).range(range);
        }
        const [min, max] = d3.extent(data, d => d[key]);
        const domainPadding = (max - min) * padding;
        return d3.scaleLinear()
            .domain([min - domainPadding, max + domainPadding])
            .range(range);
    }

    let width = $state(500);
    let height = $state(400);
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    let svgEl, xAxisG, yAxisG;

    const innerWidth = $derived(width - margin.left - margin.right);
    const innerHeight = $derived(height - margin.top - margin.bottom);

    const xScale = $derived(createPaddedScale(data, xKey, [0, innerWidth]));
    const yScale = $derived(createPaddedScale(data, yKey, [innerHeight, 0]));

    $effect(() => {
        if (xAxisG) {
            const xAxis = d3.axisBottom(xScale).ticks(5);
            d3.select(xAxisG).call(xAxis);
        }
        if (yAxisG) {
            const yAxis = d3.axisLeft(yScale).ticks(5);
            d3.select(yAxisG).call(yAxis);
        }
    });

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
            {#if yScale.domain()[0] < 0 && yScale.domain()[1] > 0}
                <line class="zero-line" x1=0 x2={innerWidth} y1={yScale(0)} y2={yScale(0)}></line>
            {/if}
            {#each data as d, i}
                <circle class="data-point" cx={xScale(d[xKey])} cy={yScale(d[yKey])} r=3>
                    <title>{xKey}: {d[xKey].toFixed(3)}\n{yKey}: {d[yKey].toFixed(3)}</title>
                </circle>
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
    .data-point { fill: var(--active-border); fill-opacity: 0.5; stroke: none; }
    .zero-line { stroke: #ff6b6b; stroke-width: 1.5; stroke-dasharray: 4,2; }
    .axis :global(text) { font-size: 0.8rem; }
    .axis-label { font-size: 0.9rem; font-weight: 500; fill: var(--text-color-light); }
</style>