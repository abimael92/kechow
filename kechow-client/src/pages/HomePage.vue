<script setup lang="ts">
import { ref, computed } from 'vue';
import { restaurants as restaurantData } from '@/shared/data/restaurants';
import { categoryIcons } from '../assets/svg/food';
import { useRouter } from 'vue-router';

const router = useRouter();

const restaurants = ref(restaurantData);
const search = ref('');
const selectedCategory = ref('');

function goToRestaurant(id: number) {
	router.push({ name: 'RestaurantDetail', params: { id } });
}

const categories = ref([
	{ id: 'c1', name: 'Mariscos', icon: categoryIcons.Seafood },
	{ id: 'c5', name: 'Mexicana', icon: categoryIcons.MexicanFood },
	{ id: 'c7', name: 'Comida Rápida', icon: categoryIcons.FastFood },
	{ id: 'c8', name: 'Vegetariana', icon: categoryIcons.Vegan },
]);

const filteredRestaurants = computed(() =>
	restaurants.value.filter(
		(r) =>
			(r.name.toLowerCase().includes(search.value.toLowerCase()) ||
				r.description.toLowerCase().includes(search.value.toLowerCase())) &&
			(selectedCategory.value === '' ||
				r.description
					.toLowerCase()
					.includes(selectedCategory.value.toLowerCase()))
	)
);
</script>

<template>
	<div
		class="min-h-screen min-w-0 overflow-x-hidden bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark font-sans"
	>
		<div class="w-full max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
			<!-- Header -->
			<header class="text-center px-1">
				<h1
					class="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-gradient drop-shadow-md break-words"
				>
					Restaurantes
				</h1>
			</header>

			<!-- Search Bar -->
			<div class="sticky top-0 bg-bg-light dark:bg-bg-dark z-20 pb-2 -mx-1 px-1">
				<div class="relative min-w-0">
					<input
						v-model="search"
						type="search"
						placeholder="Buscar comida, restaurantes, categorías…"
						class="w-full min-w-0 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base text-black"
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
					</svg>
				</div>
			</div>

			<!-- Categories -->
			<section class="min-w-0">
				<div class="flex justify-between items-center gap-2 mb-3">
					<h2 class="text-base sm:text-lg font-semibold truncate">Categorías destacadas</h2>
					<button
						class="flex-shrink-0 text-sm font-medium hover:bg-purple-200 hover:text-primary transition py-1 px-2"
						@click="
							search = '';
							selectedCategory = '';
						"
					>
						Ver todo
					</button>
				</div>
				<div class="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
					<button
						v-for="category in categories"
						:key="category.id"
						@click="selectedCategory = category.name"
						class="flex flex-col items-center min-w-[72px] px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-primary/200 dark:bg-gray-800 text-xs sm:text-sm hover:bg-purple-200 hover:text-primary transition"
						:class="{
							'border-primary text-primary font-semibold':
								selectedCategory === category.name,
						}"
					>
						<img :src="category.icon" alt="icon" class="w-6 h-6 mb-1" />
						<span class="whitespace-nowrap">{{ category.name }}</span>
					</button>
				</div>
			</section>

			<!-- Restaurants -->
			<section class="min-w-0">
				<div class="flex justify-between items-center gap-2 mb-3">
					<h2 class="text-base sm:text-lg font-semibold truncate">Restaurantes destacados</h2>
					<button
						class="flex-shrink-0 text-sm font-medium hover:bg-purple-200 hover:text-primary transition py-1 px-2"
						@click="
							search = '';
							selectedCategory = '';
						"
					>
						Ver todo
					</button>
				</div>
				<ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
					<li
						v-for="restaurant in filteredRestaurants"
						:key="restaurant.id"
						@click="goToRestaurant(restaurant.id)"
						class="cursor-pointer rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition hover:-translate-y-1 min-w-0"
					>
						<div class="overflow-hidden h-36 sm:h-40 md:h-48">
							<img
								v-if="restaurant.image"
								:src="restaurant.image"
								:alt="restaurant.name"
								class="h-full w-full max-w-full object-cover transition-transform duration-300 hover:scale-105"
								loading="lazy"
							/>
							<div
								v-else
								class="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 text-sm"
							>
								Imagen no disponible
							</div>
						</div>

						<div class="p-3 sm:p-4 space-y-2 min-w-0">
							<h3
								class="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100 truncate"
							>
								{{ restaurant.name }}
							</h3>
							<p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 break-words">
								{{ restaurant.description }}
							</p>

							<div
								class="flex items-center text-xs text-gray-500 dark:text-gray-400"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-4 h-4 mr-1 text-yellow-400"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.868 
										1.48 8.326L12 18.896 4.584 23.5l1.48-8.326L0 9.306l8.332-1.151z"
									/>
								</svg>
								<span>{{ restaurant.rating }}</span>
								<span class="mx-1">•</span>
								<span>$$$</span>
							</div>
						</div>
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
	display: none;
}
.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>
