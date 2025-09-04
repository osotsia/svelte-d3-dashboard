<script>
    import { createEventDispatcher } from 'svelte';
    import * as d3 from 'd3';

    let { scale, pcpKey, selectionExtent = null, ...rest } = $props();

    let gElement;
    const dispatch = createEventDispatcher();
    const brushHeight = 50;

    $effect(() => {
        if (!gElement) return;

        const axis = d3.axisBottom(scale);
        const g = d3.select(gElement);

        g.select('.axis-instance').remove(); // Clear previous axis
        g.append('g').attr('class', 'axis-instance').call(axis);

        function brushed({ selection, sourceEvent }) {
            if (!sourceEvent) return;
            let extent = null;
            if (selection) {
                extent = selection.map(scale.invert);
            }
            dispatch('brush', { key: pcpKey, extent: extent });
        }

        const brush = d3.brushX()
            .extent([
                [scale.range()[0], -brushHeight / 2],
                [scale.range()[1], brushHeight / 2]
            ])
            .on('end', brushed);
        
        g.call(brush);

        // Programmatically move the brush based on the selectionExtent prop
        if (selectionExtent) {
            const pixelExtent = selectionExtent.map(scale);
            g.call(brush.move, pixelExtent);
        } else {
            g.call(brush.move, null);
        }
    });
</script>

<g bind:this={gElement} {...rest}>
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

<style>
    .axis-label {
        font-size: var(--font-size-pcp-label);
        font-weight: bold;
    }
</style>