// runs before any tests

import '@testing-library/jest-dom';

// Jest runs in Node not a browser, but some libraries (like React Router) rely on browser APIs such as TextEncoder
import { TextEncoder } from 'util';

// makes TextEncoder available globally to simulate a browser environment
global.TextEncoder = TextEncoder;