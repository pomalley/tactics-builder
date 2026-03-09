import { vi } from 'vitest';

// Fix for "Warning: --localstorage-file was provided without a valid path"
// this happens because Node.js 25+ has a native localStorage implementation
// that warns when accessed if not configured. We override it with a mock.

function createStorageMock() {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      for (const key in store) {
        delete store[key];
      }
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
}

const localStorageMock = createStorageMock();
const sessionStorageMock = createStorageMock();

// Define on both window (for JSDOM) and global (for Node environment)
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  configurable: true,
});

Object.defineProperty(global, 'sessionStorage', {
  value: sessionStorageMock,
  configurable: true,
});
