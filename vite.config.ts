import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  build: {
    manifest: true,
  },
  ssr: {
    noExternal: ['react-router', 'react-router-dom'],
    resolve: {
      conditions: ['module', 'browser', 'development|production'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
