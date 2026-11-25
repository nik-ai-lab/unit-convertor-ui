<script>
  import { converter } from '../stores/converterStore.js';
  import { getUnitSymbol } from '../constants/units.js';

  function rerun(item) {
    converter.setPreset(item.fromValue, item.fromUnit, item.toUnit, item.category);
    converter.convert();
  }

  function copyItem(item) {
    const fromSymbol = getUnitSymbol(item.fromUnit, item.category);
    const toSymbol = getUnitSymbol(item.toUnit, item.category);
    const text = `${item.fromValue} ${fromSymbol} = ${item.toValue} ${toSymbol}`;
    navigator.clipboard.writeText(text);
  }
</script>

<div class="history-card">
  <div class="history-header">
    <div class="header-left">
      <h3 class="history-title">Conversion History</h3>
      <span class="history-count">({$converter.history.length})</span>
    </div>

    {#if $converter.history.length > 0}
      <button type="button" class="clear-btn" on:click={converter.clearHistory}>
        Clear History
      </button>
    {/if}
  </div>

  {#if $converter.history.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📜</div>
      <p class="empty-text">No conversions logged yet.</p>
      <p class="empty-subtext">Perform a conversion to see it in your history.</p>
    </div>
  {:else}
    <div class="history-list">
      {#each $converter.history as item (item.id)}
        <div class="history-item">
          <div class="item-calc">
            <span class="from-val">{item.fromValue} <span class="unit-tag">{getUnitSymbol(item.fromUnit, item.category)}</span></span>
            <span class="arrow">→</span>
            <span class="to-val">{item.toValue} <span class="unit-tag">{getUnitSymbol(item.toUnit, item.category)}</span></span>
          </div>

          <div class="item-meta">
            <span class="item-time">{item.timestamp}</span>

            <div class="item-actions">
              <button type="button" class="icon-btn" on:click={() => copyItem(item)} title="Copy conversion" aria-label="Copy conversion">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>

              <button type="button" class="icon-btn" on:click={() => rerun(item)} title="Rerun conversion" aria-label="Rerun conversion">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>

              <button type="button" class="icon-btn delete" on:click={() => converter.deleteHistoryItem(item.id)} title="Delete record" aria-label="Delete conversion record">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .history-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: var(--shadow-md);
    margin-top: 1.5rem;
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-color);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .history-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .history-count {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .clear-btn {
    font-size: 0.75rem;
    color: var(--danger-color);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
  }

  .clear-btn:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  .empty-state {
    text-align: center;
    padding: 2rem 1rem;
    color: var(--text-muted);
  }

  .empty-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    opacity: 0.7;
  }

  .empty-text {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .empty-subtext {
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 260px;
    overflow-y: auto;
    padding-right: 0.25rem;
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #0f172a;
    padding: 0.6rem 0.85rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    transition: border-color 0.2s ease;
  }

  .history-item:hover {
    border-color: var(--border-focus);
  }

  .item-calc {
    font-size: 0.95rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-primary);
  }

  .arrow {
    color: var(--text-muted);
  }

  .unit-tag {
    font-size: 0.75rem;
    color: var(--accent-color);
    font-weight: 500;
  }

  .item-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .item-time {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-family: monospace;
  }

  .item-actions {
    display: flex;
    gap: 0.25rem;
  }

  .icon-btn {
    padding: 0.3rem;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-btn:hover {
    background: var(--bg-card-hover);
    color: var(--text-primary);
  }

  .icon-btn.delete:hover {
    color: var(--danger-color);
    background: rgba(239, 68, 68, 0.1);
  }
</style>
