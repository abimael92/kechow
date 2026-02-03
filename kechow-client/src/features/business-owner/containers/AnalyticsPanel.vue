<template>
	<div class="space-y-4 sm:space-y-6 md:space-y-8">
		<!-- Header -->
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
			<div class="flex items-center gap-2 sm:gap-3 md:gap-4">
				<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
					<i class="ri-line-chart-line text-white text-lg sm:text-xl md:text-2xl"></i>
				</div>
				<div class="flex-1 min-w-0">
					<h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-snug">
						Analíticas
					</h1>
					<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none truncate">
						Rendimiento del restaurante
					</p>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<div class="flex rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
					<button
						@click="selectedPeriod = '7days'; loadAnalyticsData()"
						:class="[
							'px-3 py-2 text-sm font-medium transition-colors',
							selectedPeriod === '7days'
								? 'bg-primary-500 text-white'
								: 'bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
						]"
					>
						7 días
					</button>
					<button
						@click="selectedPeriod = '30days'; loadAnalyticsData()"
						:class="[
							'px-3 py-2 text-sm font-medium transition-colors',
							selectedPeriod === '30days'
								? 'bg-primary-500 text-white'
								: 'bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
						]"
					>
						30 días
					</button>
				</div>
				<button
					@click="loadAnalyticsData"
					:disabled="loading"
					class="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50"
					title="Actualizar"
				>
					<i class="ri-refresh-line" :class="{ 'animate-spin': loading }"></i>
				</button>
			</div>
		</div>

		<!-- 1. Revenue Trend Graph -->
		<section>
			<h2 class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-3 uppercase tracking-wide">
				Tendencia de ingresos
			</h2>
			<div class="bg-card dark:bg-gray-800 rounded-xl border border-neutral-200 dark:border-gray-700 p-4 sm:p-6">
				<div v-if="loading" class="h-56 flex items-center justify-center">
					<div class="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent"></div>
				</div>
				<RevenueChart
					v-else-if="analyticsData?.revenue?.chartData"
					:data="analyticsData.revenue.chartData"
					type="line"
					:height="280"
				/>
				<div v-else class="h-56 flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400">
					<i class="ri-line-chart-line text-3xl mb-2"></i>
					<p class="text-sm">No hay datos de ingresos</p>
				</div>
			</div>
		</section>

		<!-- 2. Top Selling Items + 3. Delivery Performance -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
			<!-- Top Selling Items (quantity sold) -->
			<section>
				<h2 class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-3 uppercase tracking-wide">
					Más vendidos (cantidad)
				</h2>
				<div class="bg-card dark:bg-gray-800 rounded-xl border border-neutral-200 dark:border-gray-700 p-4 sm:p-6">
					<div v-if="loading" class="space-y-3">
						<div v-for="n in 5" :key="n" class="h-12 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
					</div>
					<div v-else-if="topSellingByQuantity.length" class="space-y-2">
						<div
							v-for="(item, i) in topSellingByQuantity"
							:key="item.id"
							class="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-0"
						>
							<div class="flex items-center gap-3 min-w-0">
								<span class="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
									{{ i + 1 }}
								</span>
								<span class="font-medium text-neutral-900 dark:text-white truncate">{{ item.name }}</span>
							</div>
							<span class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex-shrink-0 ml-2">
								{{ item.quantity ?? item.orders }} vendidos
							</span>
						</div>
					</div>
					<div v-else class="py-8 text-center text-neutral-500 dark:text-neutral-400">
						<i class="ri-shopping-bag-line text-2xl mb-2"></i>
						<p class="text-sm">No hay datos de ventas</p>
					</div>
				</div>
			</section>

			<!-- Delivery Performance (on-time %) -->
			<section>
				<h2 class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-3 uppercase tracking-wide">
					Rendimiento de entrega
				</h2>
				<div class="bg-card dark:bg-gray-800 rounded-xl border border-neutral-200 dark:border-gray-700 p-4 sm:p-6">
					<div v-if="loading" class="h-32 flex items-center justify-center">
						<div class="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
					</div>
					<div v-else class="flex flex-col items-center justify-center py-6">
						<div class="relative w-24 h-24 mb-3">
							<svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
								<path
									class="text-neutral-200 dark:text-neutral-700"
									stroke="currentColor"
									stroke-width="3"
									fill="none"
									d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
								/>
								<path
									:stroke-dasharray="`${deliveryOnTimePercent}, 100`"
									class="text-green-500 dark:text-green-400"
									stroke="currentColor"
									stroke-width="3"
									stroke-linecap="round"
									fill="none"
									d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
								/>
							</svg>
						</div>
						<p class="text-3xl font-bold text-neutral-900 dark:text-white">{{ deliveryOnTimePercent }}%</p>
						<p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Entregas a tiempo</p>
					</div>
				</div>
			</section>
		</div>

		<!-- 4. Busiest Days (weekly pattern) -->
		<section>
			<h2 class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-3 uppercase tracking-wide">
				Días más concurridos
			</h2>
			<div class="bg-card dark:bg-gray-800 rounded-xl border border-neutral-200 dark:border-gray-700 p-4 sm:p-6">
				<div v-if="loading" class="h-40 flex items-center justify-center">
					<div class="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
				</div>
				<div v-else-if="busiestDays.length" class="space-y-3">
					<div
						v-for="day in busiestDays"
						:key="day.day"
						class="flex items-center gap-3"
					>
						<span class="w-20 text-sm text-neutral-600 dark:text-neutral-400 flex-shrink-0">{{ day.day }}</span>
						<div class="flex-1 h-8 bg-neutral-100 dark:bg-neutral-700 rounded-lg overflow-hidden">
							<div
								class="h-full bg-primary-500 rounded-lg transition-all duration-500"
								:style="{ width: `${day.percent}%` }"
							></div>
						</div>
						<span class="w-12 text-sm font-medium text-neutral-900 dark:text-white text-right flex-shrink-0">{{ day.orders }}</span>
					</div>
				</div>
				<div v-else class="py-8 text-center text-neutral-500 dark:text-neutral-400">
					<i class="ri-calendar-line text-2xl mb-2"></i>
					<p class="text-sm">No hay datos de pedidos por día</p>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import RevenueChart from '../components/charts/RevenueChart.vue';
