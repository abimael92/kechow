/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                backgroundColor: {
                    skin: {
                        fill: '#7a51f0',
                        darkFill: '#0f0f1f',
                    },
                },
                textColor: {
                    skin: {
                        base: '#ffffff',
                        muted: '#ffffffcc',
                        dark: '#d1d5db',
                    },
                },
                gradient: {
                    start: '#ec4899', // pink
                    end: '#4f46e5',   // indigo
                },
                primary: {
                    DEFAULT: '#6366f1',
                    light: '#818cf8',
                    dark: '#4f46e5',
                },
                accent: '#f43f5e', // rose
                // accent: '#EC4899',

            },
            fontFamily: {
                chewy: ['Chewy', 'cursive'], /*   // sans: ['Inter', 'Poppins', 'Helvetica', 'Arial', 'sans-serif'],  // dacade: ['Dacade', 'sans-serif'], */
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
