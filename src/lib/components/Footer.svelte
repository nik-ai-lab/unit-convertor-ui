<script>
  import { config } from "../stores/configStore.js";
  import { checkBackendStatus } from "../services/api.js";
  import { onMount } from "svelte";

  let isChecking = false;

  async function refreshStatus() {
    isChecking = true;
    const res = await checkBackendStatus();
    config.setBackendHealth(res.status, res.version);
    isChecking = false;
  }

  onMount(() => {
    refreshStatus();
    // Poll health check every 30 seconds
    const interval = setInterval(refreshStatus, 30000);
    return () => clearInterval(interval);
  });
</script>

<footer class="app-footer">
  <div class="container footer-container">
    <div class="status-cluster">
      <div class="status-badge {$config.backendStatus}">
        <span class="status-dot"></span>
        <span class="status-label">
          {#if $config.backendStatus === "online"}
            Backend Online
          {:else if $config.backendStatus === "mock"}
            Mock Engine Active
          {:else if $config.backendStatus === "checking" || isChecking}
            Checking Service...
          {:else}
            Backend Offline
          {/if}
        </span>
      </div>

      <div class="version-badge" title="Unit Converter UI Version">
        <span class="version-tag">UI:</span>
        <span class="version-value">{$config.uiVersion}</span>
      </div>

      <div class="version-badge" title="API Backend Version">
        <span class="version-tag">API:</span>
        <span class="version-value">{$config.backendVersion}</span>
      </div>

      <button
        type="button"
        class="refresh-btn"
        on:click={refreshStatus}
        disabled={isChecking}
        title="Check Backend Health"
        aria-label="Refresh Backend Health"
      >
        <svg
          class:spinning={isChecking}
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
      </button>
    </div>

    <div class="footer-meta">
      <span>Built for</span>
      <span class="separator">•</span>
      <span><code>unit-convertor-api</code></span>
    </div>
  </div>
</footer>

<style>
  .app-footer {
    margin-top: auto;
    background: rgba(15, 23, 42, 0.95);
    border-top: 1px solid var(--border-color);
    padding: 1rem 0;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  .footer-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
  }

  .status-cluster {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.3rem 0.65rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--text-muted);
  }

  .status-badge.online {
    background: rgba(16, 185, 129, 0.1);
    color: var(--success-color);
    border-color: rgba(16, 185, 129, 0.3);
  }
  .status-badge.online .status-dot {
    background-color: var(--success-color);
    box-shadow: 0 0 6px var(--success-color);
  }

  .status-badge.mock {
    background: rgba(139, 92, 246, 0.15);
    color: #a78bfa;
    border-color: rgba(139, 92, 246, 0.3);
  }
  .status-badge.mock .status-dot {
    background-color: #a78bfa;
    box-shadow: 0 0 6px #8b5cf6;
  }

  .status-badge.offline {
    background: rgba(239, 68, 68, 0.1);
    color: var(--danger-color);
    border-color: rgba(239, 68, 68, 0.3);
  }
  .status-badge.offline .status-dot {
    background-color: var(--danger-color);
    box-shadow: 0 0 6px var(--danger-color);
  }

  .status-badge.checking {
    background: rgba(245, 158, 11, 0.1);
    color: var(--warning-color);
    border-color: rgba(245, 158, 11, 0.3);
  }
  .status-badge.checking .status-dot {
    background-color: var(--warning-color);
  }

  .version-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.8rem;
    background: var(--bg-card);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
  }

  .version-tag {
    color: var(--text-muted);
  }

  .version-value {
    font-family: monospace;
    color: var(--text-primary);
  }

  .refresh-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.35rem;
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
  }

  .refresh-btn:hover:not(:disabled) {
    background: var(--bg-card-hover);
    color: var(--text-primary);
    border-color: var(--border-focus);
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .footer-meta {
    font-size: 0.8rem;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .footer-meta code {
    background: rgba(255, 255, 255, 0.05);
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    color: var(--text-secondary);
  }
</style>
