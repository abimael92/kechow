import { defineStore } from 'pinia';

// Define a User interface including role
export interface User {
	id: string;
	name: string;
	email: string;
	role?: string;
	token?: string;
	isLoggedIn: boolean;
}

// Define the user store
export const useUserStore = defineStore('user', {
	state: () => ({
		user: null as null | {
			id: number;
			name: string;
			email: string;
			role: string;
		},
		token: null as null | string,
	}),
	getters: {
		isAuthenticated: (state) => !!state.token,
		isOwner: (state) => state.user?.role === 'owner',
	},
	actions: {
		setUser(user: any, token: string) {
			this.user = user;
			this.token = token;
		},
		logout() {
			this.user = null;
			this.token = null;
		},
	},
});
