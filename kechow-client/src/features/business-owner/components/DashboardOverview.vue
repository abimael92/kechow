<template>
    <div class="min-h-screen p-4 lg:p-8 space-y-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-3">
                <div class="w-16 h-16 rounded-3xl bg-gradient-to-r from-secondary-600 to-secondary-500 flex items-center justify-center shadow-md shadow-primary-500/30">
                    <i class="ri-home-3-line text-white text-3xl"></i>
                </div>
                <div>
                    <h1 class="text-bubble text-6xl shadow-primary-500">
                    {{ t('dashboard') }}
					</h1>
                    <p class="text-neutral-950 dark:text-neutral-200 font-normal text-xl select-none">
                    {{ t('subtitle') }}
                    </p>
                </div>
            </div>
        </div>

		<!-- Stats Grid - Enhanced with Gradient Backgrounds -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
			<div
				v-for="(stat, i) in stats"
				:key="i"
				class="group relative bg-white dark:bg-neutral-900 p-4 sm:p-6 rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-800 hover:shadow-medium transition-all duration-300 cursor-pointer overflow-hidden"
			>
				<!-- Animated Background Gradient -->
				<div class="absolute inset-0 bg-gradient-to-br from-transparent to-primary-50 dark:to-primary-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

				<div class="relative flex items-center justify-between">
					<div>
						<p class="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm font-medium">
							{{ stat.label }}
						</p>
						<p class="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mt-1">
							{{ stat.value }}
						</p>
						<p class="flex items-center gap-1 text-xs sm:text-sm mt-1 font-medium"
						:class="stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
							<i :class="stat.trend === 'up' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"></i>
							{{ stat.change }}
						</p>
					</div>
					<div
						:class="stat.bg"
						class="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
					>
						<div class="absolute inset-0 bg-white/20 rounded-xl"></div>
						<i :class="[stat.icon, 'text-lg sm:text-xl relative z-10']"></i>
					</div>
				</div>
			</div>
		</div>

		<!-- Enhanced Tabs with Active Indicator -->
		<div class="mb-6 lg:mb-8">
			<div class="relative">
				<div class="border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto">
					<div class="flex space-x-1 min-w-max">
						<button
							v-for="(tab, i) in tabs"
							:key="i"
							@click="setActiveTab(i)"
							:class="[
								'relative px-4 py-3 font-medium text-sm whitespace-nowrap transition-all duration-200 cursor-pointer',
								tab.active
									? 'text-primary-700 dark:text-primary-400'
									: 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200',
							]"
						>
							{{ tab.label }}
							<!-- Active Indicator -->
							<div
								v-if="tab.active"
								class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
							></div>
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Content Grid - Enhanced Cards -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
			<!-- Recent Orders Card -->
			<div class="group bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-800 hover:shadow-medium transition-all duration-300 overflow-hidden">
				<div class="p-4 sm:p-6">
					<div class="flex items-center justify-between mb-4 sm:mb-6">
						<h3 class="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
							{{ t('recentOrders') }}
						</h3>
						<button class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1 cursor-pointer">
							{{ t('viewAll') }}
							<i class="ri-arrow-right-line"></i>
						</button>
					</div>
					
					<!-- Orders List -->
					<div class="space-y-3">
						<div v-for="order in recentOrders" :key="order.id"
						     class="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200">
							<div class="flex items-center gap-3">
								<div :class="order.statusClass"
								     class="w-2 h-2 rounded-full"></div>
								<div>
									<p class="font-medium text-neutral-900 dark:text-white">
										Order #{{ order.id }}
									</p>
									<p class="text-xs text-neutral-600 dark:text-neutral-400">
										{{ order.time }} • {{ order.items }} items
									</p>
								</div>
							</div>
							<div class="text-right">
								<p class="font-semibold text-neutral-900 dark:text-white">
									{{ order.amount }}
								</p>
								<p :class="order.statusTextClass"
								   class="text-xs font-medium">
									{{ order.status }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Weekly Revenue Card -->
			<div class="group bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-800 hover:shadow-medium transition-all duration-300 overflow-hidden">
				<div class="p-4 sm:p-6">
					<div class="flex items-center justify-between mb-4 sm:mb-6">
						<h3 class="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
							{{ t('weeklyRevenue') }}
						</h3>
						<div class="flex items-center gap-2">
							<button @click="setRevenuePeriod('week')" 
							        :class="revenuePeriod === 'week' ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'"
							        class="px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer">
								Week
							</button>
							<button @click="setRevenuePeriod('month')"
							        :class="revenuePeriod === 'month' ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'"
							        class="px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer">
								Month
							</button>
						</div>
					</div>
					
					<!-- Revenue Chart Placeholder -->
					<div class="relative w-full h-40 sm:h-48 flex items-center justify-center bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-900/20 dark:to-transparent rounded-xl border border-neutral-100 dark:border-neutral-800">
						<div class="text-center">
							<div class="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
								<i class="ri-bar-chart-line text-2xl sm:text-3xl text-primary-600 dark:text-primary-400"></i>
							</div>
							<p class="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base font-medium">
								{{ t('revenueChartPlaceholder') }}
							</p>
							<p class="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
								{{ revenueData.total }}
							</p>
						</div>
						
						<!-- Mock Data Points -->
						<div class="absolute bottom-4 left-4 right-4 flex items-end justify-between h-12">
							<div v-for="(day, index) in revenueData.days" :key="index"
							     class="flex-1 flex flex-col items-center">
								<div :style="{ height: `${day.value}%` }"
								     class="w-3 rounded-t-lg bg-gradient-to-t from-primary-500 to-primary-400 transition-all duration-500 hover:from-secondary-500 hover:to-secondary-400"></div>
								<p class="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
									{{ day.label }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Actions Bar -->
		<div class="mt-8">
			<div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
				<h3 class="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-4">
					{{ t('quickActions') }}
				</h3>
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
					<button v-for="action in quickActions" :key="action.id"
					        class="group flex flex-col items-center justify-center p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 cursor-pointer">
						<div :class="action.bg"
						     class="w-10 h-10 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
							<i :class="[action.icon, 'text-lg']"></i>
						</div>
						<p class="text-sm font-medium text-neutral-900 dark:text-white text-center">
							{{ action.label }}
						</p>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/app/store/auth/auth.store';
import { useI18n } from 'vue-i18n';


const authStore = useAuthStore();
const { t } = useI18n();
const activeTabIndex = ref(0);
const revenuePeriod = ref('week');

// Set active tab
const setActiveTab = (index: number) => {
	activeTabIndex.value = index;
};

// Set revenue period
const setRevenuePeriod = (period: string) => {
	revenuePeriod.value = period;
};

// Reactive stats with translations
const stats = computed(() => [
	{
		label: t('todaysOrders'),
		value: '24',
		change: `+12% ${t('fromYesterday')}`,
		trend: 'up',
		bg: 'bg-gradient-to-br from-blue-500 to-blue-400',
		icon: 'ri-file-list-line text-white',
	},
	{
		label: t('revenue'),
		value: '$1,247',
		change: `+8% ${t('fromYesterday')}`,
		trend: 'up',
		bg: 'bg-gradient-to-br from-green-500 to-green-400',
		icon: 'ri-money-dollar-circle-line text-white',
	},
	{
		label: t('avgOrder'),
		value: '$28.50',
		change: `+3% ${t('fromYesterday')}`,
		trend: 'up',
		bg: 'bg-gradient-to-br from-secondary-500 to-secondary-400',
		icon: 'ri-shopping-cart-line text-white',
	},
	{
		label: t('rating'),
		value: '4.8',
		change: `+0.2 ${t('fromYesterday')}`,
		trend: 'up',
		bg: 'bg-gradient-to-br from-purple-500 to-purple-400',
		icon: 'ri-star-line text-white',
	},
]);

// Reactive tabs with translations
const tabs = computed(() => [
	{ 
		label: t('tabs.overview'), 
		active: activeTabIndex.value === 0 
	},
	{ 
		label: t('tabs.activeOrders'), 
		active: activeTabIndex.value === 1 
	},
	{ 
		label: t('tabs.menuManagement'), 
		active: activeTabIndex.value === 2 
	},
	{ 
		label: t('tabs.analytics'), 
		active: activeTabIndex.value === 3 
	},
]);

// Recent orders data
const recentOrders = ref([
	{
		id: '1001',
		time: '10:30 AM',
		items: 3,
		amount: '$45.60',
		status: 'Preparing',
		statusClass: 'bg-warning',
		statusTextClass: 'text-warning'
	},
	{
		id: '1002',
		time: '11:15 AM',
		items: 2,
		amount: '$28.90',
		status: 'Delivered',
		statusClass: 'bg-success',
		statusTextClass: 'text-success'
	},
	{
		id: '1003',
		time: '12:45 PM',
		items: 4,
		amount: '$67.80',
		status: 'On the way',
		statusClass: 'bg-delivery-ontheway',
		statusTextClass: 'text-delivery-ontheway'
	},
	{
		id: '1004',
		time: '1:20 PM',
		items: 1,
		amount: '$12.50',
		status: 'Pending',
		statusClass: 'bg-delivery-pending',
		statusTextClass: 'text-delivery-pending'
	}
]);

// Revenue data
const revenueData = computed(() => ({
	total: revenuePeriod.value === 'week' ? '$3,845.60' : '$14,892.30',
	days: revenuePeriod.value === 'week' ? [
		{ label: 'Mon', value: 60 },
		{ label: 'Tue', value: 85 },
		{ label: 'Wed', value: 45 },
		{ label: 'Thu', value: 90 },
		{ label: 'Fri', value: 65 },
		{ label: 'Sat', value: 100 },
		{ label: 'Sun', value: 75 }
	] : [
		{ label: 'Week 1', value: 70 },
		{ label: 'Week 2', value: 85 },
		{ label: 'Week 3', value: 60 },
		{ label: 'Week 4', value: 95 }
	]
}));

// Quick actions
const quickActions = ref([
	{
		id: 1,
		label: t('addItem'),
		icon: 'ri-add-circle-line text-primary-600 dark:text-primary-400',
		bg: 'bg-primary-100 dark:bg-primary-900'
	},
	{
		id: 2,
		label: t('manageMenu'),
		icon: 'ri-restaurant-line text-green-600 dark:text-green-400',
		bg: 'bg-green-100 dark:bg-green-900'
	},
	{
		id: 3,
		label: t('viewReports'),
		icon: 'ri-bar-chart-2-line text-purple-600 dark:text-purple-400',
		bg: 'bg-purple-100 dark:bg-purple-900'
	},
	{
		id: 4,
		label: t('staffManagement'),
		icon: 'ri-group-line text-secondary-600 dark:text-secondary-400',
		bg: 'bg-secondary-100 dark:bg-secondary-900'
	}
]);

onMounted(() => {
	console.log('Dashboard mounted - auth state:', {
		isAuthenticated: authStore.isAuthenticated,
		user: authStore.user,
	});
});
</script>