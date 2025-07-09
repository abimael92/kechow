// src/features/cart/cart.store.ts
import { defineStore } from 'pinia';

// Define or import your CartItem type/interface here
interface CartItem {
	id: string;
	name: string;
	quantity: number;
	price: number;
}

export const useCartStore = defineStore('cart', {
	state: () => ({
		items: [] as CartItem[],
	}),
	actions: {
		addItem(item: CartItem) {
			// implement your addItem logic here
			this.items.push(item);
		},
	},
	getters: {
		itemCount: (state) => state.items.length,
	},
});
