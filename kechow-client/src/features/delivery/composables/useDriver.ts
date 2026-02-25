import { ref, computed } from 'vue'
import { useDriverStore } from '../store/driver.store'
import { useDeliveryStore } from '../store/delivery.store'
import type { DriverStatus } from '../types'

export function useDriver() {
  const driverStore = useDriverStore()
  const deliveryStore = useDeliveryStore()
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isOnline = computed(() => driverStore.status === 'online')
  const hasActiveOrder = computed(() => !!driverStore.activeOrder)
  const currentOrder = computed(() => driverStore.activeOrder)

  const toggleStatus = async () => {
    if (hasActiveOrder.value) {
      showToast('No puedes cambiar tu estado mientras tienes una entrega activa', 'warning')
      return
    }
    
    loading.value = true
    error.value = null
    
    try {
      const newStatus: DriverStatus = isOnline.value ? 'offline' : 'online'
      await driverStore.updateStatus(newStatus)
      
      // Track online time if going offline
      if (newStatus === 'offline' && driverStore.onlineSince) {
        const onlineTime = Date.now() - new Date(driverStore.onlineSince).getTime()
        await driverStore.recordOnlineTime(onlineTime)
      }
      
      return newStatus
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cambiar estado'
      throw err
    } finally {
      loading.value = false
    }
  }

  const acceptOrder = async (orderId: number) => {
    if (!isOnline.value) {
      throw new Error('Debes estar en línea para aceptar pedidos')
    }
    
    loading.value = true
    error.value = null
    
    try {
      // Check if online
      if (!navigator.onLine) {
        // Store for offline sync
        await offlineStore.addPendingAction({
          type: 'accept_order',
          payload: { orderId },
          timestamp: new Date().toISOString(),
          retryCount: 0
        })
        return
      }
      
      // Accept order online
      const order = await deliveryStore.acceptOrder(orderId)
      
      // Track acceptance time for analytics
      const responseTime = Date.now() - new Date(order.createdAt).getTime()
      await driverStore.recordResponseTime(responseTime)
      
      return order
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al aceptar pedido'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateLocation = async (lat: number, lng: number) => {
    try {
      await driverStore.updateLocation({ lat, lng })
    } catch (err) {
      console.error('Error updating location:', err)
      // Don't throw - location updates can fail silently
    }
  }

  const getStatusColor = (status: DriverStatus) => {
    const colors = {
      online: 'green',
      offline: 'gray',
      on_delivery: 'blue',
      break: 'yellow'
    }
    return colors[status] || 'gray'
  }

  const getStatusText = (status: DriverStatus) => {
    const texts = {
      online: 'En línea',
      offline: 'Desconectado',
      on_delivery: 'En entrega',
      break: 'En pausa'
    }
    return texts[status] || status
  }

  return {
    // State
    loading,
    error,
    
    // Computed
    isOnline,
    hasActiveOrder,
    currentOrder,
    
    // Methods
    toggleStatus,
    acceptOrder,
    updateLocation,
    getStatusColor,
    getStatusText
  }
}