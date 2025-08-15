<template>
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Resumen del Restaurante</h1>

		<div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
			<DashboardCard v-for="stat in stats" :key="stat.name" :stat="stat" />
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DashboardCard from '@/features/business-owner/components/DashboardCard.vue';

const stats = ref([
	{
		name: 'Pedidos Nuevos',
		value: '0',
		change: '0%',
		changeType: 'increase',
		icon: 'NewOrdersIcon',
	},
	{
		name: 'En Preparación',
		value: '0',
		change: '0%',
		changeType: 'decrease',
		icon: 'PreparingIcon',
	},
	{
		name: 'Listos para Entrega',
		value: '0',
		change: '0%',
		changeType: 'increase',
		icon: 'ReadyIcon',
	},
	{
		name: 'Ingresos Hoy',
		value: '$0',
		change: '0%',
		changeType: 'increase',
		icon: 'RevenueIcon',
	},
]);

onMounted(async () => {
	// Fetch data from API
	const response = await fetch('/api/owner/dashboard');
	const data = await response.json();

	stats.value = [
		{
			name: 'Pedidos Nuevos',
			value: data.newOrders,
			change: data.newOrdersChange,
			changeType: data.newOrdersChange >= 0 ? 'increase' : 'decrease',
			icon: 'NewOrdersIcon',
		},
		{
			name: 'En Preparación',
			value: data.preparing,
			change: data.preparingChange,
			changeType: data.preparingChange >= 0 ? 'increase' : 'decrease',
			icon: 'PreparingIcon',
		},
		{
			name: 'Listos para Entrega',
			value: data.ready,
			change: data.readyChange,
			changeType: data.readyChange >= 0 ? 'increase' : 'decrease',
			icon: 'ReadyIcon',
		},
		{
			name: 'Ingresos Hoy',
			value: `$${data.revenue}`,
			change: data.revenueChange,
			changeType: data.revenueChange >= 0 ? 'increase' : 'decrease',
			icon: 'RevenueIcon',
		},
	];
});
</script>
