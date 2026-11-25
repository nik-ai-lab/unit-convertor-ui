/**
 * Mock Converter Service
 * Replicates Go backend logic for standalone playground testing and offline development.
 */

import { UNIT_CATEGORIES, findCategoryByUnit, getCategoryConfig } from '../constants/units.js';

export function mockConvert(value, fromUnit, toUnit, categoryId = null) {
  const val = parseFloat(value);
  if (isNaN(val)) {
    throw new Error('Invalid numeric value');
  }

  const from = (fromUnit || '').toUpperCase();
  const to = (toUnit || '').toUpperCase();

  const catKey = categoryId || findCategoryByUnit(from);
  const cat = getCategoryConfig(catKey);

  const fromExists = cat.units.some((u) => u.id === from);
  const toExists = cat.units.some((u) => u.id === to);

  if (!fromExists || !toExists) {
    throw new Error(`Unsupported unit conversion: ${from} to ${to} in ${cat.label}`);
  }

  let result = val;

  if (typeof cat.convert === 'function') {
    result = cat.convert(val, from, to);
  } else {
    // Linear unit conversion using factor ratio relative to base unit
    const fromUnitObj = cat.units.find((u) => u.id === from);
    const toUnitObj = cat.units.find((u) => u.id === to);
    if (fromUnitObj && toUnitObj && fromUnitObj.factor && toUnitObj.factor) {
      result = (val * fromUnitObj.factor) / toUnitObj.factor;
    }
  }

  // Round to 2 decimal places matching backend specification
  const rounded = Math.round((result + Number.EPSILON) * 100) / 100;

  return {
    value: rounded,
    unit: to
  };
}

export function mockVersion() {
  return {
    version: '1.0.0-mock'
  };
}
