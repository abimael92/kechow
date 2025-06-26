/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                background: {
                    light: '#F9FAFB',
                    dark: '#111827',
                },
                text: {
                    light: '#111827',
                    dark: '#F9FAFB',
                },
                primary: {
                    DEFAULT: '#6366F1',
                    light: '#8B5CF6',
                    dark: '#4F46E5',
                },
                accent: '#EC4899',
                'gradient-start': '#8183fd',
                'gradient-end': '#f569af',
            },
            fontFamily: {
                sans: ['Inter', 'Poppins', 'Helvetica', 'Arial', 'sans-serif'],
            },
            boxShadow: {
                soft: '0 4px 14px rgba(99, 102, 241, 0.3)',
                strong: '0 8px 24px rgba(99, 102, 241, 0.5)',
            },
            borderRadius: {
                xl: '1rem',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseScale: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
            },
            animation: {
                fadeInUp: 'fadeInUp 0.8s ease forwards',
                pulseScale: 'pulseScale 2s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
