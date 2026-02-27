<template>
	<div class="space-y-6 px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div
			class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
		>
			<div class="flex items-center gap-2 sm:gap-3 md:gap-4">
				<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
					<i class="ri-money-dollar-circle-line text-white text-lg sm:text-xl md:text-2xl"></i>
				</div>
				<div>
					<h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-snug">
						Ganancias
					</h1>
					<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none">
						Sigue tus ganancias y pagos de entregas
					</p>
				</div>
			</div>
			<div class="flex flex-wrap bg-gray-100 rounded-lg p-1 gap-1">
				<button
					class="px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
					:class="
						period === 'week'
							? 'bg-white text-gray-900 shadow-sm'
							: 'text-gray-600 hover:text-gray-900'
					"
					@click="
						period = 'week';
						updateStats('week');
					"
				>
					Esta semana
				</button>
				<button
					class="px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
					:class="
						period === 'month'
							? 'bg-white text-gray-900 shadow-sm'
							: 'text-gray-600 hover:text-gray-900'
					"
					@click="
						period = 'month';
						updateStats('month');
					"
				>
					Este mes
				</button>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
			<div
				v-for="card in statsCards"
				:key="card.title"
				class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 min-w-0"
			>
				<div class="flex items-center justify-between">
					<div class="min-w-0">
						<p class="text-gray-600 text-sm sm:text-base truncate">
							{{ card.title }}
						</p>
						<p class="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
							{{ card.value }}
						</p>
						<p :class="['text-sm mt-1 truncate', card.changeColor]">
							{{ card.change }}
						</p>
					</div>
					<div
						:class="`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`"
					>
						<component
							:is="card.icon"
							class="w-6 h-6"
							:class="card.iconColor"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Earnings Trend -->
		<div
			class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 w-full overflow-x-auto"
		>
			<h3 class="text-lg font-semibold text-gray-900 mb-6">
				Tendencia de ganancias
			</h3>
			<LineChart :chart-data="trendChartData" :chart-options="chartOptions" v-if="deliveryStore.earningsSummary" />
			<div v-else class="text-center py-8 text-gray-500">
				<i class="ri-line-chart-line text-4xl mb-2"></i>
				<p>No hay datos disponibles</p>
			</div>
		</div>

		<!-- Earnings Breakdown -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<div
				class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 w-full overflow-x-auto"
			>
				<h3 class="text-lg font-semibold text-gray-900 mb-6">
					Desglose de ganancias
				</h3>
				<PieChart
					:chart-data="breakdownChartData"
					:chart-options="chartOptions"
				/>
			</div>
		</div>

		<!-- Payment History -->
		<div
			class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100"
		>
			<div class="flex justify-between items-center mb-6">
				<h3 class="text-lg font-semibold text-gray-900">
					Historial de pagos
				</h3>
				<button
					class="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
				>
					Ver todo
				</button>
			</div>
			<div class="space-y-4">
				<div
					v-for="(payout, index) in payouts"
					:key="index"
					class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
				>
					<div class="flex items-center space-x-4 min-w-0">
						<div
							class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
						>
							<CurrencyDollarIcon class="text-green-600 w-5 h-5" />
						</div>
						<div class="truncate">
							<p class="font-medium text-gray-900 truncate">
								{{ payout.title }}
							</p>
							<p class="text-sm text-gray-600 truncate">{{ payout.date }}</p>
						</div>
					</div>
					<div class="text-right min-w-0">
						<p class="font-bold text-green-600">${{ payout.amount }}</p>
						<span
							class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
						>
							{{ payout.status === 'completed' ? 'Completado' : payout.status }}
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Action Buttons -->
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
			<button
				class="bg-white border border-primary-300 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
			>
				<div class="text-center">
					<CurrencyDollarIcon
						class="text-blue-600 text-2xl mb-2 w-8 h-8 mx-auto"
					/>
					<p class="font-medium text-gray-900">Descargar informe</p>
					<p class="text-sm text-gray-500">Exportar datos de ganancias</p>
				</div>
			</button>
			<button
				class="bg-white border border-primary-300 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
			>
				<div class="text-center">
					<BadgeCheckIcon
						class="text-green-600 text-2xl mb-2 w-8 h-8 mx-auto"
					/>
					<p class="font-medium text-gray-900">Métodos de pago</p>
					<p class="text-sm text-gray-500">Gestionar cuentas bancarias</p>
				</div>
			</button>
			<button
				class="bg-white border border-primary-300 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
			>
				<div class="text-center">
					<CalculatorIcon
						class="text-purple-600 text-2xl mb-2 w-8 h-8 mx-auto"
					/>
					<p class="font-medium text-gray-900">Documentos fiscales</p>
					<p class="text-sm text-gray-500">Formularios y recibos fiscales</p>
				</div>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Filler,
} from 'chart.js';
import { Line, Pie } from 'vue-chartjs';
import {
	CurrencyDollarIcon,
	TruckIcon,
	ClockIcon,
	StarIcon,
	CalculatorIcon,
	BadgeCheckIcon,
} from '@heroicons/vue/outline';
import { useDeliveryStore } from '../store/delivery.store';

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Filler
);

