<template>
	<div class="space-y-8">
		<!-- Header Section -->
		<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
			<div class="flex items-center gap-4">
				<div class="w-16 h-16 rounded-3xl bg-gradient-to-r from-secondary-600 to-secondary-500 flex items-center justify-center shadow-md shadow-primary-500/30">
					<i class="ri-line-chart-line text-white text-xl"></i>
				</div>
				<div>
					<h1 class="text-bubble text-6xl shadow-primary-500">
						{{ $t('analytics') }}
					</h1>
					<p class="text-neutral-950 dark:text-neutral-200 font-normal text-xl select-none">
						{{ $t('trackPerformance') }}
						<span v-if="analyticsData" class="ml-2 text-tertiary-800 font-medium">
							{{ $t('lastUpdated') }}: {{ formatTime(analyticsData.lastUpdated) }}
						</span>
					</p>
				</div>
			</div>

			<div class="flex flex-wrap gap-3">
				<!-- Time Period Selector -->
				<div class="relative">
					<button
						@click="toggleTimePeriodDropdown"
						class="bg-gradient-to-r from-tertiary-600 to-tertiary-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-2"
					>
						<i class="ri-calendar-line"></i>
						{{ $t(timePeriodOptions.find(p => p.value === selectedPeriod)?.label || 'last30Days') }}
						<i class="ri-arrow-down-s-line text-sm transition-transform duration-200" :class="{ 'rotate-180': showTimePeriodDropdown }"></i>
					</button>
					
					<transition name="fade">
						<div 
							v-if="showTimePeriodDropdown" 
							class="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden"
						>
							<div class="py-2">
								<button
									v-for="period in timePeriodOptions"
									:key="period.value"
									@click="setTimePeriod(period.value)"
									:class="[
										'w-full px-4 py-2.5 text-left text-sm transition-colors cursor-pointer flex items-center justify-between',
										selectedPeriod === period.value
											? 'bg-tertiary-200  text-neutral-800'
											: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
									]"
								>
									<span>{{ $t(period.label) }}</span>
									<i v-if="selectedPeriod === period.value" class="ri-check-line"></i>
								</button>
							</div>
						</div>
					</transition>
				</div>
				
				<!-- Export Button -->
				<button
					@click="exportAnalytics"
					class="bg-gradient-to-r from-tertiary-600 to-tertiary-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-2"
				>
					<i class="ri-download-line"></i>
					{{ $t('export') }}
				</button>

				<!-- Refresh Button -->
				<button
					@click="loadAnalyticsData"
					:disabled="loading"
					class="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<i 
						class="ri-refresh-line text-lg transition-transform duration-500" 
						:class="{ 'animate-spin': loading }"
					></i>
					{{ loading ? $t('refreshing') : $t('refresh') }}
				</button>
			</div>
		</div>

		<!-- Analytics Summary Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<AnalyticsCard
				:title="$t('totalRevenue')"
				:value="`$${formatNumber(analyticsData?.revenue.total || 0)}`"
				:change="getChangeText(analyticsData?.revenue.change || 0, 'fromLastMonth')"
				:icon="getRevenueIcon(analyticsData?.revenue.change || 0)"
				:positive="(analyticsData?.revenue.change || 0) >= 0"
				:loading="loading"
				:trendData="analyticsData?.revenue.trend"
				@click="setActiveTab('revenue')"
				class="cursor-pointer hover:shadow-md transition-shadow"
			/>
			<AnalyticsCard
				:title="$t('totalOrders')"
				:value="formatNumber(analyticsData?.orders.total || 0)"
				:change="getChangeText(analyticsData?.orders.change || 0, 'fromLastMonth')"
				icon="ri-file-list-line"
				:positive="(analyticsData?.orders.change || 0) >= 0"
				:loading="loading"
				:trendData="analyticsData?.orders.trend"
				@click="setActiveTab('overview')"
				class="cursor-pointer hover:shadow-md transition-shadow"
			/>
			<AnalyticsCard
				:title="$t('avgOrderValue')"
				:value="`$${formatCurrency(analyticsData?.avgOrderValue.current || 0)}`"
				:change="getChangeText(analyticsData?.avgOrderValue.change || 0, 'fromLastMonth')"
				icon="ri-shopping-cart-line"
				:positive="(analyticsData?.avgOrderValue.change || 0) >= 0"
				:loading="loading"
				@click="setActiveTab('revenue')"
				class="cursor-pointer hover:shadow-md transition-shadow"
			/>
			<AnalyticsCard
				:title="$t('customerRating')"
				:value="formatRating(analyticsData?.customerRating.current || 0)"
				:change="getChangeText(analyticsData?.customerRating.change || 0, 'fromLastMonth', true)"
				icon="ri-star-line"
				:positive="(analyticsData?.customerRating.change || 0) >= 0"
				:loading="loading"
				@click="setActiveTab('customers')"
				class="cursor-pointer hover:shadow-md transition-shadow"
			/>
		</div>

		<!-- Analytics Tabs -->
		<div class="border-b border-gray-200 dark:border-gray-700">
			<div class="flex space-x-8 overflow-x-auto">
				<button
					v-for="tab in analyticsTabs"
					:key="tab.id"
					@click="setActiveTab(tab.id)"
					:class="[
						'py-4 px-2 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap transition-colors',
						activeTab === tab.id
							? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
							: 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
					]"
				>
					<i :class="tab.icon" class="mr-2"></i>
					{{ $t(tab.label) }}
					<span v-if="tab.badge" class="ml-2 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded-full">
						{{ tab.badge }}
					</span>
				</button>
			</div>
		</div>

		<!-- Main Content Area -->
		<div class="space-y-8">
			<!-- Overview Dashboard -->
			<template v-if="activeTab === 'overview'">
				<div class="grid lg:grid-cols-2 gap-8">
					<!-- Revenue Trend Chart -->
					<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
						<div class="flex justify-between items-center mb-6">
							<h3 class="text-xl font-bold text-gray-900 dark:text-white">
								{{ $t('revenueTrend') }}
							</h3>
							<div class="flex gap-2">
								<button
									v-for="chartType in revenueChartTypes"
									:key="chartType"
									@click="revenueChartType = chartType as 'line' | 'bar' | 'area'"
									:class="[
										'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
										revenueChartType === chartType
											? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
											: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
									]"
								>
									{{ $t(chartType) }}
								</button>
							</div>
						</div>
						<div class="w-full h-64">
							<!-- Revenue Chart Component -->
							<div v-if="loading" class="w-full h-64 flex items-center justify-center">
								<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
							</div>
							<RevenueChart 
								v-else-if="analyticsData?.revenue.chartData"
								:data="analyticsData.revenue.chartData"
								:type="revenueChartType"
								class="h-64"
							/>
							<div v-else class="w-full h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg text-center text-gray-500 dark:text-gray-400">
								<i class="ri-line-chart-line text-3xl mb-2"></i>
								<p>{{ $t('revenueChartPlaceholder') }}</p>
							</div>
						</div>
					</div>

					<!-- Orders by Hour Chart -->
					<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
						<div class="flex justify-between items-center mb-6">
							<h3 class="text-xl font-bold text-gray-900 dark:text-white">
								{{ $t('ordersByHour') }}
							</h3>
							<button
								@click="toggleOrderHourView"
								class="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
							>
								{{ $t(orderHourView === 'day' ? 'viewByWeek' : 'viewByDay') }}
							</button>
						</div>
						<div class="w-full h-64">
							<div v-if="loading" class="w-full h-64 flex items-center justify-center">
								<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
							</div>
							<OrdersByHourChart 
								v-else-if="(analyticsData as any)?.ordersByHour"
								:data="(analyticsData as any).ordersByHour"
								:view="orderHourView"
								class="h-64"
							/>
							<div v-else class="w-full h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg text-center text-gray-500 dark:text-gray-400">
								<i class="ri-bar-chart-line text-3xl mb-2"></i>
								<p>{{ $t('ordersByHourPlaceholder') }}</p>
							</div>
						</div>
					</div>

					<!-- Sales by Category -->
					<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
						<h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
							{{ $t('salesByCategory') }}
						</h3>
						<div class="w-full h-64">
							<div v-if="loading" class="w-full h-64 flex items-center justify-center">
								<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
							</div>
							<SalesByCategoryChart 
								v-else-if="(analyticsData as any)?.salesByCategory"
								:data="(analyticsData as any).salesByCategory"
								class="h-64"
							/>
							<div v-else class="w-full h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg text-center text-gray-500 dark:text-gray-400">
								<i class="ri-pie-chart-line text-3xl mb-2"></i>
								<p>{{ $t('salesByCategoryPlaceholder') }}</p>
							</div>
						</div>
					</div>

					<!-- Top Selling Items -->
					<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
						<div class="flex justify-between items-center mb-6">
							<h3 class="text-xl font-bold text-gray-900 dark:text-white">
								{{ $t('topSellingItems') }}
							</h3>
							<button
								@click="toggleTopItemsView"
								class="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
							>
								{{ $t(topItemsView === 'revenue' ? 'viewByOrders' : 'viewByRevenue') }}
							</button>
						</div>
						<div class="space-y-4">
							<template v-if="loading">
								<div v-for="n in 5" :key="n" class="flex items-center justify-between p-3 animate-pulse">
									<div class="flex items-center gap-3">
										<div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
										<div class="space-y-2">
											<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
											<div class="h-3 bg-gray-100 dark:bg-gray-600 rounded w-24"></div>
										</div>
									</div>
									<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
								</div>
							</template>
							<template v-else-if="analyticsData?.topSellingItems">
								<TopSellingItem
									v-for="(item, index) in sortedTopItems"
									:key="item.id"
									:rank="String(index + 1)"
									:name="item.name"
									:orders="String(item.orders)"
									:revenue="`$${formatCurrency(item.revenue)}`"
									:trend="item.trend"
									:category="item.category"
									@click="viewItemDetails(item)"
									class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
								/>
							</template>
							<div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
								<i class="ri-information-line text-2xl mb-2"></i>
								<p>{{ $t('noTopItemsData') }}</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Performance Insights -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
					<h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
						{{ $t('performanceInsights') }}
					</h3>
					<div class="grid md:grid-cols-3 gap-6">
						<div 
							v-for="insight in performanceInsights"
							:key="insight.id"
							class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
							:class="{ 'bg-primary-50 dark:bg-primary-900/10': insight.highlight }"
						>
							<div class="flex items-start gap-3">
								<div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="insight.bgColor">
									<i :class="insight.icon" class="text-lg" :style="{ color: insight.color }"></i>
								</div>
								<div>
									<h4 class="font-semibold text-gray-900 dark:text-white">{{ $t(insight.title) }}</h4>
									<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ insight.description }}</p>
									<div v-if="insight.metric" class="flex items-center gap-2 mt-2">
										<span class="text-2xl font-bold text-gray-900 dark:text-white">{{ insight.metric }}</span>
										<span class="text-sm px-2 py-1 rounded-full" :class="insight.trend > 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'">
											{{ insight.trend > 0 ? '+' : '' }}{{ insight.trend }}%
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>

			<!-- Other Tabs Content (Revenue, Products, Customers) -->
			<div v-else class="text-center py-12">
				<div class="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600">
					<i :class="activeTabIcon" class="text-6xl"></i>
				</div>
				<h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
					{{ $t('comingSoon') }}
				</h3>
				<p class="text-gray-500 dark:text-gray-400">
					{{ $t('featureComingSoon') }}
				</p>
			</div>
		</div>
	</div>
	
	<!-- Click Outside Listener -->
	<div v-if="showTimePeriodDropdown" class="fixed inset-0 z-40" @click="showTimePeriodDropdown = false"></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import AnalyticsCard from '../components/AnalyticsCard.vue';
