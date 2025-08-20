export const AppConfig = {
	name: 'Kechow',
	description: 'Food delivery platform',
	apiBaseUrl: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
	defaultLanguage: 'es',
	supportedLanguages: ['en', 'es'],
	features: {
		enableDarkMode: true,
		enableSearchSuggestions: true,
	},
} as const;
