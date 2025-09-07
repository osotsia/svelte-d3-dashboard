<script lang="ts">
    // MODIFICATION: Import the new formatter and the ModelCard type.
    import { format } from '../../lib/formatters';
    import type { ModelCard } from '../../lib/data.types';

    // MODIFICATION: Type the data prop for better autocompletion and safety.
    let { data = {} as Partial<ModelCard> } = $props<{ data: Partial<ModelCard> }>();

    // MODIFICATION: Create a structured configuration for displaying the model card.
    // This makes the template cleaner and the logic easier to manage.
    const displayConfig = $derived([
        { key: 'model_type', label: 'Model Type', value: data.model_type },
        { key: 'r2_score', label: 'R² Score', value: format.sig(data.r2_score, 4) },
        { key: 'normalized_test_rmse', label: 'Normalized Test RMSE', value: format.pct(data.normalized_test_rmse, 3) },
        { key: 'raw_test_rmse', label: 'Raw Test RMSE', value: format.sig(data.raw_test_rmse, 3) },
        { key: 'evaluation_speed_evals_per_sec', label: 'Evaluation Speed (evals/sec)', value: format.com(data.evaluation_speed_evals_per_sec) },
        { key: 'training_time_seconds', label: 'Training Time (seconds)', value: format.sig(data.training_time_seconds, 3) },
        { key: 'training_samples', label: 'Training Samples', value: format.com(data.training_samples) },
        { key: 'test_samples', label: 'Test Samples', value: format.com(data.test_samples) },
        { key: 'n_estimators', label: 'Estimators', value: data.n_estimators },
        { key: 'max_depth', label: 'Max Depth', value: data.max_depth },
        { key: 'learning_rate', label: 'Learning Rate', value: data.learning_rate },
    ]);

</script>

<div class="info-grid">
    <!-- MODIFICATION: Loop over the displayConfig array -->
    {#each displayConfig as item}
        {#if item.value !== null && item.value !== undefined}
            <div class="info-item" title={`Raw value for ${item.label}: ${data[item.key]}`}>
                <span class="info-key">{item.label}</span>
                <span class="info-value">{item.value}</span>
            </div>
        {/if}
    {/each}
</div>

<style>
    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 0.75rem 1.5rem;
    }
    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        font-size: 0.95rem;
        border-bottom: 1px solid var(--bg-color);
        padding-bottom: 0.5rem;
    }
    .info-key {
        color: var(--text-color-light);
        text-transform: capitalize;
        padding-right: 1rem;
    }
    .info-value {
        font-weight: 600;
        text-align: right;
        font-family: monospace, sans-serif;
    }
</style>