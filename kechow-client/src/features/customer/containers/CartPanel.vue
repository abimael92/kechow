<script setup lang="ts">
import { ref, computed } from 'vue';

type CartItem = {
	id: number;
	name: string;
	price: number;
	image: string;
	quantity: number;
};

const cart = ref<CartItem[]>([
	{
		id: 1,
		name: 'Margherita Pizza',
		price: 12.99,
		image: 'https://source.unsplash.com/80x80/?pizza',
		quantity: 1,
	},
	{
		id: 2,
		name: 'Caesar Salad',
		price: 7.5,
		image: 'https://source.unsplash.com/80x80/?salad',
		quantity: 2,
	},
	{
		id: 3,
		name: 'Chocolate Shake',
		price: 4.99,
		image: 'https://source.unsplash.com/80x80/?milkshake',
		quantity: 1,
	},
]);

const total = computed(() =>
	cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

function increase(id: number) {
	const item = cart.value.find((i) => i.id === id);
	if (item) item.quantity++;
}

function decrease(id: number) {
	const item = cart.value.find((i) => i.id === id);
	if (item && item.quantity > 1) item.quantity--;
}

function removeItem(id: number) {
	cart.value = cart.value.filter((i) => i.id !== id);
}

function checkout() {
	alert(`Proceeding to checkout. Total: $${total.value.toFixed(2)}`);
}
</script>

<template>
	<div class="p-4 max-w-3xl mx-auto">
		<h1 class="text-2xl font-bold mb-6 text-center sm:text-left">My Cart</h1>

		<div v-if="cart.length" class="space-y-4">
			<div
				v-for="item in cart"
				:key="item.id"
				class="bg-white p-4 rounded-2xl shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-transform hover:-translate-y-1 hover:shadow-xl"
			>
				<img
					:src="item.image"
					alt="item.name"
					class="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-xl"
				/>
				<div
					class="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4"
				>
					<div class="flex-1">
						<p class="font-semibold text-gray-900">{{ item.name }}</p>
						<p class="text-gray-500 text-sm">${{ item.price.toFixed(2) }}</p>
						<div class="mt-2 flex items-center gap-2">
							<button
								@click="decrease(item.id)"
								class="px-3 py-1 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
							>
								−
							</button>
							<span class="px-3 py-1 bg-gray-100 rounded-lg text-gray-700">{{
								item.quantity
							}}</span>
							<button
								@click="increase(item.id)"
								class="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
							>
								+
							</button>
						</div>
					</div>
					<div class="flex flex-col items-end gap-2 mt-2 sm:mt-0">
						<p class="font-semibold text-gray-900">
							${{ (item.price * item.quantity).toFixed(2) }}
						</p>
						<button
							@click="removeItem(item.id)"
							class="text-red-500 hover:text-red-600 text-sm"
						>
							Remove
						</button>
					</div>
				</div>
			</div>

			<!-- Total & Checkout -->
			<div
				class="bg-gray-50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center font-semibold text-lg shadow-inner mt-4"
			>
				<span>Total: ${{ total.toFixed(2) }}</span>
				<button
					@click="checkout"
					class="mt-3 sm:mt-0 w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transition-colors"
				>
					Proceed to Checkout
				</button>
			</div>
		</div>

		<p v-else class="text-center text-gray-500 mt-12 text-lg">
			Your cart is empty.
		</p>
	</div>
</template>

<style scoped>
/* Smooth hover transition for all cards */
div[v-for] {
	transition: all 0.2s ease-in-out;
}
</style>
