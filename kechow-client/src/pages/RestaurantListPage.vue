<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import SearchBar from '@/components/SearchBar.vue';
import CategoryChips from '@/components/CategoryChips.vue';
import RestaurantCard from '@/components/RestaurantCard.vue';

import { restaurants as restaurantData } from '@/shared/data/restaurants';
import { categoryIcons } from '@/assets/svg/food';

const { t } = useI18n();

const restaurants = ref(restaurantData);
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
		(r) =>
			(r.name.toLowerCase().includes(search.value.toLowerCase()) ||
				r.description.toLowerCase().includes(search.value.toLowerCase())) &&
			(selectedCategory.value === '' ||
				r.description
					.toLowerCase()
					.includes(selectedCategory.value.toLowerCase()))
	)
);

function resetFilters() {
	search.value = '';
	selectedCategory.value = '';
}
</script>

<template>
	<div
		class="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark font-sans transition-colors duration-300"
	>
		<div class="container py-10 space-y-10">
			<header class="flex justify-between items-center">
				<h1 class="text-4xl font-bold text-primary-gradient drop-shadow-md">
					{{ t('restaurants') }}
				</h1>
			</header>

			<SearchBar v-model:search="search" />

			<!-- Categories -->
			<section>
				<div class="flex justify-between items-center mb-4">
					<h2 class="section-heading">{{ t('featuredCategories') }}</h2>
					<button class="link-button" @click="resetFilters">
						{{ t('viewAll') }}
					</button>
				</div>
				<div class="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
					<CategoryChips
						v-for="category in categories"
						:key="category.id"
						:category="category"
						:selected="category.name === selectedCategory"
						@click="selectedCategory = category.name"
					/>
				</div>
			</section>

			<!-- Restaurants -->
			<section>
				<div class="flex justify-between items-center mb-4">
					<h2 class="section-heading">{{ t('featuredRestaurants') }}</h2>
					<button class="link-button" @click="resetFilters">
						{{ t('viewAll') }}
					</button>
				</div>
				<ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<RestaurantCard
						v-for="restaurant in filteredRestaurants"
						:key="restaurant.id"
						:restaurant="restaurant"
					/>
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
