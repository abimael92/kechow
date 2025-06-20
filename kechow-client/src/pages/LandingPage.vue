<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
function goHome() {
  router.push('/home')
}
</script>

<template>
  <div class="page">
    <main class="hero">
      <h1>Kechow Food Delivery</h1>
      <p>Your local food delivery app is cooking 🔥</p>
      <p>Your local city’s go-to food delivery app — coming soon!</p>
      <button class="cta" @click="goHome">Get Started</button>
    </main>
    <footer class="footer">© 2025 Kechow. All rights reserved.</footer>
  </div>
</template>

  <style scoped>
  .page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(135deg, #f857a6, #ff5858);
    color: white;
    font-family: 'Segoe UI', sans-serif;
    text-align: center;
    padding: 2rem;
  }
  .hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .cta {
    padding: 0.75rem 2rem;
    font-size: 1.2rem;
    background-color: white;
    color: #ff5858;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s ease;
  }
  .cta:hover {
    background-color: #ffe0e0;
  }
  .footer {
    padding: 1rem 0;
    font-size: 0.9rem;
    background: rgba(255, 255, 255, 0.1);
  }
  </style>
  