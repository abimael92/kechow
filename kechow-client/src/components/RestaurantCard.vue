<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
	restaurant: {
		type: Object as () => {
			id: number;
			name: string;
			description: string;
			image?: string;
			menu: {
				name: string;
				description: string;
				image: string;
				price: number;
			}[];
			rating: number;
		},
		required: true,
	},
});

const router = useRouter();

function goToRestaurant() {
	router.push({
		name: 'RestaurantDetail',
		params: { id: props.restaurant.id },
	});
}
</script>

<template>
	<li
		@click="goToRestaurant"
		class="rounded-xl overflow-hidden border border-white/10 backdrop-blur-md bg-[#fdf6ff]/50 dark:bg-[#1f152f]/60 to-pink-500/10 dark:from-gray-800/40 dark:via-purple-800/30 dark:to-pink-700/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
	>
		<div class="overflow-hidden h-48">
			<img
				v-if="restaurant.image"
				:src="restaurant.image"
				:alt="restaurant.name"
				class="h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
				loading="lazy"
				decoding="async"
			/>
			<div
				v-else
				class="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
			>
				Imagen no disponible
			</div>
		</div>

		<div class="p-4">
			<h3
				class="text-lg font-semibold text-gray-800 dark:text-white/80 group-hover:text-accent transition"
			>
				{{ restaurant.name }}
			</h3>
			<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
				{{ restaurant.description }}
			</p>

			<div
				class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-4 h-4 text-yellow-400"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						d="M12 .587l3.668 7.431L24 9.587l-6 5.847L19.335 24 12 20.201 4.665 24 6 15.434 0 9.587l8.332-1.569z"
					/>
				</svg>
				<span>{{ restaurant.rating }} </span>
				<!-- <span>• {{ restaurant.category }}</span> -->
			</div>
		</div>
	</li>
</template>
