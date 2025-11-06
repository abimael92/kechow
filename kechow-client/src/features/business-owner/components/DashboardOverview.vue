<template>
	<div class="space-y-6 lg:space-y-8">
		<!-- Header -->
		<div
			class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
		>
			<div>
				<h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
					{{ t('dashboard') }}
				</h1>
				<p class="text-black font-thin text-lg mt-1">
					{{ t('subtitle') }}
				</p>
			</div>
			<button
				class="bg-orange-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors cursor-pointer text-sm sm:text-base"
			>
				{{ t('addMenuItem') }}
			</button>
		</div>

		<!-- Stats Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
			<div
				v-for="(stat, i) in stats"
				:key="i"
				class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-white text-xs sm:text-sm">{{ stat.label }}</p>
						<p class="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
							{{ stat.value }}
						</p>
						<p class="text-xs sm:text-sm mt-1 text-green-600">
							{{ stat.change }}
						</p>
					</div>
					<div
						:class="stat.bg"
						class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
					>
						<i :class="stat.icon" class="text-xl sm:text-2xl"></i>
					</div>
				</div>
			</div>
		</div>

		<!-- Tabs -->
		<div class="border-b border-gray-200 overflow-x-auto">
			<div class="flex space-x-6 min-w-max">
				<button
					v-for="(tab, i) in tabs"
					:key="i"
					:class="[
						'py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer',
						tab.active
							? 'border-orange-600 text-orange-600'
							: 'border-transparent text-gray-500 hover:text-gray-700',
					]"
				>
					{{ tab.label }}
				</button>
			</div>
		</div>

		<!-- Content Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
			<div
				class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6"
			>
				<h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
					{{ t('recentOrders') }}
				</h3>
				<!-- Orders content -->
			</div>

			<div
				class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6"
			>
				<h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
					{{ t('weeklyRevenue') }}
				</h3>
				<div
					class="w-full h-40 sm:h-48 flex items-center justify-center bg-gray-50 rounded-lg"
				>
					<div class="text-center text-gray-500">
						<i class="ri-bar-chart-line text-2xl sm:text-3xl mb-2"></i>
						<p class="text-sm sm:text-base">
							{{ t('revenueChartPlaceholder') }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useAuthStore } from '@/app/store/auth/auth.store';
import { useI18n } from 'vue-i18n';

const authStore = useAuthStore();
const { t } = useI18n();

// Reactive stats with translations
const stats = computed(() => [
	{
		label: t('todaysOrders'),
		value: '24',
		change: `+12% ${t('fromYesterday')}`,
		bg: 'bg-blue-100 text-blue-600',
		icon: 'ri-file-list-line',
	},
	{
		label: t('revenue'),
		value: '$1,247',
		change: `+8% ${t('fromYesterday')}`,
		bg: 'bg-green-100 text-green-600',
		icon: 'ri-money-dollar-circle-line',
	},
	{
		label: t('avgOrder'),
		value: '$28.50',
		change: `+3% ${t('fromYesterday')}`,
		bg: 'bg-orange-100 text-orange-600',
		icon: 'ri-shopping-cart-line',
	},
	{
		label: t('rating'),
		value: '4.8',
		change: `+0.2 ${t('fromYesterday')}`,
		bg: 'bg-purple-100 text-purple-600',
		icon: 'ri-star-line',
	},
]);

// Reactive tabs with translations
const tabs = computed(() => [
	{ label: t('tabs.overview'), active: true },
	{ label: t('tabs.activeOrders'), active: false },
	{ label: t('tabs.menuManagement'), active: false },
	{ label: t('tabs.analytics'), active: false },
]);

onMounted(() => {
	console.log('Dashboard mounted - auth state:', {
		isAuthenticated: authStore.isAuthenticated,
		user: authStore.user,
	});
});
</script>
