<script setup lang="ts">
import { ref, onMounted } from 'vue';

type Order = {
	id: number;
	status: string;
	total: number;
	date: string;
	items: string[];
	restaurant: string;
};

const orders = ref<Order[]>([]);

onMounted(() => {
	orders.value = [
		{
			id: 25634,
			status: 'Entregado',
			total: 180.00,
			date: '2024-09-01',
			items: ['Burrito de Machaca', 'Refresco de Tamarindo'],
			restaurant: "La Fonda de Doña Chole",
		},
		{
			id: 25635,
			status: 'En camino',
			total: 210.00,
			date: '2024-09-05',
			items: ['Chile Colorado', 'Sopa de Menudo', 'Coyotas'],
			restaurant: 'El Ranchito Norteño',
		},
		{
			id: 25636,
			status: 'Preparando',
			total: 125.00,
			date: '2024-09-08',
			items: ['Tacos de Discada', 'Cebollitas Asadas'],
			restaurant: 'Tacos El Güero',
		},
	];
});

// Sample categories
const categories = [
	'All',
	'Italian',
	'Chinese',
	'American',
	'Indian',
	'Healthy',
	'Japanese',
];
const selectedCategory = ref('All');
const activeTab = ref('My Orders');
</script>

<template>
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Greeting -->
		<!-- <div
			class="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8 rounded-2xl mb-8"
		>
			<h1 class="text-3xl font-bold mb-2">Good Evening! Ready to order?</h1>
			<p class="text-orange-100">
				Discover delicious food from local restaurants
			</p>
		</div> -->

		<!-- Search bar -->
		<div class="mb-8">
			<div class="relative">
				<i
					class="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center"
				></i>
				<input
					placeholder="Buscar restaurantes, comidas, o platillos..."
					class="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
					type="text"
				/>
			</div>
		</div>

		<!-- Categories -->
		<!-- <div class="mb-8">
			<div class="flex space-x-2 overflow-x-auto pb-2">
				<button
					v-for="cat in categories"
					:key="cat"
					@click="selectedCategory.value = cat"
					:class="
						cat === selectedCategory
							? 'bg-orange-600 text-white'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
					"
					class="px-6 py-2 rounded-full whitespace-nowrap transition-colors cursor-pointer"
				>
					{{ cat }}
				</button>
			</div>
		</div> -->

		<!-- Orders List -->
		<div v-if="activeTab === 'My Orders'">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
			<div class="space-y-4">
				<div
					v-for="o in orders"
					:key="o.id"
					class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
				>
					<div class="flex justify-between items-start mb-4">
						<div>
							<h3 class="font-semibold text-gray-900">{{ o.restaurant }}</h3>
							<p class="text-white text-sm">
								Order #{{ o.id }} • {{ o.items.length }} items
							</p>
						</div>
						<span
							:class="{
								'bg-green-100 text-green-800': o.status === 'Delivered',
								'bg-yellow-100 text-yellow-800': o.status === 'On the way',
								'bg-gray-100 text-gray-800':
									o.status !== 'Delivered' && o.status !== 'On the way',
							}"
							class="px-3 py-1 rounded-full text-sm font-medium"
							>{{ o.status }}</span
						>
					</div>
					<div class="text-sm text-white mb-2">{{ o.items.join(', ') }}</div>
					<div class="flex justify-between items-center">
						<span class="font-semibold text-gray-900"
							>${{ o.total.toFixed(2) }}</span
						>
						<button
							class="text-orange-600 hover:text-orange-700 font-medium text-sm cursor-pointer"
						>
							Reorder
						</button>
					</div>
				</div>
				<p v-if="!orders.length" class="text-gray-500">No orders yet.</p>
			</div>
		</div>

		<!-- Fixed Cart Button -->
		<button
			class="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors cursor-pointer z-50"
		>
			<i
				class="ri-shopping-cart-line text-xl w-6 h-6 flex items-center justify-center"
			></i>
		</button>
	</main>
</template>
