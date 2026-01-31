<!-- @/features/customer/components/OrderCard.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 group cursor-pointer"
         @click="$emit('view', order)">
        <!-- Order Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div class="flex items-center gap-3">
                <!-- Status Indicator -->
                <div :class="[
                    'w-3 h-3 rounded-full',
                    statusColor[order.status]
                ]"></div>
                <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                        Pedido #{{ order.id }}
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatDate(order.createdAt) }}
                    </p>
                </div>
            </div>
            
            <div class="flex items-center gap-2 sm:gap-3">
                <!-- Order ID -->
                <span class="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                    {{ order.id }}
                </span>
                <!-- Total Amount -->
                <span class="text-lg font-bold text-gray-900 dark:text-white">
                    ${{ order.totalAmount.toFixed(2) }}
                </span>
            </div>
        </div>

        <!-- Order Items -->
        <div class="mb-4">
            <div class="flex flex-wrap gap-2 mb-2">
                <span v-for="item in order.items.slice(0, 3)" :key="item.id"
                      class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                    {{ item.name }} ×{{ item.quantity }}
                </span>
                <span v-if="order.items.length > 3" 
                      class="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                    +{{ order.items.length - 3 }} más
                </span>
            </div>
            
            <!-- Special Instructions -->
            <p v-if="order.specialInstructions" class="text-sm text-gray-600 dark:text-gray-400 italic">
                <i class="ri-information-line mr-1"></i>
                {{ order.specialInstructions }}
            </p>
        </div>

        <!-- Order Footer -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <!-- Status & Actions -->
            <div class="flex items-center gap-4">
                <!-- Status Badge -->
                <span :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    statusBadgeColor[order.status]
                ]">
                    {{ statusLabel(order.status) }}
                </span>
                
                <!-- Payment Status -->
                <span v-if="order.paymentStatus !== 'paid'" 
                      :class="[
                          'px-2 py-1 rounded text-xs font-medium',
                          paymentStatusColor[order.paymentStatus]
                      ]">
                    {{ paymentStatusLabel(order.paymentStatus) }}
                </span>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2">
                <!-- Track Button -->
                <button v-if="['preparing', 'ready', 'out_for_delivery'].includes(order.status)"
                        @click.stop="$emit('track', order)"
                        class="px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-1.5">
                    <i class="ri-map-pin-line"></i>
                    {{ $t('track') }}aqui
                </button>
                
                <!-- Reorder Button -->
                <button @click.stop="$emit('reorder', order)"
                        class="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5">
                    <i class="ri-repeat-line"></i>
                    Volver a pedir
                </button>
                
                <!-- View Details Button -->
                <button @click.stop="$emit('view', order)"
                        class="px-3 py-1.5 text-primary-600 dark:text-primary-400 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                    Ver detalles
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Order } from '@/features/customer/types/index';

defineProps<{
    order: Order;
}>();

defineEmits<{
    (e: 'reorder', order: Order): void;
    (e: 'track', order: Order): void;
    (e: 'view', order: Order): void;
}>();

const statusColor = {
    new: 'bg-blue-500',
    preparing: 'bg-yellow-500',
    ready: 'bg-orange-500',
    out_for_delivery: 'bg-purple-500',
    delivered: 'bg-green-500',
    declined: 'bg-red-500',
    cancelled: 'bg-red-500',
};

const statusBadgeColor = {
    new: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    preparing: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    ready: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    out_for_delivery: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    delivered: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    declined: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
};

const paymentStatusColor = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    paid: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    failed: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    refunded: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300',
};

const statusLabels: Record<string, string> = {
    new: 'Nuevo',
    preparing: 'Preparando',
    ready: 'Listo',
    out_for_delivery: 'En camino',
    delivered: 'Entregado',
    declined: 'Rechazado',
    cancelled: 'Cancelado',
};
const paymentStatusLabels: Record<string, string> = {
    pending: 'Pendiente',
    paid: 'Pagado',
    failed: 'Fallido',
    refunded: 'Reembolsado',
};
function statusLabel(status: string): string {
    return statusLabels[status] ?? status;
}
function paymentStatusLabel(paymentStatus: string): string {
    return paymentStatusLabels[paymentStatus] ?? paymentStatus;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Hoy, ' + date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        return 'Ayer, ' + date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
        return date.toLocaleDateString('es', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString('es', { month: 'short', day: 'numeric', year: 'numeric' });
    }
};
</script>

<style scoped>
.group:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1);
}
</style>