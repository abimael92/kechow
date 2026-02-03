/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './src/assets/styles/global.css'],
    theme: {
        extend: {
            colors: {
                /* Brand primary: #FF6B00 */
                primary: {
                    50: '#FFF7ED',
                    100: '#FFEDD5',
                    200: '#FED7AA',
                    300: '#FDBA74',
                    400: '#FB923C',
                    500: '#FF6B00',
                    600: '#E65F00',
                    700: '#CC5500',
                    800: '#B34A00',
                    900: '#994000',
                    950: '#7A3300',
                },
                /* Nav / dark UI */
                secondary: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
                tertiary: {
                    50: '#F0FDFA',
                    100: '#CCFBF1',
                    200: '#99F6E4',
                    300: '#5EEAD4',
                    400: '#2DD4BF',
                    500: '#14B8A6', // Main tertiary color
                    600: '#0D9488',
                    700: '#0F766E',
                    800: '#115E59',
                    900: '#134E4A',
                    950: '#042F2E',
                },
                success: '#16A34A',
                warning: '#F59E0B',
                error: '#DC2626',
                info: '#2563EB',
                /* Semantic status (badges) */
                'success-bg': '#DCFCE7',
                'success-text': '#166534',
                'warning-bg': '#FEF3C7',
                'warning-text': '#92400E',
                'error-bg': '#FEE2E2',
                'error-text': '#991B1B',
            },
            backgroundColor: {
                /* Light mode: app/card use CSS vars (primary-tinted); dark overrides in .dark */
                app: 'var(--color-app-bg)',
                card: 'var(--color-card)',
                panel: '#F3F4F6',
                disabled: '#E5E7EB',
                nav: '#1F2937',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                chewy: ['Chewy', 'cursive'],
            },
            fontSize: {
                'hero': ['clamp(1.375rem, 4vw, 2rem)', { lineHeight: '1.3' }],
                'h1': ['clamp(1.375rem, 3vw, 2rem)', { lineHeight: '1.3' }],
                'h2': ['1.375rem', { lineHeight: '1.4' }],
                'h3': ['1.125rem', { lineHeight: '1.4' }],
            },
            borderRadius: {
                card: '16px',
                button: '12px',
                input: '10px',
            },
            boxShadow: {
                soft: '0 1px 3px rgba(0, 0, 0, 0.08)',
                medium: '0 4px 12px rgba(0, 0, 0, 0.08)',
            },
            animation: {
                'fade-in': 'fade-in 0.2s ease-out',
                'slide-in': 'slide-in 0.3s ease-out',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-in': {
                    '0%': { transform: 'translateY(-8px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};
