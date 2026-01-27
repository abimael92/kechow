<template>
	<div class="space-y-4 sm:space-y-6 md:space-y-8">
		<!-- Header Section -->
		<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-3 sm:gap-4">
			<div class="flex items-center gap-2 sm:gap-3 md:gap-4">
				<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-secondary-600 to-secondary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
					<i class="ri-line-chart-line text-white text-lg sm:text-xl md:text-2xl"></i>
				</div>
				<div class="flex-1 min-w-0">
					<h1 class="text-bubble text-3xl sm:text-4xl md:text-5xl lg:text-6xl shadow-primary-500 leading-tight sm:leading-snug">
						{{ $t('analytics') }}
					</h1>
					<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none truncate">
						{{ $t('trackPerformance') }}
						<span v-if="analyticsData" class="ml-1 sm:ml-2 text-tertiary-800 dark:text-tertiary-400 font-medium whitespace-nowrap">
							{{ $t('lastUpdated') }}: {{ formatTime(analyticsData.lastUpdated) }}
						</span>
					</p>
				</div>
			</div>

			<div class="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mt-2 md:mt-0">
				<!-- Time Period Selector -->
				<div class="relative flex-1 md:flex-none min-w-[140px]">
					<button
						@click="toggleTimePeriodDropdown"
						class="w-full bg-gradient-to-r from-tertiary-600 to-tertiary-500 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-between gap-1 sm:gap-2 text-sm sm:text-base"
					>
						<div class="flex items-center gap-1 sm:gap-2">
							<i class="ri-calendar-line text-sm sm:text-base"></i>
							<span class="truncate">
								{{ $t(timePeriodOptions.find(p => p.value === selectedPeriod)?.label || 'last30Days') }}
							</span>
						</div>
						<i class="ri-arrow-down-s-line text-xs sm:text-sm transition-transform duration-200" :class="{ 'rotate-180': showTimePeriodDropdown }"></i>
					</button>
					
					<transition name="fade">
						<div 
							v-if="showTimePeriodDropdown" 
							class="absolute top-full left-0 right-0 md:right-auto md:left-0 mt-2 w-full md:w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl shadow-lg z-50 overflow-hidden"
						>
							<div class="py-1 sm:py-2">
								<button
									v-for="period in timePeriodOptions"
									:key="period.value"
									@click="setTimePeriod(period.value)"
									:class="[
										'w-full px-3 py-2 sm:px-4 sm:py-2.5 text-left text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-between',
										selectedPeriod === period.value
											? 'bg-tertiary-300 dark:bg-tertiary-900/30 text-neutral-800 dark:text-neutral-200'
											: 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
									]"
								>
									<span>{{ $t(period.label) }}</span>
									<i v-if="selectedPeriod === period.value" class="ri-check-line text-sm"></i>
								</button>
							</div>
						</div>
					</transition>
				</div>
				
				<!-- Export Button -->
				<button
					@click="exportAnalytics"
					class="flex-1 md:flex-none min-w-[100px] bg-gradient-to-r from-tertiary-600 to-tertiary-500 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
				>
					<i class="ri-download-line text-sm sm:text-base"></i>
					<span class="hidden xs:inline">{{ $t('export') }}</span>
				</button>

				<!-- Refresh Button -->
				<button
					@click="loadAnalyticsData"
					:disabled="loading"
					class="flex-1 md:flex-none min-w-[100px] bg-gradient-to-r from-primary-600 to-primary-500 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<i 
						class="ri-refresh-line text-sm sm:text-base sm:text-lg transition-transform duration-500" 
						:class="{ 'animate-spin': loading }"
					></i>
					<span class="hidden xs:inline">{{ loading ? $t('refreshing') : $t('refresh') }}</span>
				</button>
			</div>
		</div>

		<!-- Analytics Summary Cards -->
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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

		<!-- Analytics Tabs - Responsive -->
		<div class="border-b border-gray-200 dark:border-gray-700">
			<div class="flex overflow-x-auto -mx-2 sm:mx-0 pb-1">
				<div class="flex gap-1 sm:gap-2 md:gap-8 px-2 sm:px-0 min-w-max">
					<button
						v-for="tab in analyticsTabs"
						:key="tab.id"
						@click="setActiveTab(tab.id)"
						:class="[
							'py-3 px-2 sm:py-4 border-b-2 font-medium text-xs sm:text-sm cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1 sm:gap-2',
							activeTab === tab.id
								? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
								: 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
						]"
					>
						<i :class="tab.icon" class="text-sm sm:text-base"></i>
						<span>{{ $t(tab.label) }}</span>
						<span v-if="tab.badge" class="ml-1 px-1.5 py-0.5 bg-primary-300 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded-full">
							{{ tab.badge }}
						</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Main Content Area -->
		<div class="space-y-4 sm:space-y-6 md:space-y-8">
			<!-- Overview Dashboard -->
			<template v-if="activeTab === 'overview'">
				<div class="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
					<!-- Revenue Trend Chart -->
					<div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6">
						<div class="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 mb-3 sm:mb-4 md:mb-6">
							<h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
								{{ $t('revenueTrend') }}
							</h3>
							<div class="flex gap-1 sm:gap-2">
								<button
									v-for="chartType in revenueChartTypes"
									:key="chartType"
									@click="revenueChartType = chartType as 'line' | 'bar' | 'area'"
									:class="[
										'px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap',
										revenueChartType === chartType
											? 'bg-primary-300 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
											: 'text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
									]"
								>
									{{ $t(chartType) }}
								</button>
							</div>
						</div>
						<div class="w-full h-48 sm:h-56 md:h-64">
							<!-- Revenue Chart Component -->
							<div v-if="loading" class="w-full h-full flex items-center justify-center">
								<div class="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary-600"></div>
							</div>
							<RevenueChart 
								v-else-if="analyticsData?.revenue.chartData"
								:data="analyticsData.revenue.chartData"
								:type="revenueChartType"
								class="h-48 sm:h-56 md:h-64"
							/>
							<div v-else class="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg text-center text-gray-500 dark:text-gray-400 p-4">
								<i class="ri-line-chart-line text-xl sm:text-2xl md:text-3xl mb-2"></i>
								<p class="text-xs sm:text-sm">{{ $t('revenueChartPlaceholder') }}</p>
							</div>
						</div>
					</div>

					<!-- Orders by Hour Chart -->
					<div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6">
						<div class="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 mb-3 sm:mb-4 md:mb-6">
							<h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
								{{ $t('ordersByHour') }}
							</h3>
							<button
								@click="toggleOrderHourView"
								class="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-blue-500 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors whitespace-nowrap self-end xs:self-auto"
							>
								{{ $t(orderHourView === 'day' ? 'viewByWeek' : 'viewByDay') }}
							</button>
						</div>
						<div class="w-full h-48 sm:h-56 md:h-64">
							<div v-if="loading" class="w-full h-full flex items-center justify-center">
								<div class="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary-600"></div>
							</div>
							<OrdersByHourChart 
								v-else-if="(analyticsData as any)?.ordersByHour"
								:data="(analyticsData as any).ordersByHour"
								:view="orderHourView"
								class="h-48 sm:h-56 md:h-64"
							/>
							<div v-else class="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg text-center text-gray-500 dark:text-gray-400 p-4">
								<i class="ri-bar-chart-line text-xl sm:text-2xl md:text-3xl mb-2"></i>
								<p class="text-xs sm:text-sm">{{ $t('ordersByHourPlaceholder') }}</p>
							</div>
						</div>
					</div>

					<!-- Sales by Category -->
					<div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6">
						<h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6">
							{{ $t('salesByCategory') }}
						</h3>
						<div class="w-full h-48 sm:h-56 md:h-64">
							<div v-if="loading" class="w-full h-full flex items-center justify-center">
								<div class="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary-600"></div>
							</div>
							<SalesByCategoryChart 
								v-else-if="(analyticsData as any)?.salesByCategory"
								:data="(analyticsData as any).salesByCategory"
								class="h-48 sm:h-56 md:h-64"
							/>
							<div v-else class="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg text-center text-gray-500 dark:text-gray-400 p-4">
								<i class="ri-pie-chart-line text-xl sm:text-2xl md:text-3xl mb-2"></i>
								<p class="text-xs sm:text-sm">{{ $t('salesByCategoryPlaceholder') }}</p>
							</div>
						</div>
					</div>

					<!-- Top Selling Items -->
					<div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6">
						<div class="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 mb-3 sm:mb-4 md:mb-6">
							<h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
								{{ $t('topSellingItems') }}
							</h3>
							<button
								@click="toggleTopItemsView"
								class="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-blue-500 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors whitespace-nowrap self-end xs:self-auto"
							>
								{{ $t(topItemsView === 'revenue' ? 'viewByOrders' : 'viewByRevenue') }}
							</button>
						</div>
						<div class="space-y-2 sm:space-y-3 md:space-y-4">
							<template v-if="loading">
								<div v-for="n in 5" :key="n" class="flex items-center justify-between p-2 sm:p-3 animate-pulse">
									<div class="flex items-center gap-2 sm:gap-3">
										<div class="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
										<div class="space-y-1 sm:space-y-2">
											<div class="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 sm:w-32"></div>
											<div class="h-2 sm:h-3 bg-gray-200 dark:bg-gray-600 rounded w-16 sm:w-24"></div>
										</div>
									</div>
									<div class="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-10 sm:w-16"></div>
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
									class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors p-2 sm:p-3"
								/>
							</template>
							<div v-else class="text-center py-4 sm:py-6 md:py-8 text-gray-500 dark:text-gray-400">
								<i class="ri-information-line text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2"></i>
								<p class="text-xs sm:text-sm">{{ $t('noTopItemsData') }}</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Performance Insights -->
				<div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6">
					<h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6">
						{{ $t('performanceInsights') }}
					</h3>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
						<div 
							v-for="insight in performanceInsights"
							:key="insight.id"
							class="p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
							:class="{ 'bg-primary-50 dark:bg-primary-900/10': insight.highlight }"
						>
							<div class="flex items-start gap-2 sm:gap-3">
								<div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="insight.bgColor">
									<i :class="insight.icon" class="text-sm sm:text-lg" :style="{ color: insight.color }"></i>
								</div>
								<div class="flex-1 min-w-0">
									<h4 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{{ $t(insight.title) }}</h4>
									<p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{{ insight.description }}</p>
									<div v-if="insight.metric" class="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
										<span class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">{{ insight.metric }}</span>
										<span class="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full whitespace-nowrap" :class="insight.trend > 0 ? 'bg-emerald-300 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-200 dark:bg-red-900/30 text-red-600 dark:text-red-400'">
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
			<div v-else class="text-center py-8 sm:py-10 md:py-12">
				<div class="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 md:mb-6 text-gray-300 dark:text-gray-600">
					<i :class="activeTabIcon" class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl"></i>
				</div>
				<h3 class="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
					{{ $t('comingSoon') }}
				</h3>
				<p class="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-md mx-auto px-4">
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
		bgColor: 'bg-blue-300 dark:bg-blue-900/30',
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
		bgColor: 'bg-emerald-300 dark:bg-emerald-900/30',
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
		bgColor: 'bg-purple-300 dark:bg-purple-900/30',
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
};

