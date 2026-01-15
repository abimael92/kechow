/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',  // Main purple
                    600: '#8b34e0',
                    700: '#7e22ce',
                    800: '#6b21a8',
                    900: '#581c87',
                    950: '#3b0764',
                },
                // Pink as secondary
                secondary: {
                    50: '#fdf2f8',
                    100: '#fce7f3',
                    200: '#fbcfe8',
                    300: '#f9a8d4',
                    400: '#f472b6',
                    500: '#ff5eae',  // Your pink
                    600: '#db2777',
                    700: '#be185d',
                    800: '#9d174d',
                    900: '#831843',
                    950: '#500724',
                },
                // Blue as tertiary
                tertiary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                neutral: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                    950: '#0a0a0a',
                },
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6',
                delivery: {
                    pending: '#fbbf24',
                    preparing: '#8b5cf6',
                    ontheway: '#06b6d4',
                    delivered: '#10b981',
                    cancelled: '#ef4444',
                }
            },
            background: {
                'dim-purple': '#f9f7ff', // Dim almost white purple
                'dim-purple-dark': '#1f1b2e', // Dark mode equivalent
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                chewy: ['Chewy', 'cursive'],
                display: ['Poppins', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 2px 12px rgba(0, 0, 0, 0.08)',
                'medium': '0 4px 20px rgba(0, 0, 0, 0.12)',
                'strong': '0 8px 32px rgba(0, 0, 0, 0.16)',
                'button': '0 2px 8px rgba(249, 115, 22, 0.3)',
                'button-hover': '0 4px 16px rgba(249, 115, 22, 0.4)',
            },
            borderRadius: {
                'card': '12px',
                'button': '8px',
                'input': '6px',
            },
            animation: {
                'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slide-in': 'slide-in 0.3s ease-out',
                'fade-in': 'fade-in 0.2s ease-out',
            },
            keyframes: {
                'pulse-soft': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                'slide-in': {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                'h1.text-bubble': {
                    'font-family': "'Chewy', cursive",
                    'font-weight': 'bold',
                    'letter-spacing': '0.05em',
                    'color': '#ff5eae',
                    'text-shadow': '-2px -2px 0 #4f46e5, 2px -2px 0 #4f46e5, -2px 2px 0 #4f46e5, 2px 2px 0 #4f46e5',
                },
                '.dark h1.text-bubble': {
                    'color': '#f472b6',
                    'text-shadow': '-2px -2px 0 #3730a3, 2px -2px 0 #3730a3, -2px 2px 0 #3730a3, 2px 2px 0 #3730a3',
                },
            })
        }
    ]
}

/*
50: '#fff7ed',
100: '#ffedd5',
200: '#fed7aa',
300: '#fdba74',
400: '#fb923c',
500: '#f97316',
600: '#ea580c',
700: '#c2410c',
800: '#9a3412',
900: '#7c2d12',
950: '#431407',
*/