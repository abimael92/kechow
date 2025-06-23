<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '../components/ui/BaseButton.vue'

const router = useRouter()
function goHome() {
  router.push('/home')
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between px-8 py-12 text-text-primary bg-gradient-to-br from-gradient-start to-gradient-end">

    <main
      class="max-w-4xl mx-auto flex flex-col items-center text-center space-y-8 fade-in-up"
    >
      <h1 class="text-5xl sm:text-6xl drop-shadow-lg font-semibold">
        Kechow Food Delivery
      </h1>

      <p class="text-xl max-w-lg opacity-90 text-text-secondary">
        Your local food delivery app is <strong>cooking 🔥</strong>
      </p>
      <p class="text-lg max-w-md opacity-80 underline underline-offset-4 decoration-accent">
        Your local city’s go-to food delivery app — coming soon!
      </p>

      <BaseButton @click="goHome" class="btn">Get Started</BaseButton>
    </main>

    <footer class="text-center text-sm opacity-60 select-none mt-12 text-text-secondary">
      © 2025 Kechow. All rights reserved.
    </footer>
  </div>
</template>
