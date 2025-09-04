<script>
    // MODIFICATION: Use $props() to get declared props and a 'rest' object for others.
    let { name, size = 20, ...rest } = $props();

    const icons = {
        pin: 'M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z',
        trash: 'M6,19c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V7H6V19z M19,4h-3.5l-1-1h-5l-1,1H5v2h14V4z',
        save: 'M17,3H5C3.89,3,3,3.9,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V7L17,3z M12,19c-1.66,0-3-1.34-3-3s1.34-3,3-3 s3,1.34,3,3S13.66,19,12,19z M15,9H5V5h10V9z',
        new: 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z'
    };

    const pathData = $derived(icons[name]);
</script>

<svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...rest}>
    {#if pathData}
        <path d={pathData}></path>
    {/if}
</svg>