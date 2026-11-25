import { mockConvert, mockVersion } from './mockConverter.js';
import { config } from '../stores/configStore.js';
import { get } from 'svelte/store';

/**
 * Perform unit conversion via live backend or fallback to mock engine
 * @param {number} value
 * @param {string} from
 * @param {string} to
 * @param {string} [category]
 * @returns {Promise<{value: number, unit: string}>}
 */
export async function convertUnits(value, from, to, category = 'temperature') {
  const currentConfig = get(config);

  if (currentConfig.mockMode) {
    // Artificial small delay for realistic UI feedback
    await new Promise((resolve) => setTimeout(resolve, 80));
    return mockConvert(value, from, to, category);
  }

  const baseUrl = currentConfig.apiBaseUrl.replace(/\/+$/, '');
  const url = `${baseUrl}/converter`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), currentConfig.requestTimeout || 5000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value: parseFloat(value),
        from: from.toUpperCase(),
        to: to.toUpperCase()
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        const text = await response.text();
        if (text) errorMessage = text;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      value: data.value,
      unit: data.unit || data.Unit || to.toUpperCase()
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Backend service may be unreachable.');
    }
    throw error;
  }
}

export const convertTemperature = convertUnits;

/**
 * Fetch backend version info and status
 * @returns {Promise<{version: string, status: 'online' | 'offline' | 'mock'}>}
 */
export async function checkBackendStatus() {
  const currentConfig = get(config);

  if (currentConfig.mockMode) {
    return {
      version: mockVersion().version,
      status: 'mock'
    };
  }

  const baseUrl = currentConfig.apiBaseUrl.replace(/\/+$/, '');
  const versionUrl = `${baseUrl}/version`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(versionUrl, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      let version = 'v1.0.0';
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        version = data.version || 'v1.0.0';
      } else {
        const text = await response.text();
        version = text.trim() || 'v1.0.0';
      }

      return {
        version,
        status: 'online'
      };
    }

    // If /version returns 404, probe the active /converter endpoint to verify service health
    if (response.status === 404) {
      const probeController = new AbortController();
      const probeTimeout = setTimeout(() => probeController.abort(), 3000);

      try {
        const probeResponse = await fetch(`${baseUrl}/converter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: 0, from: 'CELSIUS', to: 'CELSIUS' }),
          signal: probeController.signal
        });
        clearTimeout(probeTimeout);

        if (probeResponse.ok) {
          return {
            version: 'v1.0.0',
            status: 'online'
          };
        }
      } catch {
        clearTimeout(probeTimeout);
      }
    }

    return {
      version: 'unknown',
      status: 'offline',
      error: `HTTP ${response.status}`
    };
  } catch (error) {
    clearTimeout(timeoutId);

    // Try converter probe fallback if GET /version connection was refused or errored
    try {
      const probeController = new AbortController();
      const probeTimeout = setTimeout(() => probeController.abort(), 2500);
      const probeResponse = await fetch(`${baseUrl}/converter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 0, from: 'CELSIUS', to: 'CELSIUS' }),
        signal: probeController.signal
      });
      clearTimeout(probeTimeout);

      if (probeResponse.ok) {
        return {
          version: 'v1.0.0',
          status: 'online'
        };
      }
    } catch {
      // ignore probe error and report offline
    }

    return {
      version: 'offline',
      status: 'offline',
      error: error.message || 'Connection failed'
    };
  }
}
