<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import * as d3 from 'd3';

    export let scale;
    export let pcpKey;
    export let selectionExtent = null;

    let gElement;
    const dispatch = createEventDispatcher();
    const brushHeight = 50;
    let brush;

    function brushed({ selection, sourceEvent }) {
        if (!sourceEvent) return;
        let extent = null;
        if (selection) {
            extent = selection.map(scale.invert);
        }
        dispatch('brush', { key: pcpKey, extent: extent });
    }

    onMount(() => {
        const axis = d3.axisBottom(scale);
        d3.select(gElement).call(axis);
        brush = d3.brushX()
            .extent([
                [scale.range()[0], -brushHeight / 2],
                [scale.range()[1], brushHeight / 2]
            ])
            .on('end', brushed);
        d3.select(gElement).call(brush);
    });

    $: if (gElement && brush) {
        if (selectionExtent) {
            const pixelExtent = selectionExtent.map(scale);
            d3.select(gElement).call(brush.move, pixelExtent);
        } else {
            d3.select(gElement).call(brush.move, null);
        }
    }

    $: if (gElement && scale) {
        const axis = d3.axisBottom(scale);
        d3.select(gElement).transition().duration(200).call(axis);
    }
</script>

<g bind:this={gElement} {...$$restProps}>
    <text
        class="axis-label"
        x={scale.range()[0]}
        y={-10} 
        text-anchor="start"
        fill="currentColor"
    >
        {pcpKey}
    </text>
</g>

<!-- Add this style block -->
<style>
    .axis-label {
        font-size: var(--font-size-pcp-label);
        font-weight: bold;
    }
</style>