const deliveryStore = useDeliveryStore();
const period = ref('week');

// Load earnings on mount
onMounted(async () => {
	await deliveryStore.initialize();
	await deliveryStore.loadEarningsSummary();
});

// Stats cards from earnings summary (API: today, week, month, total)
const statsCards = computed(() => {
	const earnings = deliveryStore.earningsSummary;
	const weekVal = typeof earnings?.week === 'number' ? earnings.week : 0;
	const monthVal = typeof earnings?.month === 'number' ? earnings.month : 0;
	const totalVal = typeof earnings?.total === 'number' ? earnings.total : 0;
	const todayVal = typeof earnings?.today === 'number' ? earnings.today : 0;
	const selectedVal = period.value === 'week' ? weekVal : monthVal;

	if (!earnings) {
		return [
			{ title: 'Ganancias totales', value: '$0.00', change: 'Sin datos', changeColor: 'text-gray-600', icon: CurrencyDollarIcon, iconColor: 'text-gray-600', bgColor: 'bg-gray-100' },
			{ title: 'Entregas', value: '0', change: 'Sin datos', changeColor: 'text-gray-600', icon: TruckIcon, iconColor: 'text-gray-600', bgColor: 'bg-gray-100' },
			{ title: 'Horas en línea', value: '0h', change: 'Sin datos', changeColor: 'text-gray-600', icon: ClockIcon, iconColor: 'text-gray-600', bgColor: 'bg-gray-100' },
			{ title: 'Calificación', value: '0.0', change: '', changeColor: '', icon: StarIcon, iconColor: 'text-gray-600', bgColor: 'bg-gray-100' },
		];
	}

	return [
		{ title: 'Ganancias totales', value: `$${selectedVal.toFixed(2)}`, change: period.value === 'week' ? 'Esta semana' : 'Este mes', changeColor: 'text-green-600', icon: CurrencyDollarIcon, iconColor: 'text-green-600', bgColor: 'bg-green-100' },
		{ title: 'Entregas', value: '—', change: 'Sin datos', changeColor: 'text-blue-600', icon: TruckIcon, iconColor: 'text-blue-600', bgColor: 'bg-blue-100' },
		{ title: 'Horas en línea', value: '—', change: '', changeColor: 'text-purple-600', icon: ClockIcon, iconColor: 'text-purple-600', bgColor: 'bg-purple-100' },
		{ title: 'Calificación', value: '—', change: '', changeColor: '', icon: StarIcon, iconColor: 'text-yellow-600', bgColor: 'bg-yellow-100' },
	];
});

const payouts = [
	{ title: 'Pago semanal', date: '2024-01-15', amount: 245.5, status: 'completed' },
	{ title: 'Pago semanal', date: '2024-01-08', amount: 198.75, status: 'completed' },
	{ title: 'Pago semanal', date: '2024-01-01', amount: 267.25, status: 'completed' },
	{ title: 'Pago semanal', date: '2023-12-25', amount: 189.5, status: 'completed' },
];

const trendChartData = computed(() => {
	const earnings = deliveryStore.earningsSummary;
	const weekVal = typeof earnings?.week === 'number' ? earnings.week : 0;
	return {
		labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
		datasets: [
			{
				label: 'Ganancias',
				data: weekVal > 0 ? [weekVal * 0.1, weekVal * 0.15, weekVal * 0.12, weekVal * 0.18, weekVal * 0.24, weekVal * 0.16, weekVal * 0.2] : [0, 0, 0, 0, 0, 0, 0],
				fill: true,
				backgroundColor: 'rgba(59, 130, 246, 0.3)',
				borderColor: '#3B82F6',
				tension: 0.4,
			},
		],
	};
});

const breakdownChartData = {
	labels: ['Tarifas de entrega', 'Propinas', 'Bonos', 'Hora pico'],
	datasets: [
		{
			data: [245.5, 178.25, 67, 89.25],
			backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
		},
	],
};

const chartOptions = {
	responsive: true,
	plugins: { legend: { position: 'bottom' } },
};

const updateStats = async (selected: string) => {
	period.value = selected;
	await deliveryStore.loadEarningsSummary(selected === 'month' ? 'month' : 'week');
};
</script>
