import { defineStore } from 'pinia';
import * as service from '../services/businessOwner.service';

export const useBusinessOwnerStore = defineStore('businessOwner', {
	state: () => ({
		menuItems: [] as any[],
		orders: [] as any[],
		restaurantId: null as null | number,
	}),
	actions: {
		async loadMenuItems() {
			if (!this.restaurantId) return;
			const res = await service.fetchMenuItems(this.restaurantId);
			this.menuItems = res.data;
		},
		async addMenuItem(data: any) {
			await service.createMenuItem(data);
			await this.loadMenuItems();
		},
		async editMenuItem(id: number, data: any) {
			await service.updateMenuItem(id, data);
			await this.loadMenuItems();
		},
		async removeMenuItem(id: number) {
			await service.deleteMenuItem(id);
			await this.loadMenuItems();
		},
		async loadOrders() {
			if (!this.restaurantId) return;
			const res = await service.fetchOrders(this.restaurantId);
			this.orders = res.data;
		},
		async changeOrderStatus(orderId: number, status: string) {
			await service.updateOrderStatus(orderId, status);
			await this.loadOrders();
		},
	},
});
