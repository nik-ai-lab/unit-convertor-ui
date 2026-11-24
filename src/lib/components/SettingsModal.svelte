<script>
  import { config } from '../stores/configStore.js';
  import { checkBackendStatus } from '../services/api.js';

  let tempUrl = $config.apiBaseUrl;
  let isTesting = false;
  let testResult = null;

  $: if ($config.isSettingsOpen) {
    tempUrl = $config.apiBaseUrl;
    testResult = null;
  }

  async function testConnection() {
    isTesting = true;
    testResult = null;
    // Temporarily set URL to test
    config.setApiBaseUrl(tempUrl);
    const res = await checkBackendStatus();
    config.setBackendHealth(res.status, res.version);
    testResult = res;
    isTesting = false;
  }

  function handleKeydown(event) {
    if (event.key === 'Escape' && $config.isSettingsOpen) {
      config.closeSettings();
    }
  }

  function handleSave() {
    config.setApiBaseUrl(tempUrl);
    config.closeSettings();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $config.isSettingsOpen}
  <div class="modal-backdrop">
    <button
      type="button"
      class="backdrop-overlay"
      on:click={config.closeSettings}
      aria-label="Close modal backdrop"
      tabindex="-1"
    ></button>
    <div
      class="modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div class="modal-header">
        <h2 id="modal-title" class="modal-title">Playground & API Settings</h2>
        <button type="button" class="close-btn" on:click={config.closeSettings} aria-label="Close modal">✕</button>
      </div>

      <div class="modal-body">
        <!-- Mock Mode Toggle -->
        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-name">Mock Engine Mode</div>
            <div class="setting-desc">Run standalone pure-JS conversions without requiring the Go backend service.</div>
          </div>
          <button
            type="button"
            class="toggle-switch"
            class:active={$config.mockMode}
            on:click={config.toggleMockMode}
            aria-label="Toggle Mock Mode"
          >
            <span class="toggle-knob"></span>
          </button>
        </div>

        <!-- API Base URL -->
        <div class="setting-item column">
          <label for="api-base-url" class="setting-name">Backend API Base URL</label>
          <div class="setting-desc">Endpoint of the <code>unit-convertor-go</code> REST API (e.g. <code>/api</code> or <code>http://localhost:9090</code>).</div>
          <div class="url-input-group">
            <input
              id="api-base-url"
              type="text"
              class="text-input"
              bind:value={tempUrl}
              placeholder="/api"
              disabled={$config.mockMode}
            />
            <button
              type="button"
              class="test-btn"
              on:click={testConnection}
              disabled={isTesting || $config.mockMode}
            >
              {#if isTesting}
                <span>Testing...</span>
              {:else}
                <span>Test Ping</span>
              {/if}
            </button>
          </div>
        </div>

        {#if testResult}
          <div class="test-feedback {testResult.status}">
            {#if testResult.status === 'online'}
              ✅ Connected successfully! Version: <code>{testResult.version}</code>
            {:else if testResult.status === 'mock'}
              ⚡ Mock mode is active (Client-side engine).
            {:else}
              ❌ Failed to reach backend: {testResult.error || 'Connection refused'}
            {/if}
          </div>
        {/if}

        <div class="k8s-note">
          <span class="note-icon">💡</span>
          <span>In Kubernetes or container setups, this value can be automatically injected at runtime via ConfigMap (<code>/config.js</code>).</span>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="secondary-btn" on:click={config.closeSettings}>Cancel</button>
        <button type="button" class="primary-btn" on:click={handleSave}>Save & Apply</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 1rem;
  }

  .backdrop-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    border: none;
    padding: 0;
    margin: 0;
    cursor: default;
  }

  .modal-card {
    position: relative;
    z-index: 1;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 520px;
    box-shadow: var(--shadow-lg);
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
  }

  .modal-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .close-btn {
    font-size: 1.25rem;
    color: var(--text-muted);
    padding: 0.25rem;
  }

  .close-btn:hover {
    color: var(--text-primary);
  }

  .modal-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .setting-item.column {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }

  .setting-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .setting-desc {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
  }

  .toggle-switch {
    width: 48px;
    height: 26px;
    background: #0f172a;
    border: 1px solid var(--border-color);
    border-radius: 9999px;
    position: relative;
    padding: 2px;
    flex-shrink: 0;
  }

  .toggle-knob {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--text-muted);
    transition: transform 0.2s ease, background-color 0.2s ease;
  }

  .toggle-switch.active {
    background: var(--purple-color);
    border-color: var(--purple-color);
  }

  .toggle-switch.active .toggle-knob {
    transform: translateX(22px);
    background: #ffffff;
  }

  .url-input-group {
    display: flex;
    width: 100%;
    gap: 0.5rem;
  }

  .text-input {
    flex: 1;
    background: #0f172a;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    padding: 0.5rem 0.75rem;
    color: var(--text-primary);
    font-size: 0.9rem;
    outline: none;
  }

  .text-input:focus {
    border-color: var(--border-focus);
  }

  .test-btn {
    background: var(--bg-card-hover);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 0.5rem 0.85rem;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    font-weight: 500;
  }

  .test-btn:hover:not(:disabled) {
    border-color: var(--border-focus);
  }

  .test-feedback {
    padding: 0.6rem 0.85rem;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
  }

  .test-feedback.online {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: var(--success-color);
  }

  .test-feedback.offline {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
  }

  .test-feedback.mock {
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.3);
    color: #c4b5fd;
  }

  .k8s-note {
    background: rgba(15, 23, 42, 0.8);
    border: 1px dashed var(--border-color);
    border-radius: var(--radius-sm);
    padding: 0.6rem 0.85rem;
    font-size: 0.75rem;
    color: var(--text-secondary);
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border-color);
    background: rgba(15, 23, 42, 0.5);
  }

  .secondary-btn {
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-weight: 500;
  }

  .secondary-btn:hover {
    color: var(--text-primary);
  }

  .primary-btn {
    background: var(--primary-color);
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
  }

  .primary-btn:hover {
    background: var(--primary-hover);
  }
</style>