import TopSellingItem from '../components/TopSellingItem.vue';
import RevenueChart from '../components/charts/RevenueChart.vue';
import OrdersByHourChart from '../components/charts/OrdersByHourChart.vue';
import SalesByCategoryChart from '../components/charts/SalesByCategoryChart.vue';
import { getAnalyticsData } from '../services/businessOwner.service';
import type { AnalyticsData } from '../types/';

const { t } = useI18n();

const loading = ref(false);
const analyticsData = ref<AnalyticsData | null>(null);
const activeTab = ref('overview');
const selectedPeriod = ref('30days');
const showTimePeriodDropdown = ref(false);
const revenueChartType = ref<'line' | 'bar' | 'area'>('line');
const orderHourView = ref('day');
const topItemsView = ref('revenue');

const timePeriodOptions = [
	{ value: '7days', label: 'last7Days' },
	{ value: '30days', label: 'last30Days' },
	{ value: '90days', label: 'last90Days' },
	{ value: 'year', label: 'thisYear' },
	{ value: 'custom', label: 'customRange' }
];

const analyticsTabs = computed(() => [
	{ id: 'overview', label: 'overview', icon: 'ri-dashboard-line', badge: null },
	{ id: 'revenue', label: 'revenue', icon: 'ri-money-dollar-circle-line', badge: null },
	{ id: 'products', label: 'products', icon: 'ri-shopping-bag-line', badge: null },
	{ id: 'customers', label: 'customers', icon: 'ri-user-line', badge: null }
]);

