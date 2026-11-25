/**
 * Universal Unit Converter Configurations & Registry
 *
 * Designed to support extensible categories (Temperature, Length, Weight, Volume, etc.).
 * Linear units use `factor` relative to base unit.
 * Non-linear units (like Temperature) provide a custom `convert` function and `getFormulaHint`.
 */

export const UNIT_CATEGORIES = {
  temperature: {
    id: 'temperature',
    label: 'Temperature',
    icon: '🌡️',
    description: 'Convert between thermal measurement scales',
    defaultFrom: 'CELSIUS',
    defaultTo: 'FAHRENHEIT',
    defaultInput: '25',
    units: [
      { id: 'CELSIUS', label: '°C (Celsius)', symbol: '°C' },
      { id: 'FAHRENHEIT', label: '°F (Fahrenheit)', symbol: '°F' }
    ],
    presets: [
      { label: 'Freezing (0°C)', value: 0, from: 'CELSIUS', to: 'FAHRENHEIT' },
      { label: 'Room Temp (20°C)', value: 20, from: 'CELSIUS', to: 'FAHRENHEIT' },
      { label: 'Body Temp (37°C)', value: 37, from: 'CELSIUS', to: 'FAHRENHEIT' },
      { label: 'Boiling (100°C)', value: 100, from: 'CELSIUS', to: 'FAHRENHEIT' },
      { label: 'Freezing (32°F)', value: 32, from: 'FAHRENHEIT', to: 'CELSIUS' },
      { label: 'Baking (350°F)', value: 350, from: 'FAHRENHEIT', to: 'CELSIUS' }
    ],
    getFormulaHint: (from, to) => {
      if (from === 'CELSIUS' && to === 'FAHRENHEIT') return '(°C × 9/5) + 32';
      if (from === 'FAHRENHEIT' && to === 'CELSIUS') return '(°F - 32) × 5/9';
      return 'Identical Unit';
    },
    convert: (val, from, to) => {
      if (from === to) return val;
      if (from === 'CELSIUS' && to === 'FAHRENHEIT') return (val * 9) / 5 + 32;
      if (from === 'FAHRENHEIT' && to === 'CELSIUS') return ((val - 32) * 5) / 9;
      throw new Error(`Unsupported conversion: ${from} to ${to}`);
    }
  }
};

export const DEFAULT_CATEGORY = 'temperature';

export function getCategoryConfig(categoryId) {
  return UNIT_CATEGORIES[categoryId] || UNIT_CATEGORIES[DEFAULT_CATEGORY];
}

export function findCategoryByUnit(unitId) {
  const target = (unitId || '').toUpperCase();
  for (const [catId, cat] of Object.entries(UNIT_CATEGORIES)) {
    if (cat.units.some((u) => u.id === target)) {
      return catId;
    }
  }
  return DEFAULT_CATEGORY;
}

export function getUnitSymbol(unitId, categoryId = null) {
  const target = (unitId || '').toUpperCase();
  if (categoryId && UNIT_CATEGORIES[categoryId]) {
    const unit = UNIT_CATEGORIES[categoryId].units.find((u) => u.id === target);
    if (unit) return unit.symbol;
  }
  for (const cat of Object.values(UNIT_CATEGORIES)) {
    const unit = cat.units.find((u) => u.id === target);
    if (unit) return unit.symbol;
  }
  return target;
}
