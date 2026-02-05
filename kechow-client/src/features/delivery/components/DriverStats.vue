<template>
	<div class="space-y-4">
		<div class="flex justify-between items-center">
			<h2 class="text-lg font-bold text-gray-900 dark:text-white">Resumen</h2>
			<router-link
				to="/delivery/earnings"
				class="text-sm font-medium text-driver-primary-500 hover:text-driver-primary-600"
			>
				Ver historial
			</router-link>
		</div>
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
		<div
			v-for="(stat, key) in statsCards"
			:key="key"
			class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
		>
			<p class="text-sm text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
			<p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stat.value }}</p>
			<p class="text-xs text-driver-success-500 mt-1">{{ stat.sub }}</p>
		</div>
	</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useDriverStore } from '../store/useDriverStore';

const driverStore = useDriverStore();
const { stats } = storeToRefs(driverStore);

const statsCards = computed(() => {
	const s = stats.value;
	if (!s) {
		return {
			today: { label: 'Hoy', value: '0', sub: 'Sin datos' },
			earnings: { label: 'Ganancias hoy', value: '$0 MXN', sub: 'Sin datos' },
			completed: { label: 'Completados', value: '0', sub: 'Hoy' },
			rating: { label: 'Calificación', value: '—', sub: 'Promedio' },
		};
	}
	return {
		today: {
			label: 'Entregas hoy',
			value: String(s.today.deliveries),
			sub: `${s.today.hours.toFixed(1)}h en línea`,
		},
		earnings: {
			label: 'Ganancias hoy',
			value: `$${s.today.earnings.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`,
			sub: `Promedio: $${s.averagePerDelivery.toFixed(0)} por entrega`,
		},
		completed: {
			label: 'Completados',
			value: String(s.month.deliveries),
			sub: 'Este mes',
		},
		rating: {
			label: 'Calificación',
			value: s.rating?.toFixed(1) ?? '—',
			sub: `${s.totalDeliveries} entregas totales`,
		},
	};
});
</script>