const revenueChartTypes = ['line', 'bar', 'area'];

const activeTabIcon = computed(() => {
	const tab = analyticsTabs.value.find(t => t.id === activeTab.value);
	return tab?.icon || 'ri-dashboard-line';
});

const performanceInsights = computed(() => [
	{
		id: 1,
		title: 'peakHours',
		description: t('peakHoursDescription'),
		icon: 'ri-time-line',
		color: '#3b82f6',
		bgColor: 'bg-blue-100 dark:bg-blue-900/30',
		metric: '6-9 PM',
		trend: 15,
		highlight: true
	},
	{
		id: 2,
		title: 'bestCategory',
		description: t('bestCategoryDescription'),
		icon: 'ri-pie-chart-line',
		color: '#10b981',
		bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
		metric: t('pizza'),
		trend: 22,
		highlight: false
	},
	{
		id: 3,
		title: 'customerGrowth',
		description: t('customerGrowthDescription'),
		icon: 'ri-user-add-line',
		color: '#8b5cf6',
		bgColor: 'bg-purple-100 dark:bg-purple-900/30',
		metric: '+142',
		trend: 18,
		highlight: false
	}
]);

const sortedTopItems = computed(() => {
	if (!analyticsData.value?.topSellingItems) return [];
	
	return [...analyticsData.value.topSellingItems].sort((a, b) => {
		if (topItemsView.value === 'revenue') {
			return b.revenue - a.revenue;
		} else {
			return b.orders - a.orders;
		}
	}).slice(0, 5);
});

