
import '@testing-library/jest-dom';

// Mock alert and confirm
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

// Suppress specific console errors from tests
const originalError = console.error;
console.error = (...args) => {
  // Suppress "Not implemented: window.alert" error
  if (typeof args[0] === 'string' && args[0].includes('Not implemented: window.alert')) {
    return;
  }
  // Suppress login errors
  if (typeof args[0] === 'string' && args[0].includes('Login error')) {
    return;
  }
  // Suppress activity form errors
  if (typeof args[0] === 'string' && args[0].includes('Error adding activity')) {
    return;
  }
  originalError(...args);
};

beforeEach(() => {
  jest.clearAllMocks();
});