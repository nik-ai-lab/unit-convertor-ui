import { writable } from 'svelte/store';
import { convertUnits } from '../services/api.js';
import { DEFAULT_CATEGORY, getCategoryConfig } from '../constants/units.js';

function getInitialHistory() {
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem('uc_history');
      if (saved) return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

const defaultCatConfig = getCategoryConfig(DEFAULT_CATEGORY);

const initialState = {
  category: DEFAULT_CATEGORY,
  inputValue: defaultCatConfig.defaultInput || '25',
  fromUnit: defaultCatConfig.defaultFrom || 'CELSIUS',
  toUnit: defaultCatConfig.defaultTo || 'FAHRENHEIT',
  resultValue: null,
  isLoading: false,
  error: null,
  history: getInitialHistory()
};

function createConverterStore() {
  const { subscribe, set, update } = writable(initialState);

  function saveHistory(history) {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('uc_history', JSON.stringify(history.slice(0, 50)));
      } catch (e) {
        console.warn('Failed to persist history', e);
      }
    }
  }

  return {
    subscribe,
    setCategory: (category) => {
      update((s) => {
        const catConfig = getCategoryConfig(category);
        return {
          ...s,
          category,
          fromUnit: catConfig.defaultFrom || catConfig.units[0]?.id,
          toUnit: catConfig.defaultTo || catConfig.units[1]?.id || catConfig.units[0]?.id,
          inputValue: catConfig.defaultInput || s.inputValue,
          resultValue: null,
          error: null
        };
      });
    },
    setInputValue: (val) => update((s) => ({ ...s, inputValue: val, error: null })),
    setFromUnit: (unit) => update((s) => ({ ...s, fromUnit: unit.toUpperCase(), error: null })),
    setToUnit: (unit) => update((s) => ({ ...s, toUnit: unit.toUpperCase(), error: null })),
    swapUnits: () => {
      update((s) => {
        const nextFrom = s.toUnit;
        const nextTo = s.fromUnit;
        const nextInput = s.resultValue !== null ? String(s.resultValue) : s.inputValue;
        return {
          ...s,
          fromUnit: nextFrom,
          toUnit: nextTo,
          inputValue: nextInput,
          resultValue: null,
          error: null
        };
      });
    },
    setPreset: (value, fromUnit, toUnit, category = null) => {
      update((s) => {
        const activeCategory = category || s.category;
        return {
          ...s,
          category: activeCategory,
          inputValue: String(value),
          fromUnit: fromUnit.toUpperCase(),
          toUnit: toUnit.toUpperCase(),
          resultValue: null,
          error: null
        };
      });
    },
    convert: async () => {
      let currentState;
      update((s) => {
        currentState = s;
        return { ...s, isLoading: true, error: null };
      });

      if (currentState.inputValue === '' || isNaN(parseFloat(currentState.inputValue))) {
        update((s) => ({
          ...s,
          isLoading: false,
          error: 'Please enter a valid numeric value.'
        }));
        return;
      }

      try {
        const val = parseFloat(currentState.inputValue);
        const res = await convertUnits(
          val,
          currentState.fromUnit,
          currentState.toUnit,
          currentState.category
        );

        update((s) => {
          const newHistoryItem = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            category: s.category,
            fromValue: val,
            fromUnit: s.fromUnit,
            toValue: res.value,
            toUnit: res.unit,
            timestamp: new Date().toLocaleTimeString()
          };
          const updatedHistory = [newHistoryItem, ...s.history.slice(0, 49)];
          saveHistory(updatedHistory);

          return {
            ...s,
            isLoading: false,
            resultValue: res.value,
            error: null,
            history: updatedHistory
          };
        });
      } catch (err) {
        update((s) => ({
          ...s,
          isLoading: false,
          error: err.message || 'Conversion failed. Please try again.'
        }));
      }
    },
    clearHistory: () => {
      update((s) => {
        saveHistory([]);
        return { ...s, history: [] };
      });
    },
    deleteHistoryItem: (id) => {
      update((s) => {
        const updated = s.history.filter((item) => item.id !== id);
        saveHistory(updated);
        return { ...s, history: updated };
      });
    },
    reset: () => set(initialState)
  };
}

export const converter = createConverterStore();
