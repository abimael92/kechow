import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Standardized primary aliases
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@assets': path.resolve(__dirname, './src/assets'),

      // Backward-compatible aliases (legacy imports)
      '@components': path.resolve(__dirname, './src/components'),
      '@layout': path.resolve(__dirname, './src/shared/layout'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@store': path.resolve(__dirname, './src/app/store'),
    },
  },
  server: {
    host: '127.0.0.1', // force IPv4 binding
    port: 5173,
    strictPort: true,
    fs: {
      strict: false,
      deny: ['.ts', '.tsx'],
    },
    hmr: {
      protocol: 'ws',
      host: '127.0.0.1', // fix ENOTSUP socket errors
    },
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4173,
    allowedHosts: [
      'kechow-frontend.onrender.com',
      '.onrender.com', // Allows any subdomains on Render
    ],
  },
});
