// setupTests.js

// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// ============================================
// MOCK STORAGE APIs
// ============================================

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    key: jest.fn(index => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
});

// ============================================
// MOCK BROWSER APIs
// ============================================

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock URL API
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock Blob constructor
global.Blob = jest.fn((content, options) => ({
  content,
  options,
  size: 0,
  type: options?.type || ''
}));

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
    readText: jest.fn(),
  },
});

// Mock window.location for navigation tests
delete window.location;
window.location = {
  href: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  toString: () => window.location.href,
};

// Mock window.alert and window.confirm
window.alert = jest.fn();
window.confirm = jest.fn(() => true);

// ============================================
// SUPPRESS CONSOLE NOISE
// ============================================

const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

// Store all console messages for debugging if needed
const consoleMessages = {
  errors: [],
  warnings: [],
  logs: []
};

console.error = (...args) => {
  const message = args[0]?.toString() || '';
  
    //Suppress Login component errors
  if (message.includes('Login error:')) {
    consoleMessages.errors.push(['Suppressed Login error:', ...args]);
    return;
  }

  // Suppress JSDOM navigation errors (common in API tests)
  if (message.includes('Not implemented: navigation')) {
    consoleMessages.errors.push(['Suppressed navigation error:', ...args]);
    return;
  }
  
  // Suppress React error boundary warnings
  if (message.includes('Consider adding an error boundary')) {
    consoleMessages.errors.push(['Suppressed error boundary warning:', ...args]);
    return;
  }
  
  // Suppress specific component errors during tests
  if (message.includes('Cannot read properties of null') || 
      message.includes('Cannot read properties of undefined')) {
    consoleMessages.errors.push(['Suppressed null/undefined error:', ...args]);
    return;
  }
  
  // Suppress React act() warnings
  if (args[0] && typeof args[0] === 'string' && 
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('Warning: An update to') ||
       args[0].includes('Warning: Can\'t perform a React state update'))) {
    consoleMessages.errors.push(['Suppressed React warning:', ...args]);
    return;
  }
  
  consoleMessages.errors.push(args);
  originalError.call(console, ...args);
};

console.warn = (...args) => {
  const message = args[0]?.toString() || '';
  
  // Suppress common React warnings
  if (message.includes('componentWillReceiveProps has been renamed') ||
      message.includes('componentWillMount has been renamed') ||
      message.includes('componentWillUpdate has been renamed')) {
    consoleMessages.warnings.push(['Suppressed React lifecycle warning:', ...args]);
    return;
  }
  
  consoleMessages.warnings.push(args);
  originalWarn.call(console, ...args);
};

// Optional: Log suppression can be useful for debugging
if (process.env.DEBUG_CONSOLE === 'true') {
  console.log = (...args) => {
    consoleMessages.logs.push(args);
    originalLog.call(console, ...args);
  };
} else {
  console.log = jest.fn(); // Suppress logs in test output
}

// ============================================
// JEST UTILITIES
// ============================================

// Helper to get suppressed console messages (useful for debugging)
global.getConsoleMessages = () => consoleMessages;

// Helper to clear console messages
global.clearConsoleMessages = () => {
  consoleMessages.errors = [];
  consoleMessages.warnings = [];
  consoleMessages.logs = [];
};

// ============================================
// GLOBAL TEST CLEANUP
// ============================================

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Clear console messages
  clearConsoleMessages();
  
  // Reset localStorage
  localStorageMock.clear();
  
  // Reset window.location
  window.location.href = '';
  
  // Reset alert/confirm mocks
  window.alert.mockClear?.();
  window.confirm.mockClear?.();
  
  // Reset navigator.clipboard
  navigator.clipboard.writeText.mockClear?.();
  navigator.clipboard.readText.mockClear?.();
});

afterEach(() => {
  // Clean up any pending timers
  if (jest.isMockFunction(setTimeout)) {
    jest.runOnlyPendingTimers();
  }
  
  // Log any unsuppressed errors for debugging
  if (consoleMessages.errors.length > 0 && process.env.VERBOSE_ERRORS === 'true') {
    originalError.call(console, '\n=== Uns suppressed errors in test ===');
    consoleMessages.errors.forEach(args => {
      originalError.call(console, ...args);
    });
  }
});

afterAll(() => {
  // Restore original console methods
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
});

// ============================================
// CUSTOM MATCHERS (Optional)
// ============================================

// Custom matcher to check if element has specific Bootstrap classes
expect.extend({
  toHaveBootstrapClass(received, className) {
    const pass = received.classList.contains(className);
    if (pass) {
      return {
        message: () => `Expected element not to have class "${className}"`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected element to have class "${className}"`,
        pass: false,
      };
    }
  },
});

// ============================================
// POLYFILLS FOR MISSING APIs
// ============================================

// Polyfill for requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// Polyfill for IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => []),
}));

// ============================================
// ENVIRONMENT VARIABLES FOR TESTS
// ============================================

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.REACT_APP_API_URL = 'http://localhost:3000';
process.env.REACT_APP_ENABLE_MOCKS = 'true';

// Mock process.env for components that use it
global.process = {
  ...global.process,
  env: {
    NODE_ENV: 'test',
    REACT_APP_API_URL: 'http://localhost:3000',
    REACT_APP_ENABLE_MOCKS: 'true',
  }
};