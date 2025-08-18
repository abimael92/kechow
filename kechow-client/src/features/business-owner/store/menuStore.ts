import { defineStore } from 'pinia';
import axios from '@/lib/axios';

export const useMenuStore = defineStore('menu', {
	state: () => ({ items: [] }),
	actions: {
		async fetchMenuItems(restaurantId: number) {
			return (await axios.get(`/restaurants/${restaurantId}/menu-items`)).data;
		},
		async createMenuItem(item: any) {
			return await axios.post('/menu-items', item);
		},
		async updateMenuItem(id: number, item: any) {
			return await axios.put(`/menu-items/${id}`, item);
		},
		async deleteMenuItem(id: number) {
			return await axios.delete(`/menu-items/${id}`);
		},
	},
});
