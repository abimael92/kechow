export const ThemeConfig = {
	colors: {
		primary: '#3652b7',
		primaryLight: '#32407a',
		secondary: '#ffd708',
		secondaryHover: '#ffec8a',
		cancel: '#d80000',
		cancelHover: '##ff7676',
	},
	darkMode: {
		background: '#121212',
		surface: '#1e1e1e',
		text: '#ffffff',
	},
	lightMode: {
		background: '#ffffff',
		surface: '#f9f9f9',
		text: '#000000',
	},
	applyTheme() {
		// Example: set CSS variables
		const root = document.documentElement;
		root.style.setProperty('--color-primary', this.colors.primary);
		root.style.setProperty('--color-secondary', this.colors.secondary);
		root.style.setProperty('--color-cancel', this.colors.cancel);
	},
} as const;
