<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import * as restaurantImages from '../assets/index';

const { t } = useI18n();

const restaurants = ref([
	{
		id: 1,
		name: 'Porto Chico',
		description: 'Restaurante de mariscos',
		image: restaurantImages.portoChico,
		menu: [
			'Ceviche clásico',
			'Camarones al mojo de ajo',
			'Cocktail de mariscos',
			'Filete empanizado',
		],
		rating: 4.3,
	},
	{
		id: 2,
		name: 'Menuderia IME',
		description: 'Menudería tradicional',
		image: restaurantImages.menuderiaIme,
		menu: [
			'Menudo rojo',
			'Menudo blanco',
			'Tacos de menudo',
			'Tortillas hechas a mano',
		],
		rating: 4.7,
	},
	{
		id: 3,
		name: 'Tacos Cano',
		description: 'Taquería',
		image: restaurantImages.tacosCano,
		menu: [
			'Tacos al pastor',
			'Tacos de carne asada',
			'Quesadillas',
			'Salsas caseras',
		],
		rating: 4.1,
	},
	{
		id: 4,
		name: 'La Terraza',
		description: 'Restaurante familiar',
		image: restaurantImages.laTerraza,
		menu: [
			'Desayunos completos',
			'Platos regionales',
			'Ensaladas',
			'Jugos naturales',
		],
		rating: 4.0,
	},
	{
		id: 5,
		name: 'Restaurante El Capi',
		description: 'Comida mexicana',
		image: restaurantImages.restauranteElCapi,
		menu: ['Carnes asadas', 'Tacos', 'Guisados', 'Postres tradicionales'],
		rating: 4.2,
	},
	{
		id: 6,
		name: 'Hamburguesas De Chito',
		description: 'Hamburguesería',
		// image: restaurantImages.hamburguesasDeChito,
		menu: [
			'Hamburguesas clásicas',
			'Hamburguesa con queso y tocino',
			'Papas fritas',
			'Malteadas',
		],
		rating: 4.1,
	},
	{
		id: 7,
		name: 'El Charco de la Rana',
		description: 'Restaurante de comida mexicana',
		image: restaurantImages.elCharcoDeLaRana,
		menu: [
			'Especialidades regionales',
			'Sopas',
			'Antojitos',
			'Bebidas tradicionales',
		],
		rating: 4.3,
	},
	{
		id: 8,
		name: 'Gorditas Y Tortillas CHANITO',
		description: 'Comida rápida tradicional',
		image: restaurantImages.gorditasYTortillasChanito,
		menu: ['Gorditas rellenas', 'Tortillas hechas a mano', 'Salsas variadas'],
		rating: 4.4,
	},
	{
		id: 9,
		name: 'Los Girasoles',
		description: 'Restaurante familiar',
		// image: restaurantImages.losGirasoles,
		menu: ['Platillos mexicanos', 'Desayunos', 'Café', 'Jugos naturales'],
		rating: 4.1,
	},
	{
		id: 10,
		name: 'Green Leaf',
		description: 'Restaurante vegano y vegetariano',
		// image: restaurantImages.greenLeaf,
		menu: [
			'Ensaladas frescas',
			'Wraps veganos',
			'Jugos naturales',
			'Postres veganos',
		],
		rating: 4.5,
	},
]);

const categories = ref([
	{ id: 'c1', name: 'Mariscos' },
	{ id: 'c2', name: 'Menudería' },
	{ id: 'c3', name: 'Taquería' },
	{ id: 'c4', name: 'Familiar' },
	{ id: 'c5', name: 'Comida Mexicana' },
	{ id: 'c6', name: 'Hamburguesería' },
	{ id: 'c7', name: 'Comida Rápida Tradicional' },
	{ id: 'c8', name: 'Vegana y Vegetariana' },
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
						v-for="category in filteredCategories"
						:key="category.id"
						class="chip"
						:class="{ 'chip-active': selectedCategory === category.name }"
						@click="
							selectedCategory =
								selectedCategory === category.name ? '' : category.name
						"
					>
						{{ category.name }}
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
						class="card group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
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
								class="text-lg font-semibold group-hover:text-primary-light transition"
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
