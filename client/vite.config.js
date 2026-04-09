import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    hmr: true,
    proxy: {
      '/api': {
        target: 'http://server-dev:5000',
        changeOrigin: true,
      },
    },
  },
});