import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
    preview: {
        // allow Render host
        allowedHosts: ['kechow-frontend.onrender.com'],
        port: 5173, // optional, match your default Vite port
    },
});
