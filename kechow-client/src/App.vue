<template>
  <div class="page">
    <main class="hero">
      <h1>Kechow Food Delivery</h1>
      <p>Your local food delivery app is cooking 🔥</p>
      <p>Your local city’s go-to food delivery app — coming soon!</p>
      <button class="cta">Get Started</button>
    </main>
    <footer class="footer">© 2025 Kechow. All rights reserved.</footer>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.page {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f857a6, #ff5858);
  color: #fff;
  font-family: 'Segoe UI', sans-serif;
}

.hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
}

.footer {
  text-align: center;
  padding: 1rem 0;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.1);
  width: 100%;
}
</style>

