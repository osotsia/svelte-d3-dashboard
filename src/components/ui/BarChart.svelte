<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    // --- Component Props ---
    export let data = [];
    export let yKey = 'label';
    export let xKeys = ['value']; // Array of keys for the x-axis values
    export let xLabel = '';
    export let yLabel = '';

    // --- Optional Props for Advanced Features ---
    export let showLegend = false;
    export let legendLabels = {}; // e.g., { 'S1': 'S1 (First-order)' }
    export let errorBarKeys = {}; // e.g., { 'value_key': 'confidence_key' }
    export let colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']; // Default color scheme

    // --- D3 & SVG Setup ---
    let width = 500;
    let height = 300;
    const margin = { top: 20, right: 30, bottom: 60, left: 120 };
    let svgEl, xAxisG, yAxisG;

    // --- Reactive Computations ---
    $: isGrouped = xKeys.length > 1;
    $: innerWidth = width - margin.left - margin.right;
    $: innerHeight = height - margin.top - margin.bottom;

    // --- Scales ---
    $: yScale = d3.scaleBand()
        .domain(data.map(d => d[yKey]))
        .range([0, innerHeight])
        .padding(0.2);

    $: yInnerScale = d3.scaleBand()
        .domain(xKeys)
        .range([0, yScale.bandwidth()])
        .padding(isGrouped ? 0.05 : 0);

    $: xMax = d3.max(data, d => 
        d3.max(xKeys, key => {
            const value = d[key] || 0;
            const confKey = errorBarKeys[key];
            const conf = confKey && d[confKey] ? d[confKey] : 0;
            return value + conf;
        })
    );

    $: xScale = d3.scaleLinear()
        .domain([0, xMax > 0 ? xMax * 1.1 : 1]).nice()
        .range([0, innerWidth]);

    $: colorScale = d3.scaleOrdinal()
        .domain(xKeys)
        .range(colors);

    // --- Axis Updates ---
    $: if (xAxisG && yAxisG) {
        const xAxis = d3.axisBottom(xScale).ticks(5).tickSize(-innerHeight);
        d3.select(xAxisG).call(xAxis)
            .selectAll('.tick text').style('font-size', '0.8rem');
        d3.select(xAxisG).selectAll('.tick line').style('stroke', 'var(--border-color)').style('stroke-dasharray', '2,2');
        d3.select(xAxisG).select('.domain').style('display', 'none');
        
        const yAxis = d3.axisLeft(yScale);
        d3.select(yAxisG).call(yAxis)
            .selectAll('.tick text').style('font-size', '0.8rem');
        d3.select(yAxisG).select('.domain').style('stroke', 'var(--text-color)');
    }

    // --- Lifecycle & Responsiveness ---
    onMount(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (!entries || !entries.length) return;
            const entry = entries[0];
            // Adjust height based on number of bars to prevent squishing
            const optimalBarHeight = 40;
            const requiredHeight = data.length * optimalBarHeight + margin.top + margin.bottom;
            width = entry.contentRect.width;
            height = Math.max(300, requiredHeight);
        });
        resizeObserver.observe(svgEl.parentElement);
        return () => resizeObserver.disconnect();
    });

</script>

<div class="chart-container">
    <svg bind:this={svgEl} {width} {height} viewBox="0 0 {width} {height}" style="max-width: 100%;">
        <g transform="translate({margin.left}, {margin.top})">
            <!-- Axes -->
            <g bind:this={xAxisG} transform="translate(0, {innerHeight})" class="axis x-axis"></g>
            <g bind:this={yAxisG} class="axis y-axis"></g>
            
            <!-- Bars and Error Bars -->
            {#each data as d (d[yKey])}
                <g class="group" transform="translate(0, {yScale(d[yKey])})">
                    {#each xKeys as key}
                        {@const value = d[key] || 0}
                        {@const confKey = errorBarKeys[key]}
                        {@const conf = confKey && d[confKey] ? d[confKey] : 0}
                        {@const barY = yInnerScale(key)}

                        <!-- Bar -->
                        <rect 
                            class="bar"
                            x={xScale(0)} 
                            y={barY} 
                            width={xScale(value)} 
                            height={yInnerScale.bandwidth()} 
                            fill={isGrouped ? colorScale(key) : 'var(--active-border)'}>
                            <title>{key}: {value.toFixed(3)}{#if conf > 0} ± {conf.toFixed(3)}{/if}</title>
                        </rect>
                        
                        <!-- Error Bars (if applicable) -->
                        {#if conf > 0}
                            {@const errorY = barY + yInnerScale.bandwidth() / 2}
                            <line class="error-line" x1={xScale(value - conf)} y1={errorY} x2={xScale(value + conf)} y2={errorY} />
                            <line class="error-tick" x1={xScale(value - conf)} y1={errorY - 4} x2={xScale(value - conf)} y2={errorY + 4} />
                            <line class="error-tick" x1={xScale(value + conf)} y1={errorY - 4} x2={xScale(value + conf)} y2={errorY + 4} />
                        {/if}
                    {/each}
                </g>
            {/each}

            <!-- Axis Labels -->
            <text class="axis-label" x={innerWidth / 2} y={innerHeight + 45} text-anchor="middle">
                {xLabel}
            </text>
            <text class="axis-label" x={-innerHeight / 2} y={-margin.left + 20} transform="rotate(-90)" text-anchor="middle">
                {yLabel}
            </text>

            <!-- Legend (if applicable) -->
            {#if isGrouped && showLegend}
            <g class="svg-legend" transform="translate({innerWidth - 150}, {innerHeight - 60})">
                <rect class="legend-bg" width="140" height={xKeys.length * 20 + 10} rx="4"></rect>
                {#each xKeys as key, i}
                    <g transform="translate(10, {15 + i * 20})">
                        <rect x="0" y="-8" width="12" height="12" fill={colorScale(key)}></rect>
                        <text x="18" y="0" class="legend-text">
                            {legendLabels[key] || key}
                        </text>
                    </g>
                {/each}
            </g>
            {/if}
        </g>
    </svg>
</div>

<style>
    .chart-container { width: 100%; }
    .axis :global(text) { font-size: 0.8rem; }
    .axis-label { font-size: 0.9rem; font-weight: 500; fill: var(--text-color-light); }
    
    .bar { transition: filter 0.2s ease-in-out; }
    .bar:hover { filter: brightness(85%); }
    
    .error-line, .error-tick { stroke: #333; stroke-width: 1.5px; }
    
    .legend-bg { fill: var(--panel-bg); stroke: var(--border-color); fill-opacity: 0.85; }
    .legend-text { font-size: 0.8rem; fill: var(--text-color); dominant-baseline: middle; }
</style>