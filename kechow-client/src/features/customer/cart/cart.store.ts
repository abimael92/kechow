import { defineStore } from 'pinia';

export interface CartItem {
	id: number | string;
	name: string;
	price: number;
	quantity: number;
}

export const useCartStore = defineStore('cart', {
	state: () => ({
		items: [] as CartItem[],
	}),

	getters: {
		totalItemCount(state): number {
			return state.items.reduce((sum, i) => sum + i.quantity, 0);
		},
		totalPrice(state): number {
			return state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
		},
	},

	actions: {
		addItem(item: CartItem) {
			const existing = this.items.find((i) => i.id === item.id);
			if (existing) {
				existing.quantity += item.quantity;
			} else {
				this.items.push(item);
			}
		},
		removeItem(id: number | string) {
			this.items = this.items.filter((i) => i.id !== id);
		},
		clearCart() {
			this.items = [];
		},
	},
});
