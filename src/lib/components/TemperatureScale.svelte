<script>
  import { converter } from '../stores/converterStore.js';

  // Calculate normalized temperature in Celsius for gauge representation
  $: tempInC = (() => {
    const val = parseFloat($converter.inputValue);
    if (isNaN(val)) return 20;

    if ($converter.fromUnit === 'FAHRENHEIT') {
      return (val - 32) * 5 / 9;
    }
    return val;
  })();

  // Percentage for gauge fill (bounded between -20°C and 100°C)
  $: gaugePercent = Math.min(Math.max(((tempInC + 20) / 120) * 100, 2), 100);

  // Thermal category
  $: thermalInfo = (() => {
    if (tempInC <= 0) return { label: 'Freezing / Sub-Zero', icon: '❄️', colorClass: 'cold' };
    if (tempInC < 18) return { label: 'Cool / Chilly', icon: '🧥', colorClass: 'cool' };
    if (tempInC <= 26) return { label: 'Temperate / Comfortable', icon: '🌿', colorClass: 'comfortable' };
    if (tempInC <= 38) return { label: 'Warm / Body Heat', icon: '☀️', colorClass: 'warm' };
    return { label: 'High Heat / Boiling Zone', icon: '🔥', colorClass: 'hot' };
  })();
</script>

{#if $converter.category === 'temperature'}
  <div class="thermal-visualizer {thermalInfo.colorClass}">
    <div class="visualizer-header">
      <span class="category-icon">{thermalInfo.icon}</span>
      <span class="category-label">{thermalInfo.label}</span>
      <span class="category-temp">{tempInC.toFixed(1)}°C approx</span>
    </div>

    <div class="gauge-track">
      <div class="gauge-fill" style="width: {gaugePercent}%;"></div>
      <div class="gauge-marker freezing" title="Freezing 0°C">0°</div>
      <div class="gauge-marker room" title="Room Temp 20°C">20°</div>
      <div class="gauge-marker body" title="Body Temp 37°C">37°</div>
      <div class="gauge-marker boiling" title="Boiling 100°C">100°</div>
    </div>
  </div>
{/if}

<style>
  .thermal-visualizer {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1rem;
    margin-top: 1.25rem;
    transition: all 0.3s ease;
  }

  .visualizer-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }

  .category-icon {
    font-size: 1.1rem;
  }

  .category-label {
    font-weight: 600;
    color: var(--text-primary);
  }

  .category-temp {
    margin-left: auto;
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-family: monospace;
  }

  .gauge-track {
    position: relative;
    height: 10px;
    background: #0f172a;
    border-radius: 9999px;
    overflow: visible;
    border: 1px solid var(--border-color);
  }

  .gauge-fill {
    height: 100%;
    border-radius: 9999px;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease;
    background: linear-gradient(90deg, #38bdf8 0%, #10b981 30%, #f59e0b 70%, #ef4444 100%);
  }

  .gauge-marker {
    position: absolute;
    top: 14px;
    font-size: 0.65rem;
    color: var(--text-muted);
    transform: translateX(-50%);
    font-family: monospace;
  }

  .gauge-marker.freezing { left: 16.6%; } /* (0+20)/120 */
  .gauge-marker.room { left: 33.3%; }     /* (20+20)/120 */
  .gauge-marker.body { left: 47.5%; }     /* (37+20)/120 */
  .gauge-marker.boiling { left: 100%; }   /* (100+20)/120 */

  .thermal-visualizer.cold { border-color: rgba(56, 189, 248, 0.4); }
  .thermal-visualizer.cool { border-color: rgba(6, 182, 212, 0.4); }
  .thermal-visualizer.comfortable { border-color: rgba(16, 185, 129, 0.4); }
  .thermal-visualizer.warm { border-color: rgba(245, 158, 11, 0.4); }
  .thermal-visualizer.hot { border-color: rgba(239, 68, 68, 0.4); }
</style>
