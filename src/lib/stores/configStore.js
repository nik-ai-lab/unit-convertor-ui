import { writable } from 'svelte/store';

// Determine initial API Base URL
function getInitialBaseUrl() {
  if (typeof window !== 'undefined' && window.__CONFIG__ && window.__CONFIG__.API_BASE_URL) {
    return window.__CONFIG__.API_BASE_URL;
  }
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('uc_api_base_url');
    if (saved && saved !== 'http://localhost:9090') return saved;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return '/api';
}

function getInitialMockMode() {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('uc_mock_mode');
    if (saved !== null) return saved === 'true';
  }
  return false;
}

const initialConfig = {
  uiVersion: 'v1.0.0',
  apiBaseUrl: getInitialBaseUrl(),
  mockMode: getInitialMockMode(),
  requestTimeout: 5000,
  backendVersion: '...',
  backendStatus: 'checking', // 'online' | 'offline' | 'mock' | 'checking'
  isSettingsOpen: false
};

function createConfigStore() {
  const { subscribe, set, update } = writable(initialConfig);

  return {
    subscribe,
    setApiBaseUrl: (url) => {
      update((state) => {
        const cleanUrl = url.trim();
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('uc_api_base_url', cleanUrl);
        }
        return { ...state, apiBaseUrl: cleanUrl };
      });
    },
    toggleMockMode: () => {
      update((state) => {
        const nextMode = !state.mockMode;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('uc_mock_mode', String(nextMode));
        }
        return {
          ...state,
          mockMode: nextMode,
          backendStatus: nextMode ? 'mock' : 'checking',
          backendVersion: nextMode ? '1.0.0-mock' : '...'
        };
      });
    },
    setMockMode: (val) => {
      update((state) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('uc_mock_mode', String(val));
        }
        return {
          ...state,
          mockMode: val,
          backendStatus: val ? 'mock' : 'checking',
          backendVersion: val ? '1.0.0-mock' : '...'
        };
      });
    },
    setBackendHealth: (status, version) => {
      update((state) => ({
        ...state,
        backendStatus: status,
        backendVersion: version || state.backendVersion
      }));
    },
    openSettings: () => update((state) => ({ ...state, isSettingsOpen: true })),
    closeSettings: () => update((state) => ({ ...state, isSettingsOpen: false })),
    reset: () => set(initialConfig)
  };
}

export const config = createConfigStore();
