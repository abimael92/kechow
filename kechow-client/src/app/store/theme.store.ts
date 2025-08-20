import { defineStore } from 'pinia';

export type Theme = 'light' | 'dark';

export const useThemeStore = defineStore('theme', {
	state: () => ({
		currentTheme: (localStorage.getItem('theme') as Theme) || 'light',
	}),
	actions: {
		toggleTheme() {
			this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
			localStorage.setItem('theme', this.currentTheme);
			document.documentElement.classList.toggle(
				'dark',
				this.currentTheme === 'dark'
			);
		},
		setTheme(theme: Theme) {
			this.currentTheme = theme;
			localStorage.setItem('theme', theme);
			document.documentElement.classList.toggle('dark', theme === 'dark');
		},
	},
	getters: {
		isDarkMode: (state) => state.currentTheme === 'dark',
	},
});
