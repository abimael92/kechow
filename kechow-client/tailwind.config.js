/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                bg: {
                    light: '#F9FAFB',
                    dark: '#111827',
                },
                text: {
                    light: '#111827',
                    dark: '#F9FAFB',
                },
                primary: {
                    light: '#6366F1',
                    dark: '#8B5CF6',
                },
            },
            fontFamily: {
                sans: ['Inter', 'General Sans', 'Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