// Functions
const formatNumber = (num: number) => {
	return new Intl.NumberFormat().format(num);
};

const formatCurrency = (num: number) => {
	return num.toFixed(2);
};

const formatRating = (rating: number) => {
	return rating.toFixed(1);
};

const formatTime = (timestamp?: string) => {
	if (!timestamp) return '--';
	const date = new Date(timestamp);
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getChangeText = (change: number, periodKey: string, isRating = false) => {
	const prefix = change > 0 ? '+' : '';
	const unit = isRating ? '' : '%';
	const value = isRating ? change.toFixed(1) : Math.abs(change).toFixed(1);
	return `${prefix}${value}${unit} ${t(periodKey)}`;
};

const getRevenueIcon = (change: number) => {
	return change >= 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line';
};

const setTimePeriod = (period: string) => {
	selectedPeriod.value = period;
	showTimePeriodDropdown.value = false;
	loadAnalyticsData();
};

const toggleTimePeriodDropdown = () => {
	showTimePeriodDropdown.value = !showTimePeriodDropdown.value;
};

const setActiveTab = (tab: string) => {
	activeTab.value = tab;
};

const toggleOrderHourView = () => {
	orderHourView.value = orderHourView.value === 'day' ? 'week' : 'day';
};

const toggleTopItemsView = () => {
	topItemsView.value = topItemsView.value === 'revenue' ? 'orders' : 'revenue';
};

const viewItemDetails = (item: any) => {
	console.log('View item details:', item);
	// Navigate to item details or open modal
};

const exportAnalytics = () => {
	console.log('Exporting analytics...');
	// Implement export logic
};

const loadAnalyticsData = async () => {
	try {
		loading.value = true;
	} catch (error) {
		console.error('Failed to load analytics data:', error);
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	loadAnalyticsData();
});

// Keyboard shortcuts
const handleEscape = (e: KeyboardEvent) => {
	if (e.key === 'Escape' && showTimePeriodDropdown.value) {
		showTimePeriodDropdown.value = false;
	}
};

onMounted(() => {
	window.addEventListener('keydown', handleEscape);
	return () => {
		window.removeEventListener('keydown', handleEscape);
	};
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

/* Custom scrollbar for tabs */
.overflow-x-auto::-webkit-scrollbar {
	height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.05);
	border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
	background: rgba(139, 52, 224, 0.3);
	border-radius: 4px;
}

.dark .overflow-x-auto::-webkit-scrollbar-track {
	background: rgba(255, 255, 255, 0.05);
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
	background: rgba(168, 85, 247, 0.4);
}
</style>