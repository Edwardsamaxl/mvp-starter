import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import config from './config/defaults.js';

export default defineConfig({
  plugins: [react()],
  root: 'src/client',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: `http://localhost:${config.server.port}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../../dist',
  },
});
