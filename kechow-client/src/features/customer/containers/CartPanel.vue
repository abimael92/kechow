<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from '@features/customer/cart/cart.store';

const cart = useCartStore();

const total = computed(() =>
	cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

function checkout() {
	alert('Proceeding to checkout...');
}
</script>

<template>
	<div class="p-4">
		<h1 class="text-xl font-bold mb-4">🛒 My Cart</h1>

		<div v-if="cart.items.length" class="space-y-3">
			<div
				v-for="item in cart.items"
				:key="item.id"
				class="p-4 border rounded-lg shadow-sm flex justify-between items-center"
			>
				<div>
					<p class="font-medium">{{ item.name }}</p>
					<p class="text-sm text-gray-500">
						${{ item.price }} × {{ item.quantity }}
					</p>
				</div>
				<button class="text-red-500 text-sm" @click="cart.removeItem(item.id)">
					Remove
				</button>
			</div>

			<div class="flex justify-between items-center mt-4 font-semibold">
				<span>Total:</span>
				<span>${{ total }}</span>
			</div>

			<button
				class="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg w-full"
				@click="checkout"
			>
				Checkout
			</button>
		</div>

		<p v-else>Your cart is empty.</p>
	</div>
</template>
