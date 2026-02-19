<template>
  <div class="space-y-6 pb-28">
    <!-- Header with Online Status -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
          <i class="ri-file-list-3-line text-white text-2xl"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-primary-500 dark:text-primary-400">
            Pedidos
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Gestión completa de entregas
          </p>
        </div>
      </div>
      
      <!-- Online Toggle -->
      <button
        @click="toggleOnlineStatus"
        :disabled="deliveryLoading"
        class="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition"
        :class="isOnline 
          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'"
      >
        <span class="relative flex h-3 w-3">
          <span v-if="isOnline" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span :class="isOnline ? 'bg-green-500' : 'bg-gray-400'" class="relative inline-flex rounded-full h-3 w-3"></span>
        </span>
        {{ isOnline ? 'En línea' : 'Desconectado' }}
        <i v-if="deliveryLoading" class="ri-loader-4-line animate-spin ml-1"></i>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
        <p class="text-sm text-gray-500 dark:text-gray-400">Horas online</p>
        <p class="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {{ availability.totalOnlineHours || 0 }}h
        </p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
        <p class="text-sm text-gray-500 dark:text-gray-400">Pedidos activos</p>
        <p class="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {{ activeOrder ? '1' : '0' }}
        </p>
      </div>
    </div>

    <!-- Active Order Banner -->
    <div v-if="activeOrder" class="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-4 shadow-md border border-primary-200 dark:border-primary-800">
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-semibold text-primary-700 dark:text-primary-300">
          Pedido activo #{{ activeOrder.id }}
        </h3>
        <span class="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-primary-300">
          {{ activeOrder.status }}
        </span>
      </div>
      
      <div class="flex gap-2 mt-3">
        <button
          v-if="activeOrder.status === 'accepted'"
          @click="updateOrderStatus('picked_up')"
          class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-xl text-sm font-medium"
        >
          Recoger
        </button>
        <button
          v-if="activeOrder.status === 'picked_up'"
          @click="updateOrderStatus('on_the_way')"
          class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-xl text-sm font-medium"
        >
          En camino
        </button>
        <button
          v-if="activeOrder.status === 'on_the_way'"
          @click="updateOrderStatus('delivered')"
          class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm font-medium"
        >
          Entregar
        </button>
      </div>
    </div>

    <!-- Search + Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md space-y-4">
      <input
        v-model="busqueda"
        placeholder="Buscar por ID o restaurante..."
        class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
      />

      <div class="flex flex-wrap gap-2">
        <button
          v-for="estado in estados"
          :key="estado"
          @click="estadoActivo = estado"
          class="px-3 py-1 rounded-full text-xs font-medium transition"
          :class="estadoActivo === estado
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary-500'"
        >
          {{ estado }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="deliveryLoading" class="flex justify-center py-8">
      <i class="ri-loader-4-line animate-spin text-primary-500 text-3xl"></i>
    </div>

    <!-- Jobs/Orders List -->
    <div v-else class="space-y-4">
      <!-- Available Jobs -->
      <div
        v-for="job in filteredJobs"
        :key="job.id"
        class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md hover:shadow-lg transition border border-gray-100 dark:border-gray-700"
      >
        <!-- Top -->
        <div class="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h3 class="font-semibold text-lg text-gray-800 dark:text-gray-200">
              {{ job.order.restaurant.name }}
            </h3>
            <p class="text-xs text-gray-500">
              #{{ job.order.id }} • {{ formatearFecha(job.order.createdAt) }}
            </p>
          </div>

          <div class="text-right">
            <p class="text-lg font-bold text-green-600">
              {{ moneda(job.order.amount) }}
            </p>
            <span
              class="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusColor(job.order.status)"
            >
              {{ getStatusText(job.order.status) }}
            </span>
          </div>
        </div>

        <!-- Quick Info -->
        <div class="grid grid-cols-3 gap-2 mt-3 text-sm">
          <div>
            <p class="text-gray-500 text-xs">Distancia</p>
            <p class="font-medium">{{ job.order.distance }} km</p>
          </div>
          <div>
            <p class="text-gray-500 text-xs">Tiempo</p>
            <p class="font-medium">{{ job.order.estimatedTime }} min</p>
          </div>
          <div>
            <p class="text-gray-500 text-xs">Ganancia</p>
            <p class="font-medium text-green-600">{{ moneda(job.order.fee) }}</p>
          </div>
        </div>

        <!-- Expand -->
        <div
          v-if="expandido === job.id"
          class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4 text-sm"
        >
          <div class="space-y-2">
            <div class="flex gap-2">
              <i class="ri-store-2-line text-gray-400"></i>
              <div>
                <p class="font-medium">Origen</p>
                <p class="text-gray-600 dark:text-gray-400">{{ job.order.restaurant.address }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <i class="ri-map-pin-line text-gray-400"></i>
              <div>
                <p class="font-medium">Destino</p>
                <p class="text-gray-600 dark:text-gray-400">{{ job.order.customer.address }}</p>
              </div>
            </div>
          </div>

          <!-- Items -->
          <div v-if="job.order.items.length">
            <p class="font-medium mb-2">Productos</p>
            <div v-for="item in job.order.items" :key="item.id" class="flex justify-between text-sm">
              <span>{{ item.quantity }}x {{ item.name }}</span>
              <span>{{ moneda(item.price * item.quantity) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2 pt-2">
            <button
              v-if="job.order.status === 'available'"
              @click="acceptOrder(job.order.id)"
              class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-xl text-sm font-medium"
              :disabled="deliveryLoading"
            >
              <i v-if="deliveryLoading" class="ri-loader-4-line animate-spin mr-1"></i>
              Aceptar pedido
            </button>
          </div>
        </div>

        <button
          @click="toggleExpand(job.id)"
          class="mt-3 text-xs text-primary-500 font-medium hover:underline"
        >
          {{ expandido === job.id ? 'Ocultar detalles' : 'Ver detalles' }}
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-if="!filteredJobs.length && !activeOrder"
        class="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-md"
      >
        <i class="ri-inbox-line text-4xl text-gray-400 mb-2"></i>
        <p class="text-gray-500">
          {{ isOnline ? 'No hay pedidos disponibles' : 'Activa el modo en línea para ver pedidos' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDriverStore } from '../store/driver.store' // Adjust path as needed
import { useDeliveryStore } from '../store/delivery.store' // Adjust path as needed

// Use stores
const driverStore = useDriverStore()
const deliveryStore = useDeliveryStore()

// Local state
const busqueda = ref('')
const estadoActivo = ref('Todos')
const expandido = ref(null)

// Estados disponibles
const estados = ['Todos', 'Disponible', 'En progreso', 'Completado']

// Computed from stores
const isOnline = computed(() => driverStore.isOnline)
const availability = computed(() => driverStore.availability)
const activeOrder = computed(() => driverStore.activeOrder || deliveryStore.activeOrder)
const deliveryLoading = computed(() => driverStore.loading)

// Combine jobs from both stores (prioritize driverStore)
const allJobs = computed(() => {
  const driverJobs = driverStore.availableJobs || []
  const deliveryJobs = deliveryStore.availableJobs || []
  
  // Use driver jobs if available, otherwise delivery jobs
  return driverJobs.length ? driverJobs : deliveryJobs
})

// Filter jobs
const filteredJobs = computed(() => {
  return allJobs.value.filter(job => {
    const matchesSearch = !busqueda.value || 
      job.order.id.toString().includes(busqueda.value) ||
      job.order.restaurant.name.toLowerCase().includes(busqueda.value.toLowerCase())
    
    const matchesStatus = estadoActivo.value === 'Todos' || 
      getStatusText(job.order.status) === estadoActivo.value
    
    return matchesSearch && matchesStatus
  })
})

// Methods
const toggleOnlineStatus = async () => {
  await driverStore.toggleOnline()
  if (driverStore.isOnline) {
    await driverStore.loadAvailableJobs()
    await deliveryStore.loadAvailableJobs()
  }
}

const acceptOrder = async (orderId) => {
  try {
    await driverStore.acceptOrder(orderId)
    expandido.value = null
  } catch (error) {
    console.error('Error accepting order:', error)
  }
}

const updateOrderStatus = async (status) => {
  if (!activeOrder.value) return
  
  try {
    await driverStore.changeOrderStatus(status)
  } catch (error) {
    console.error('Error updating order status:', error)
  }
}

const toggleExpand = (jobId) => {
  expandido.value = expandido.value === jobId ? null : jobId
}

// Helper functions
const getStatusText = (status) => {
  const map = {
    'available': 'Disponible',
    'accepted': 'En progreso',
    'picked_up': 'En progreso',
    'on_the_way': 'En progreso',
    'delivered': 'Completado',
    'cancelled': 'Cancelado'
  }
  return map[status] || status
}

const getStatusColor = (status) => {
  switch (status) {
    case 'available': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
    case 'accepted':
    case 'picked_up':
    case 'on_the_way': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    case 'delivered': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    case 'cancelled': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
    default: return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
  }
}

const moneda = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value || 0)
}

const formatearFecha = (date) => {
  return new Date(date).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Initialize on mount
onMounted(async () => {
  // Temporarily comment out to see if page loads
  // await driverStore.initialize()
  // await deliveryStore.initialize()
  
  // Just set loading to false
  driverStore.loading = false
  deliveryStore.loading = false
})

</script>