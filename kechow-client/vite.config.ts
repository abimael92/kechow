import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
	plugins: [vue()],
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
		host: '127.0.0.1',
		port: Number(process.env.PORT) || 4173,
	},
});
