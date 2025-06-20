<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-500 to-red-400 text-white font-sans px-6 py-10">
    <div class="max-w-5xl mx-auto">
      <!-- Search Bar -->
      <div class="mb-8">
        <input
          v-model="search"
          type="search"
          placeholder="🔍 Search for food, restaurants, or categories"
          class="w-full px-5 py-4 rounded-xl bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-pink-300 shadow-lg transition"
        />
      </div>

      <!-- Featured Categories -->
      <section class="mb-10">
        <h2 class="text-3xl font-bold mb-6">✨ Featured Categories</h2>
        <div class="flex gap-4 overflow-x-auto pb-2">
          <button
            v-for="cat in filteredCategories"
            :key="cat.id"
            class="px-5 py-2 rounded-full bg-white text-pink-600 font-semibold shadow hover:bg-pink-100 transition whitespace-nowrap"
          >
            {{ cat.name }}
          </button>
        </div>
      </section>

      <!-- Restaurants List -->
      <section>
        <h2 class="text-3xl font-bold mb-6">🍽️ Restaurants</h2>
        <ul class="space-y-6">
          <li
            v-for="rest in filteredRestaurants"
            :key="rest.id"
            class="bg-white text-gray-900 p-6 rounded-3xl shadow-md hover:shadow-xl transition cursor-pointer"
          >
            <h3 class="text-2xl font-semibold">{{ rest.name }}</h3>
            <p class="text-gray-700 mt-1">{{ rest.description }}</p>
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
