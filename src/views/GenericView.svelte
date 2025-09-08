<script>
    import ModuleGrid from '../components/ModuleGrid.svelte';
    import ModuleLoader from '../components/ModuleLoader.svelte';

    let { analysisModules = [] } = $props();

    const moduleIds = $derived(analysisModules.map(module => module.id));
</script>

<ModuleGrid>
    {#each moduleIds as id (id)}
        <ModuleLoader {id} />
    {/each}
</ModuleGrid>