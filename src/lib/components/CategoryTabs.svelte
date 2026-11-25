<script>
  import { converter } from '../stores/converterStore.js';
  import { UNIT_CATEGORIES } from '../constants/units.js';

  const categories = Object.values(UNIT_CATEGORIES);

  function handleSelectCategory(catId) {
    if ($converter.category !== catId) {
      converter.setCategory(catId);
      converter.convert();
    }
  }
</script>

<div class="category-nav">
  <div class="category-tabs" role="tablist" aria-label="Unit categories">
    {#each categories as cat}
      <button
        type="button"
        role="tab"
        aria-selected={$converter.category === cat.id}
        class="category-tab"
        class:active={$converter.category === cat.id}
        on:click={() => handleSelectCategory(cat.id)}
      >
        <span class="category-icon">{cat.icon}</span>
        <span class="category-label">{cat.label}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .category-nav {
    margin-bottom: 1.25rem;
  }

  .category-tabs {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.25rem;
    scrollbar-width: thin;
  }

  .category-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1rem;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: 500;
    white-space: nowrap;
    transition: all 0.2s ease;
  }

  .category-tab:hover {
    background: var(--bg-card-hover);
    color: var(--text-primary);
    border-color: var(--border-focus);
  }

  .category-tab.active {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.2) 100%);
    border-color: var(--primary-color);
    color: var(--text-primary);
    font-weight: 600;
    box-shadow: 0 0 12px rgba(59, 130, 246, 0.2);
  }

  .category-icon {
    font-size: 1.1rem;
  }
</style>
