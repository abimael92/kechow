// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    server: {
        fs: {
            strict: false,
            deny: ['.ts', '.tsx'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@app': path.resolve(__dirname, './src/app'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@components': path.resolve(__dirname, './src/components'),
            '@layout': path.resolve(__dirname, './src/shared/layout'),
            '@features': path.resolve(__dirname, './src/features'),
            '@store': path.resolve(__dirname, './src/store'),
            '@shared': path.resolve(__dirname, './src/shared'),
            '@pages': path.resolve(__dirname, './src/pages'),
        },
    },
    preview: {
        host: '0.0.0.0',
        port: Number(process.env.PORT) || 4173,
        allowedHosts: 'all',
    },
});
