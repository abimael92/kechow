<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-sans px-4 py-8 transition-colors duration-300">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <header class="mb-10 flex justify-between items-center">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          Restaurants
        </h1>
        <button class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </button>
      </header>

      <!-- Search Bar -->
      <div class="mb-12">
        <div class="relative">
          <input
            v-model="search"
            type="search"
            placeholder="Search for food, restaurants, or categories"
            class="w-full px-5 py-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-500 shadow-sm transition-all duration-200"
          />
          <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Featured Categories -->
      <section class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold">Featured Categories</h2>
          <button class="text-sm text-indigo-500 dark:text-purple-400 hover:underline">View all</button>
        </div>
        <div class="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1">
          <button
            v-for="cat in filteredCategories"
            :key="cat.id"
            class="px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 font-medium shadow-xs hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm transition-all duration-200 whitespace-nowrap"
          >
            {{ cat.name }}
          </button>
        </div>
      </section>

      <!-- Restaurants List -->
      <section>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold">Top Restaurants</h2>
          <button class="text-sm text-indigo-500 dark:text-purple-400 hover:underline">View all</button>
        </div>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li
            v-for="rest in filteredRestaurants"
            :key="rest.id"
            class="group bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-purple-700 transition-all duration-300 cursor-pointer"
          >
            <div class="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
              <!-- Placeholder for restaurant image -->
              <div class="w-full h-full flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold group-hover:text-indigo-600 dark:group-hover:text-purple-400 transition-colors">{{ rest.name }}</h3>
            <p class="text-gray-600 dark:text-gray-400 mt-1">{{ rest.description }}</p>
            <div class="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              4.8 • $$$
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

interface Restaurant {
  id: number
  name: string
  description: string
}

interface Category {
  id: string
  name: string
}

const restaurants = ref<Restaurant[]>([
  { id: 1, name: 'Pizza Place', description: 'Artisanal pizzas with organic ingredients' },
  { id: 2, name: 'Sushi World', description: 'Omakase experience with seasonal fish' },
  { id: 3, name: 'Burger Barn', description: 'Wagyu beef burgers with truffle fries' },
  { id: 4, name: 'Green Leaf', description: 'Plant-based fine dining experience' },
])

const categories = ref<Category[]>([
  { id: 'c1', name: 'Italian' },
  { id: 'c2', name: 'Japanese' },
  { id: 'c3', name: 'American' },
  { id: 'c4', name: 'Vegan' },
  { id: 'c5', name: 'French' },
  { id: 'c6', name: 'Fusion' },
])

const search = ref('')

const filteredRestaurants = computed(() =>
  restaurants.value.filter((r) =>
    r.name.toLowerCase().includes(search.value.toLowerCase()) ||
    r.description.toLowerCase().includes(search.value.toLowerCase())
  )
)

const filteredCategories = computed(() =>
  categories.value.filter((c) =>
    c.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
</script>

<style>
/* Smooth scrolling behavior */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>