<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { restaurants as restaurantData } from '@/data/restaurants';
import { categoryIcons } from '../assets/svg/food';

import { useRouter } from 'vue-router';
const restaurants = ref(restaurantData);
const router = useRouter();

function goToRestaurant(id: number) {
	router.push({ name: 'RestaurantDetail', params: { id } });
}

const { t } = useI18n();

const categories = ref([
	{ id: 'c1', name: 'Mariscos', icon: categoryIcons.Seafood },
	{ id: 'c5', name: 'Mexicana', icon: categoryIcons.MexicanFood },
	{ id: 'c7', name: 'Comida Rápida', icon: categoryIcons.FastFood },
	{ id: 'c8', name: 'Vegetariana', icon: categoryIcons.Vegan },
]);

const search = ref('');
const selectedCategory = ref('');

const filteredRestaurants = computed(() =>
	restaurants.value.filter(
		(restaurant) =>
			(restaurant.name.toLowerCase().includes(search.value.toLowerCase()) ||
				restaurant.description
					.toLowerCase()
					.includes(search.value.toLowerCase())) &&
			(selectedCategory.value === '' ||
				restaurant.description
					.toLowerCase()
					.includes(selectedCategory.value.toLowerCase()))
	)
);

const filteredCategories = computed(() =>
	categories.value.filter((category) =>
		category.name.toLowerCase().includes(search.value.toLowerCase())
	)
);
</script>

<template>
	<div
		class="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark font-sans transition-colors duration-300"
	>
		<div class="container py-10 space-y-10">
			<!-- Header -->
			<header class="flex justify-between items-center">
				<h1 class="text-4xl font-bold text-primary-gradient drop-shadow-md">
					{{ t('restaurants') }}
				</h1>
			</header>

			<!-- Search Bar -->
			<div class="relative w-full">
				<input
					v-model="search"
					type="search"
					placeholder="Buscar comida, restaurantes, categorías…"
					class="search-input w-full text-black"
				/>
				<div
					class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-5 h-5"
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
			<section>
				<div class="flex justify-between items-center mb-4">
					<h2 class="section-heading">{{ t('featuredCategories') }}</h2>
					<button
						class="link-button"
						@click="
							search = '';
							selectedCategory = '';
						"
					>
						{{ t('viewAll') }}
					</button>
				</div>
				<div class="flex gap-3 overflow-x-auto pb-2">
					<button
						v-for="category in categories"
						:key="category.id"
						class="chip flex flex-col items-center gap-1"
					>
						<span>{{ category.name }}</span>
						<img
							:src="category.icon"
							alt="category icon"
							class="w-6 h-6 text-primary"
						/>
					</button>
				</div>
			</section>

			<!-- Restaurants -->
			<section>
				<div class="flex justify-between items-center mb-4">
					<h2 class="section-heading">{{ t('featuredRestaurants') }}</h2>
					<button
						class="link-button"
						@click="
							search = '';
							selectedCategory = '';
						"
					>
						{{ t('viewAll') }}
					</button>
				</div>
				<ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<li
						v-for="restaurant in filteredRestaurants"
						:key="restaurant.id"
						@click="goToRestaurant(restaurant.id)"
						class="rounded-xl overflow-hidden border border-white/10 backdrop-blur-md bg-[#fdf6ff]/50 dark:bg-[#1f152f]/60 to-pink-500/10 dark:from-gray-800/40 dark:via-purple-800/30 dark:to-pink-700/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
								{{ t('imageUnavailable') }}
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
							<ul
								class="mt-2 list-disc list-inside text-xs text-gray-500 dark:text-gray-400"
							>
								<li v-for="(item, index) in restaurant.menu" :key="index">
									{{ item }}
								</li>
							</ul>
							<div
								class="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-4 h-4 mr-1"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
								>
									<polygon
										points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
									/>
								</svg>
								{{ restaurant.rating }} • $$$
							</div>
						</div>
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>
