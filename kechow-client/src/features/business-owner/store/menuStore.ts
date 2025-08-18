import { defineStore } from 'pinia';
import axios from '@/lib/axios';

export const useMenuStore = defineStore('menu', {
	state: () => ({
		items: [] as any[],
	}),
	actions: {
		async fetchMenuItems() {
			const res = await axios.get('/api/menu-items'); // adjust URL to backend
			this.items = res.data;
			return this.items;
		},
		async deleteMenuItem(id: number) {
			await axios.delete(`/api/menu-items/${id}`);
			this.items = this.items.filter((item) => item.id !== id);
		},
	},
});
