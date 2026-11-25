<script>
  import { converter } from '../stores/converterStore.js';
  import { getCategoryConfig, getUnitSymbol } from '../constants/units.js';
  import { onMount } from 'svelte';

  let copied = false;

  $: categoryConfig = getCategoryConfig($converter.category);
  $: currentUnits = categoryConfig.units || [];
  $: formulaHint = categoryConfig.getFormulaHint
    ? categoryConfig.getFormulaHint($converter.fromUnit, $converter.toUnit)
    : null;

  function handleConvert(e) {
    if (e) e.preventDefault();
    converter.convert();
  }

  function handleSwap() {
    converter.swapUnits();
    converter.convert();
  }

  function copyResult() {
    if ($converter.resultValue !== null) {
      const symbol = getUnitSymbol($converter.toUnit, $converter.category);
      const text = `${$converter.resultValue} ${symbol}`;
      navigator.clipboard.writeText(text);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    }
  }

  onMount(() => {
    // Initial calculation on page load
    converter.convert();
  });
</script>

<div class="converter-card">
  <form on:submit={handleConvert}>
    <div class="input-row">
      <!-- Input Value and From Unit -->
      <div class="field-group">
        <label for="temp-input" class="field-label">{categoryConfig.label} Value</label>
        <div class="input-with-select">
          <input
            id="temp-input"
            type="number"
            step="any"
            class="number-input"
            placeholder="e.g. {categoryConfig.defaultInput || '0'}"
            value={$converter.inputValue}
            on:input={(e) => converter.setInputValue(e.currentTarget.value)}
            required
          />
          <select
            class="unit-select"
            value={$converter.fromUnit}
            on:change={(e) => {
              converter.setFromUnit(e.currentTarget.value);
              converter.convert();
            }}
          >
            {#each currentUnits as u (u.id)}
              <option value={u.id}>{u.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Swap Action -->
      <div class="swap-container">
        <button
          type="button"
          class="swap-btn"
          on:click={handleSwap}
          title="Swap source and target units"
          aria-label="Swap units"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"/>
          </svg>
        </button>
      </div>

      <!-- To Unit -->
      <div class="field-group">
        <label for="to-unit-select" class="field-label">Target Unit</label>
        <select
          id="to-unit-select"
          class="unit-select full-width"
          value={$converter.toUnit}
          on:change={(e) => {
            converter.setToUnit(e.currentTarget.value);
            converter.convert();
          }}
        >
          {#each currentUnits as u (u.id)}
            <option value={u.id}>{u.label}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="action-row">
      <button type="submit" class="submit-btn" disabled={$converter.isLoading}>
        {#if $converter.isLoading}
          <svg class="spinning" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
          <span>Converting...</span>
        {:else}
          <span>Convert {categoryConfig.label}</span>
        {/if}
      </button>
    </div>
  </form>

  <!-- Error display -->
  {#if $converter.error}
    <div class="error-banner">
      <span class="error-icon">⚠️</span>
      <span class="error-text">{$converter.error}</span>
    </div>
  {/if}

  <!-- Conversion Result Display -->
  {#if $converter.resultValue !== null && !$converter.error}
    <div class="result-box">
      <div class="result-meta">
        <span class="result-label">Converted Result</span>
        {#if formulaHint}
          <span class="formula-hint">
            {formulaHint}
          </span>
        {/if}
      </div>

      <div class="result-content">
        <div class="result-number">
          {$converter.resultValue}
          <span class="result-unit">{getUnitSymbol($converter.toUnit, $converter.category)}</span>
        </div>

        <button type="button" class="copy-btn" on:click={copyResult} title="Copy to clipboard" aria-label="Copy to clipboard">
          {#if copied}
            <span>✓ Copied</span>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
          {/if}
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .converter-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: var(--shadow-md);
  }

  .input-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    align-items: flex-end;
  }

  @media (max-width: 640px) {
    .input-row {
      grid-template-columns: 1fr;
    }
    .swap-container {
      margin: 0.25rem 0;
      display: flex;
      justify-content: center;
    }
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .field-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .input-with-select {
    display: flex;
    background: #0f172a;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .input-with-select:focus-within {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
  }

  .number-input {
    flex: 1;
    background: transparent;
    border: none;
    padding: 0.65rem 0.85rem;
    color: var(--text-primary);
    font-size: 1.1rem;
    font-weight: 600;
    outline: none;
    min-width: 0;
  }

  .unit-select {
    background: #1e293b;
    border: none;
    border-left: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 0.65rem 0.75rem;
    font-size: 0.85rem;
    font-weight: 500;
    outline: none;
    cursor: pointer;
  }

  .unit-select.full-width {
    width: 100%;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 0.75rem 0.85rem;
    background: #0f172a;
    font-size: 0.95rem;
  }

  .swap-container {
    padding-bottom: 0.15rem;
  }

  .swap-btn {
    background: #0f172a;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    width: 42px;
    height: 42px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .swap-btn:hover {
    background: var(--bg-card-hover);
    color: var(--primary-color);
    border-color: var(--primary-color);
    transform: rotate(180deg);
  }

  .action-row {
    margin-top: 1.25rem;
  }

  .submit-btn {
    width: 100%;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #ffffff;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  .submit-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-1px);
  }

  .error-banner {
    margin-top: 1rem;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.4);
    border-radius: var(--radius-md);
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #fca5a5;
    font-size: 0.9rem;
  }

  .result-box {
    margin-top: 1.25rem;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%);
    border: 1px solid rgba(56, 189, 248, 0.3);
    border-radius: var(--radius-md);
    padding: 1.25rem;
  }

  .result-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .result-label {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--accent-color);
  }

  .formula-hint {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-family: monospace;
  }

  .result-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .result-number {
    font-size: 2.25rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  .result-unit {
    font-size: 1.25rem;
    color: var(--accent-color);
    margin-left: 0.25rem;
  }

  .copy-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 0.45rem 0.85rem;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    font-weight: 500;
  }

  .copy-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    border-color: var(--text-secondary);
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
