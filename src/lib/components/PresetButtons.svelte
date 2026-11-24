<script>
  import { converter } from '../stores/converterStore.js';
  import { getCategoryConfig } from '../constants/units.js';

  $: categoryConfig = getCategoryConfig($converter.category);
  $: presets = categoryConfig.presets || [];

  function applyPreset(preset) {
    converter.setPreset(preset.value, preset.from, preset.to, $converter.category);
    converter.convert();
  }
</script>

{#if presets.length > 0}
  <div class="preset-section">
    <div class="preset-title">Quick Presets:</div>
    <div class="preset-grid">
      {#each presets as preset}
        <button type="button" class="preset-btn" on:click={() => applyPreset(preset)}>
          {preset.label}
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
  .preset-section {
    margin-top: 1.25rem;
  }

  .preset-title {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .preset-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .preset-btn {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 0.4rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
    font-weight: 500;
  }

  .preset-btn:hover {
    background: var(--bg-card-hover);
    color: var(--text-primary);
    border-color: var(--border-focus);
  }
</style>
