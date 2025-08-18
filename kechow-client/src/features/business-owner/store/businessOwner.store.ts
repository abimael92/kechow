import { defineStore } from 'pinia';
import axios from '@/lib/axios';

export const useBusinessOwnerStore = defineStore('businessOwner', {
	state: () => ({ dashboard: {}, orders: [] }),
	actions: {
		async fetchDashboard() {
			this.dashboard = (await axios.get('/owner/dashboard')).data;
		},
		async fetchOrders() {
			this.orders = (await axios.get('/owner/orders')).data;
		},
	},
});
