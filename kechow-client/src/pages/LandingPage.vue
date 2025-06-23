<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
function goHome() {
  router.push('/home')
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between bg-bg-light text-text-light font-sans p-10">
    <main class="flex flex-col items-center justify-center flex-grow max-w-xl mx-auto text-center space-y-8">
      <h1 class="text-5xl font-extrabold text-primary-light">Kechow Food Delivery</h1>
      <p class="text-lg opacity-90">Your local food delivery app is cooking 🔥</p>
      <p class="text-md opacity-80">Your local city’s go-to food delivery app — coming soon!</p>
      <button
        @click="goHome"
        class="mt-6 px-8 py-3 bg-primary-light text-white font-semibold rounded-lg shadow-md hover:bg-primary-light/80 transition"
      >
        Get Started
      </button>
    </main>
    <footer class="text-center text-sm opacity-60 py-4 select-none">
      © 2025 Kechow. All rights reserved.
    </footer>
  </div>
</template>