import { getAnalyticsData } from '../services/businessOwner.service';
import type { AnalyticsData } from '../types';

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const loading = ref(false);
const analyticsData = ref<AnalyticsData | null>(null);
const selectedPeriod = ref<'7days' | '30days'>('30days');

/** Delivery on-time % - placeholder until API provides it */
const deliveryOnTimePercent = ref(92);

const topSellingByQuantity = computed(() => {
	const items = analyticsData.value?.topSellingItems ?? [];
	return [...items]
		.sort((a, b) => (b.quantity ?? b.orders) - (a.quantity ?? a.orders))
		.slice(0, 5);
});

/** Derive busiest days from revenue trend by day of week */
const busiestDays = computed(() => {
	const trend = analyticsData.value?.revenue?.trend ?? [];
	if (trend.length === 0) return [];

	const byDay: Record<number, { orders: number; revenue: number }> = {};
	for (let i = 0; i < 7; i++) byDay[i] = { orders: 0, revenue: 0 };

	for (const point of trend) {
		const d = new Date(point.date);
		const dayIndex = (d.getDay() + 6) % 7; // Mon=0, Sun=6
		byDay[dayIndex].orders += point.orders ?? 0;
		byDay[dayIndex].revenue += point.revenue ?? 0;
	}

	const result = DAY_NAMES.map((day, i) => ({
		day,
		orders: byDay[i].orders,
		revenue: byDay[i].revenue,
	}));

	const maxOrders = Math.max(...result.map((r) => r.orders), 1);
	return result.map((r) => ({
		...r,
		percent: Math.round((r.orders / maxOrders) * 100),
	}));
});

const loadAnalyticsData = async () => {
	try {
		loading.value = true;
		analyticsData.value = await getAnalyticsData({
			period: selectedPeriod.value,
		});
	} catch (e) {
		console.error('Failed to load analytics:', e);
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	loadAnalyticsData();
});
</script>

<style scoped>
.text-bubble {
	font-size: clamp(2rem, 5vw, 3.5rem);
}
@keyframes spin {
	to { transform: rotate(360deg); }
}
.animate-spin {
	animation: spin 1s linear infinite;
}
</style>
