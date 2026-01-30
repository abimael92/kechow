import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') && !id.includes('vue-router') && !id.includes('pinia')) return 'vue';
            if (id.includes('vue-router')) return 'vue-router';
            if (id.includes('pinia')) return 'pinia';
            if (id.includes('axios')) return 'axios';
            if (id.includes('chart.js') || id.includes('vue-chartjs')) return 'charts';
            if (id.includes('vue-i18n') || id.includes('@intlify')) return 'i18n';
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
      },
    },
  },
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
