<template>
    <div class="p-6 max-w-5xl mx-auto">
      <header class="mb-6">
        <input
          v-model="search"
          type="search"
          placeholder="Search restaurants or categories"
          class="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </header>
  
      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-3">Featured Categories</h2>
        <div class="flex gap-4 overflow-x-auto">
          <button
            v-for="cat in filteredCategories"
            :key="cat.id"
            class="px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100 whitespace-nowrap"
          >
            {{ cat.name }}
          </button>
        </div>
      </section>
  
      <section>
        <h2 class="text-xl font-semibold mb-3">Restaurants</h2>
        <ul class="space-y-4">
          <li
            v-for="rest in filteredRestaurants"
            :key="rest.id"
            class="p-4 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:shadow-md transition"
          >
            <h3 class="text-lg font-medium">{{ rest.name }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ rest.description }}</p>
          </li>
        </ul>
      </section>
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

// Add explicit types here
const restaurants = ref<Restaurant[]>([
  { id: 1, name: 'Pizza Place', description: 'Delicious pizzas and more' },
  { id: 2, name: 'Sushi World', description: 'Fresh sushi daily' },
  { id: 3, name: 'Burger Barn', description: 'Classic burgers & fries' },
])

const categories = ref<Category[]>([
  { id: 'c1', name: 'Pizza' },
  { id: 'c2', name: 'Sushi' },
  { id: 'c3', name: 'Burgers' },
  { id: 'c4', name: 'Vegan' },
])

  
  const search = ref('')
  
  const filteredRestaurants = computed(() =>
  restaurants.value.filter((r: Restaurant) =>
    r.name.toLowerCase().includes(search.value.toLowerCase()) ||
    r.description.toLowerCase().includes(search.value.toLowerCase())
  )
)

const filteredCategories = computed(() =>
  categories.value.filter((c: Category) =>
    c.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

</script>
  
  <style scoped>
  /* keep minimal, rely on Tailwind */
  </style>
  