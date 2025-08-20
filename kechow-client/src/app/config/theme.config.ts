export const ThemeConfig = {
	colors: {
		primary: '#1b295c',
		primaryLight: '#32407a',
		secondary: '#ffd708',
		secondaryHover: '#ffec8a',
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
	},
} as const;
