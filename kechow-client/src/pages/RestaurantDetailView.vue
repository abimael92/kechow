<template>
	<div class="p-6 max-w-4xl mx-auto">
		<div v-if="restaurant">
			<img
				v-if="restaurant.image"
				:src="restaurant.image"
				:alt="restaurant.name"
				class="w-full h-64 object-cover rounded-lg mb-4"
			/>
			<h1 class="text-3xl font-bold mb-2">{{ restaurant.name }}</h1>
			<p class="text-gray-600 dark:text-gray-300 mb-4">
				{{ restaurant.description }}
			</p>

			<h2 class="text-xl font-semibold mb-2">Menu</h2>
			<ul class="space-y-2">
				<li
					v-for="(item, i) in restaurant.menu"
					:key="i"
					class="p-3 bg-gray-100 dark:bg-gray-800 rounded shadow-sm"
				>
					{{ item }}
				</li>
			</ul>
		</div>

		<div v-else class="text-center text-gray-500 dark:text-gray-400">
			Restaurant not found.
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const restaurants = [
	{
		id: 1,
		name: 'Pizza Palace',
		description: 'Authentic Italian pizza with fresh ingredients.',
		image: 'https://source.unsplash.com/600x400/?pizza',
		menu: ['Margherita', 'Pepperoni', 'Four Cheese'],
		rating: 4.5,
	},
	{
		id: 2,
		name: 'Sushi World',
		description: 'Fresh and delicious sushi rolls and sashimi.',
		image: 'https://source.unsplash.com/600x400/?sushi',
		menu: ['California Roll', 'Tuna Sashimi', 'Salmon Nigiri'],
		rating: 4.8,
	},
];

const route = useRoute();
const restaurantId = parseInt(route.params.id as string);
const restaurant = computed(() =>
	restaurants.find((r) => r.id === restaurantId)
);
</script>
