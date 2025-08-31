<script>
    import { createEventDispatcher } from 'svelte';
    import Icon from './Icon.svelte';

    export let id;
    export let title;
    export let layout = 'default';
    export let explanation = '';
    export let isPinned = false;

    const dispatch = createEventDispatcher();

    function togglePin() {
        dispatch('togglePin', { id, title });
    }
</script>

<div class="analysis-box" class:full-width={layout === 'full-width'}>
    <header>
        <h2>{title}</h2>
        <button class="pin-button" on:click={togglePin} class:active={isPinned} title={isPinned ? 'Unpin' : 'Pin to Report'}>
            <Icon name="pin" size={18}/>
        </button>
    </header>
    
    {#if explanation}
    <p class="explanation-text">{explanation}</p>
    {/if}

    <div class="content">
        <slot></slot>
    </div>
</div>

<style>
    .analysis-box { background-color: var(--panel-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: var(--spacing-unit); box-shadow: 0 2px 10px rgba(0,0,0,0.05); min-width: 0; }
    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; margin-bottom: 1rem; }
    h2 { margin: 0; font-size: 1.2rem; color: var(--header-color); }
    .explanation-text { font-size: 0.9rem; color: var(--text-color-light); margin-top: -0.25rem; margin-bottom: 1.25rem; line-height: 1.5; }
    .pin-button { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-color-light); }
    .pin-button:hover { background-color: var(--bg-color); }
    .pin-button.active { color: var(--active-border); }
</style>