const exportAnalytics = () => {
	console.log('Exporting analytics...');
};

const loadAnalyticsData = async () => {
	try {
		loading.value = true;
		analyticsData.value = await getAnalyticsData({
			period: selectedPeriod.value as any,
		});
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
/* Responsive text bubble */
.text-bubble {
	font-size: clamp(2rem, 5vw, 3.5rem);
}

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
	height: 3px;
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

/* Smooth transitions */
button, div {
	transition: all 0.2s ease;
}

/* Hover effects */
button:hover {
	transform: translateY(-1px);
}

/* Touch-friendly targets on mobile */
@media (max-width: 640px) {
	button {
		min-height: 44px;
		min-width: 44px;
	}
}

/* Loading animation */
@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.animate-spin {
	animation: spin 1s linear infinite;
}

@keyframes pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.5; }
}

.animate-pulse {
	animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Responsive spacing */
@media (max-width: 640px) {
	.space-y-4 > * + * {
		margin-top: 1rem;
	}
}

@media (min-width: 641px) and (max-width: 1024px) {
	.space-y-6 > * + * {
		margin-top: 1.5rem;
	}
}

/* Hide scrollbar but allow scrolling */
.overflow-x-auto {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.overflow-x-auto::-webkit-scrollbar {
	display: none;
}

/* Accessibility focus styles */
button:focus-visible {
	outline: 2px solid #3b82f6;
	outline-offset: 2px;
}
</style>