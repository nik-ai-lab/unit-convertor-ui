<script>
  import { config } from "../stores/configStore.js";
  import { converter } from "../stores/converterStore.js";
  import { getCategoryConfig } from "../constants/units.js";

  $: activeCategory = getCategoryConfig($converter.category);
</script>

<header class="app-header">
  <div class="container header-container">
    <div class="brand">
      <div class="logo-icon">{activeCategory.icon}</div>
      <div>
        <h1 class="brand-title">Unit Convertor</h1>
        <p class="brand-subtitle">Cloud-Native Unit Conversion</p>
      </div>
    </div>

    <div class="header-actions">
      <button
        type="button"
        class="settings-btn"
        on:click={config.openSettings}
        aria-label="Open Settings"
        title="Configure API & Mock Settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
          ></path>
        </svg>
        <span>Settings</span>
      </button>
    </div>
  </div>
</header>

<style>
  .app-header {
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border-color);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 20;
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-icon {
    font-size: 1.75rem;
    background: rgba(59, 130, 246, 0.15);
    border-radius: var(--radius-md);
    padding: 0.25rem 0.5rem;
    border: 1px solid rgba(59, 130, 246, 0.3);
  }

  .brand-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .brand-subtitle {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .settings-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 0.5rem 0.85rem;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    font-weight: 500;
  }

  .settings-btn:hover {
    background: var(--bg-card-hover);
    color: var(--text-primary);
    border-color: var(--border-focus);
  }
</style>
