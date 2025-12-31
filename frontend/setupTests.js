
import '@testing-library/jest-dom';

// Only mock what's absolutely necessary
global.alert = jest.fn();
global.confirm = jest.fn(() => true);

// Suppress React Router warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('React Router')) {
    return;
  }
  originalWarn(...args);
};