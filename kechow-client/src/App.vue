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

<style>
/* UNscoped global layout fix */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#app {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  flex: 1;
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
  padding: 2rem;
  text-align: center;
}

.hero h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.hero p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
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
  transition: all 0.2s ease;
}
.cta:hover {
  background-color: #ffe0e0;
}

.footer {
  text-align: center;
  padding: 1rem 0;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.1);
  width: 100%;
}
</style>
