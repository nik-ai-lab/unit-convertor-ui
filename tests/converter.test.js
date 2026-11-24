import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockConvert, mockVersion } from '../src/lib/services/mockConverter.js';
import { UNIT_CATEGORIES, getCategoryConfig } from '../src/lib/constants/units.js';

describe('Unit Converter Tests', () => {
  it('converts Celsius to Fahrenheit correctly', () => {
    const res = mockConvert(0, 'CELSIUS', 'FAHRENHEIT');
    assert.strictEqual(res.value, 32);
    assert.strictEqual(res.unit, 'FAHRENHEIT');
  });

  it('converts Fahrenheit to Celsius correctly', () => {
    const res = mockConvert(212, 'FAHRENHEIT', 'CELSIUS');
    assert.strictEqual(res.value, 100);
    assert.strictEqual(res.unit, 'CELSIUS');
  });

  it('converts Celsius boiling point to Fahrenheit', () => {
    const res = mockConvert(100, 'CELSIUS', 'FAHRENHEIT');
    assert.strictEqual(res.value, 212);
  });

  it('throws error for invalid numeric values', () => {
    assert.throws(() => mockConvert('not-a-number', 'CELSIUS', 'FAHRENHEIT'), {
      message: 'Invalid numeric value'
    });
  });

  it('throws error for unsupported units', () => {
    assert.throws(() => mockConvert(10, 'KELVIN', 'CELSIUS'), {
      message: /Unsupported unit conversion/
    });
  });

  it('returns valid mock version', () => {
    const ver = mockVersion();
    assert.strictEqual(ver.version, '1.0.0-mock');
  });

  it('verifies category configuration', () => {
    const tempConfig = getCategoryConfig('temperature');
    assert.ok(tempConfig);
    assert.strictEqual(tempConfig.id, 'temperature');
    assert.strictEqual(tempConfig.units.length, 2);
  });
});
