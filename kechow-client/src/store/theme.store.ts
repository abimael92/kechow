// src/store/theme.store.ts
import { defineStore } from 'pinia';

export type Theme = 'light' | 'dark';

export const useThemeStore = defineStore('theme', {
	state: () => ({
		currentTheme: 'light' as Theme,
	}),
	actions: {
		toggleTheme() {
			this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
		},
		setTheme(theme: Theme) {
			this.currentTheme = theme;
		},
	},
	getters: {
		isDarkMode: (state): boolean => state.currentTheme === 'dark',
	},
});
