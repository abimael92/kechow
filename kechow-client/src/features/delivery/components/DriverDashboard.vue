<template>
  <div class="min-h-screen bg-gray-50">

    <!-- HEADER -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Driver Dashboard</h1>
          <p class="text-sm opacity-90">
            Welcome back, {{ driverName }}
          </p>
        </div>

        <div class="flex items-center gap-3">
          <span
            class="px-3 py-1 rounded-full text-xs font-semibold"
            :class="isOnline ? 'bg-green-500' : 'bg-red-500'"
          >
            {{ isOnline ? 'ONLINE' : 'OFFLINE' }}
          </span>

          <button
            @click="toggleOnline"
            class="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold shadow"
          >
            Toggle
          </button>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">

      <!-- STATS -->
      <div class="grid md:grid-cols-4 gap-4">
        <StatCard title="Today Orders" :value="stats.todayOrders" />
        <StatCard title="Earnings" :value="`$${stats.earnings}`" />
        <StatCard title="Rating" :value="stats.rating" />
        <StatCard title="Completed" :value="stats.completed" />
      </div>

      <!-- CURRENT DELIVERY -->
      <div v-if="currentDelivery" class="bg-white rounded-xl shadow p-5">
        <h2 class="font-semibold text-lg mb-3">Current Delivery</h2>

        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium">Order #{{ currentDelivery.id }}</p>
            <p class="text-sm text-gray-500">
              {{ currentDelivery.pickup }} → {{ currentDelivery.dropoff }}
            </p>
          </div>

          <button
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            View Details
          </button>
        </div>
      </div>

      <!-- SEARCH + FILTER -->
      <div class="flex flex-col md:flex-row gap-3">
        <input
          v-model="search"
          type="text"
          placeholder="Search orders..."
          class="flex-1 border rounded-lg px-4 py-2"
        />

        <select
          v-model="filter"
          class="border rounded-lg px-4 py-2"
        >
          <option value="">All</option>
          <option value="nearby">Nearby</option>
          <option value="highpay">High Pay</option>
        </select>
      </div>

      <!-- AVAILABLE ORDERS -->
      <div>
        <h2 class="font-semibold text-lg mb-4">Available Orders</h2>

        <div
          v-if="filteredOrders.length"
          class="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
          >
            <p class="font-medium mb-1">
              Order #{{ order.id }}
            </p>

            <p class="text-sm text-gray-500 mb-2">
              {{ order.pickup }} → {{ order.dropoff }}
            </p>

            <div class="flex justify-between items-center">
              <span class="font-semibold text-indigo-600">
                ${{ order.amount }}
              </span>

              <button
                class="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Accept
              </button>
            </div>
          </div>
        </div>

        <div
          v-else
          class="bg-white rounded-xl shadow p-8 text-center text-gray-500"
        >
          No available orders
        </div>
      </div>
    </div>

    <!-- FLOATING REFRESH -->
    <button
      @click="refreshOrders"
      class="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
    >
      ↻
    </button>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const driverName = 'John'
const isOnline = ref(true)

const stats = ref({
  todayOrders: 12,
  earnings: 145,
  rating: 4.8,
  completed: 320
})

const currentDelivery = ref({
  id: 401,
  pickup: 'Restaurant A',
  dropoff: 'Customer B'
})

const orders = ref([
  { id: 501, pickup: 'Cafe One', dropoff: 'Block C', amount: 12 },
  { id: 502, pickup: 'Pizza Hub', dropoff: 'Street 12', amount: 18 },
  { id: 503, pickup: 'Sushi Bar', dropoff: 'Park Lane', amount: 20 }
])

const search = ref('')
const filter = ref('')

const filteredOrders = computed(() => {
  return orders.value.filter(o =>
    o.pickup.toLowerCase().includes(search.value.toLowerCase())
  )
})

function toggleOnline() {
  isOnline.value = !isOnline.value
}

function refreshOrders() {
  console.log('Refresh triggered')
}
</script>

<!-- STAT CARD COMPONENT -->
<script>
export default {
  components: {
    StatCard: {
      props: ['title', 'value'],
      template: `
        <div class="bg-white p-4 rounded-xl shadow">
          <p class="text-sm text-gray-500">{{ title }}</p>
          <p class="text-xl font-bold mt-1">{{ value }}</p>
        </div>
      `
    }
  }
}
</script>