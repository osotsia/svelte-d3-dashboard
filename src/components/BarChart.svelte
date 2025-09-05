<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    // MODIFICATION: Type definitions for props using Svelte 5 generic syntax.
    type BarChartData = Record<string, any>;
    let {
        data = [] as BarChartData[],
        yKey = 'label',
        xKeys = ['value'],
        xLabel = '',
        yLabel = '',
        showLegend = false,
        legendLabels = {} as Record<string, string>,
        errorBarKeys = {} as Record<string, string>,
        colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']
    } = $props<{
        data: BarChartData[],
        yKey: string,
        xKeys: string[],
        xLabel?: string,
        yLabel?: string,
        showLegend?: boolean,
        legendLabels?: Record<string, string>,
        errorBarKeys?: Record<string, string>,
        colors?: string[]
    }>();

    // --- D3 & SVG Setup ---
    let width = $state(500);
    let height = $state(300);
    const margin = { top: 20, right: 20, bottom: 60, left: 100 };
    let svgEl: SVGElement, xAxisG: SVGGElement, yAxisG: SVGGElement;

    // --- Reactive Computations ---
    const isGrouped = $derived(xKeys.length > 1);
    const innerWidth = $derived(width - margin.left - margin.right);
    const innerHeight = $derived(height - margin.top - margin.bottom);
    
    // MODIFICATION: Added a comprehensive ARIA label for accessibility.
    const ariaLabel = $derived(`Bar chart titled "${yLabel} by ${xLabel}". The chart shows ${data.length} categories.`);

    // --- Scales ---
    const yScale = $derived(d3.scaleBand<string>()
        .domain(data.map(d => d[yKey]))
        .range([0, innerHeight])
        .padding(0.2));

    const yInnerScale = $derived(d3.scaleBand<string>()
        .domain(xKeys)
        .range([0, yScale.bandwidth()])
        .padding(isGrouped ? 0.05 : 0));

    const xMax = $derived(d3.max(data, d => 
        d3.max(xKeys, key => {
            const value = d[key] || 0;
            const confKey = errorBarKeys[key];
            const conf = confKey && d[confKey] ? d[confKey] : 0;
            return value + conf;
        })
    ) ?? 1);

    const xScale = $derived(d3.scaleLinear()
        .domain([0, xMax > 0 ? xMax * 1.1 : 1]).nice()
        .range([0, innerWidth]));

    const colorScale = $derived(d3.scaleOrdinal<string, string>()
        .domain(xKeys)
        .range(colors));

    // --- Axis Updates ---
    $effect(() => {
        if (xAxisG) {
            const xAxis = d3.axisBottom(xScale).ticks(5).tickSize(-innerHeight);
            d3.select(xAxisG).call(xAxis)
                .selectAll('.tick text').style('font-size', '0.8rem');
            d3.select(xAxisG).selectAll('.tick line').style('stroke', 'var(--border-color)').style('stroke-dasharray', '2,2');
            d3.select(xAxisG).select('.domain').style('display', 'none');
        }
        if (yAxisG) {
            const yAxis = d3.axisLeft(yScale);
            d3.select(yAxisG).call(yAxis)
                .selectAll('.tick text').style('font-size', '0.8rem');
            d3.select(yAxisG).select('.domain').style('stroke', 'var(--text-color)');
        }
    });

    // --- Lifecycle & Responsiveness ---
    onMount(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (!entries || !entries.length) return;
            const entry = entries[0];
            const optimalBarHeight = 40;
            const requiredHeight = data.length * optimalBarHeight + margin.top + margin.bottom;
            width = entry.contentRect.width;
            height = Math.max(300, requiredHeight);
        });
        resizeObserver.observe(svgEl.parentElement!);
        return () => resizeObserver.disconnect();
    });

</script>

<div class="chart-container">
    <!-- ADDED: Accessible, non-visual table representation of the chart data. -->
    <div class="visually-hidden">
        <table>
            <caption>{ariaLabel}</caption>
            <thead>
                <tr>
                    <th>{yKey}</th>
                    {#each xKeys as key}
                        <th>{legendLabels[key] || key}</th>
                        {#if errorBarKeys[key]}<th>{legendLabels[key] || key} Confidence</th>{/if}
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each data as d}
                <tr>
                    <td>{d[yKey]}</td>
                    {#each xKeys as key}
                        <td>{d[key]?.toFixed(3) ?? 'N/A'}</td>
                        {#if errorBarKeys[key]}<td>{d[errorBarKeys[key]]?.toFixed(3) ?? 'N/A'}</td>{/if}
                    {/each}
                </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <!-- MODIFICATION: Added ARIA role and label for SVG accessibility. -->
    <svg bind:this={svgEl} {width} {height} viewBox="0 0 {width} {height}" style="max-width: 100%;"
         role="figure" aria-label={ariaLabel}>
        <!-- MODIFICATION: Added aria-hidden to prevent screen readers from parsing the complex SVG tree. -->
        <g transform="translate({margin.left}, {margin.top})" aria-hidden="true">
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
                        {@const barY = yInnerScale(key) ?? 0}

                        <!-- Bar -->
                        <rect 
                            class="bar"
                            x={xScale(0)} 
                            y={barY} 
                            width={xScale(value) - xScale(0)} 
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
    /* ADDED: Style for visually hiding accessible content. */
    .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    .chart-container { width: 100%; }
    .axis :global(text) { font-size: 0.8rem; }
    .axis-label { font-size: 0.9rem; font-weight: 500; fill: var(--text-color-light); }
    .bar { transition: filter 0.2s ease-in-out; }
    .bar:hover { filter: brightness(85%); }
    .error-line, .error-tick { stroke: #333; stroke-width: 1.5px; }
    .legend-bg { fill: var(--panel-bg); stroke: var(--border-color); fill-opacity: 0.85; }
    .legend-text { font-size: 0.8rem; fill: var(--text-color); dominant-baseline: middle; }
</style>