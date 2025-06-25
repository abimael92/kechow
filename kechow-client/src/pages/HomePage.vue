<template>
  <div class="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark font-sans transition-colors duration-300">
    <div class="container py-10 space-y-10">

      <!-- Header -->
      <header class="flex justify-between items-center">
        <h1 class="text-4xl font-bold text-primary-gradient drop-shadow-md">
          Restaurantes
        </h1>

        <button class="icon-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </button>
      </header>

      <!-- Search Bar -->
      <div>
        <div class="relative">
          <input
            v-model="search"
            type="search"
            placeholder="Buscar comida, restaurantes, categorías…"
            class="search-input"
          />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Featured Categories -->
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="section-heading">Categorías destacadas</h2>
          <button class="link-button">Ver todas</button>
        </div>
        <div class="flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="c in filteredCategories"
            :key="c.id"
            class="chip"
            :class="{ 'chip-active': selectedCategory === c.name }"
            @click="selectedCategory = selectedCategory === c.name ? '' : c.name"
          >
            {{ c.name }}
          </button>

        </div>
      </section>

      <!-- Top Restaurants -->
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="section-heading">Restaurantes destacados</h2>
          <button class="link-button">Ver todos</button>
        </div>
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <li v-for="r in filteredRestaurants" :key="r.id" class="card group">
            <div class="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold group-hover:text-primary-light transition">
              {{ r.name }}
            </h3>

            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ r.description }}</p>
            <ul class="mt-2 list-disc list-inside text-xs text-gray-500 dark:text-gray-400">
              <li v-for="(item, index) in r.menu" :key="index">{{ item }}</li>
            </ul>

            <div class="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              {{ r.rating }} • $$$
            </div>
          </li>
        </ul>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const restaurants = ref([
  {
    id: 1,
    name: "Porto Chico",
    description: "Restaurante de mariscos",
    menu: ["Ceviche clásico", "Camarones al mojo de ajo", "Cocktail de mariscos", "Filete empanizado"],
    rating: 4.3
  },
  {
    id: 2,
    name: "Menuderia IME",
    description: "Menudería tradicional",
    menu: ["Menudo rojo", "Menudo blanco", "Tacos de menudo", "Tortillas hechas a mano"],
    rating: 4.7
  },
  {
    id: 3,
    name: "Tacos Cano",
    description: "Taquería",
    menu: ["Tacos al pastor", "Tacos de carne asada", "Quesadillas", "Salsas caseras"],
    rating: 4.1
  },
  {
    id: 4,
    name: "La Terraza",
    description: "Restaurante familiar",
    menu: ["Desayunos completos", "Platos regionales", "Ensaladas", "Jugos naturales"],
    rating: 4.0
  },
  {
    id: 5,
    name: "Restaurante El Capi",
    description: "Comida mexicana",
    menu: ["Carnes asadas", "Tacos", "Guisados", "Postres tradicionales"],
    rating: 4.2
  },
  {
    id: 6,
    name: "Hamburguesas De Chito",
    description: "Hamburguesería",
    menu: ["Hamburguesas clásicas", "Hamburguesa con queso y tocino", "Papas fritas", "Malteadas"],
    rating: 4.1
  },
  {
    id: 7,
    name: "El Charco de la Rana",
    description: "Restaurante de comida mexicana",
    menu: ["Especialidades regionales", "Sopas", "Antojitos", "Bebidas tradicionales"],
    rating: 4.3
  },
  {
    id: 8,
    name: "Gorditas Y Tortillas CHANITO",
    description: "Comida rápida tradicional",
    menu: ["Gorditas rellenas", "Tortillas hechas a mano", "Salsas variadas"],
    rating: 4.4
  },
  {
    id: 9,
    name: "Los Girasoles",
    description: "Restaurante familiar",
    menu: ["Platillos mexicanos", "Desayunos", "Café", "Jugos naturales"],
    rating: 4.1
  },
  {
    id: 10,
    name: "Green Leaf",
    description: "Restaurante vegano y vegetariano",
    menu: ["Ensaladas frescas", "Wraps veganos", "Jugos naturales", "Postres veganos"],
    rating: 4.5
  }
])

const categories = ref([
  { id: 'c1', name: 'Mariscos' },
  { id: 'c2', name: 'Menudería' },
  { id: 'c3', name: 'Taquería' },
  { id: 'c4', name: 'Familiar' },
  { id: 'c5', name: 'Comida Mexicana' },
  { id: 'c6', name: 'Hamburguesería' },
  { id: 'c7', name: 'Comida Rápida Tradicional' },
  { id: 'c8', name: 'Vegana y Vegetariana' },
])


const search = ref('')

const selectedCategory = ref('')

const filteredRestaurants = computed(() =>
  restaurants.value.filter(r =>
    (r.name.toLowerCase().includes(search.value.toLowerCase()) ||
    r.description.toLowerCase().includes(search.value.toLowerCase())) &&
    (selectedCategory.value === '' || 
      r.description.toLowerCase().includes(selectedCategory.value.toLowerCase())
    )
  )
)



const filteredCategories = computed(() =>
  categories.value.filter(c =>
    c.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
</script>

<style scoped>
/* nada aquí: todo está en global */
</style>
