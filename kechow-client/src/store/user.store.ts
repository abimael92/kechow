// src/store/user.store.ts
import { defineStore } from 'pinia';

export interface User {
	id: string;
	name: string;
	email: string;
	token?: string;
	isLoggedIn: boolean;
}

export const useUserStore = defineStore('user', {
	state: (): User => ({
		id: '',
		name: '',
		email: '',
		token: undefined,
		isLoggedIn: false,
	}),
	actions: {
		login(userData: Partial<User>) {
			this.id = userData.id ?? '';
			this.name = userData.name ?? '';
			this.email = userData.email ?? '';
			this.token = userData.token;
			this.isLoggedIn = true;
		},
		logout() {
			this.id = '';
			this.name = '';
			this.email = '';
			this.token = undefined;
			this.isLoggedIn = false;
		},
	},
	getters: {
		isAuthenticated: (state): boolean => state.isLoggedIn,
	},
});
