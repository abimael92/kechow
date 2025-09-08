<template>
	<div class="space-y-8">
		<div class="flex justify-between items-center">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">
					{{ $t('dashboard') }}
				</h1>
				<p class="text-gray-600 mt-1">
					{{ $t('subtitle') }}
				</p>
			</div>
			<button
				class="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
			>
				{{ $t('addMenuItem') }}
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm">
							{{ $t('todaysOrders') }}
						</p>
						<p class="text-3xl font-bold text-gray-900 mt-1">24</p>
						<p class="text-sm mt-1 text-green-600">
							+12% {{ $t('fromYesterday') }}
						</p>
					</div>
					<div
						class="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100"
					>
						<i
							class="ri-file-list-line text-blue-600 text-xl w-6 h-6 flex items-center justify-center"
						></i>
					</div>
				</div>
			</div>

			<div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm">{{ $t('revenue') }}</p>
						<p class="text-3xl font-bold text-gray-900 mt-1">$1,247</p>
						<p class="text-sm mt-1 text-green-600">
							+8% {{ $t('fromYesterday') }}
						</p>
					</div>
					<div
						class="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100"
					>
						<i
							class="ri-money-dollar-circle-line text-green-600 text-xl w-6 h-6 flex items-center justify-center"
						></i>
					</div>
				</div>
			</div>

			<div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm">{{ $t('avgOrder') }}</p>
						<p class="text-3xl font-bold text-gray-900 mt-1">$28.50</p>
						<p class="text-sm mt-1 text-green-600">
							+3% {{ $t('fromYesterday') }}
						</p>
					</div>
					<div
						class="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100"
					>
						<i
							class="ri-shopping-cart-line text-orange-600 text-xl w-6 h-6 flex items-center justify-center"
						></i>
					</div>
				</div>
			</div>

			<div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm">{{ $t('rating') }}</p>
						<p class="text-3xl font-bold text-gray-900 mt-1">4.8</p>
						<p class="text-sm mt-1 text-green-600">
							+0.2 {{ $t('fromYesterday') }}
						</p>
					</div>
					<div
						class="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100"
					>
						<i
							class="ri-star-line text-purple-600 text-xl w-6 h-6 flex items-center justify-center"
						></i>
					</div>
				</div>
			</div>
		</div>

		<div class="border-b border-gray-200">
			<div class="flex space-x-8">
				<button
					class="py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer border-orange-600 text-orange-600"
				>
					{{ $t('tabs.overview') }}
				</button>
				<button
					class="py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer border-transparent text-gray-500 hover:text-gray-700"
				>
					{{ $t('tabs.activeOrders') }}
				</button>
				<button
					class="py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer border-transparent text-gray-500 hover:text-gray-700"
				>
					{{ $t('tabs.menuManagement') }}
				</button>
				<button
					class="py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer border-transparent text-gray-500 hover:text-gray-700"
				>
					{{ $t('tabs.analytics') }}
				</button>
			</div>
		</div>

		<div class="grid lg:grid-cols-2 gap-8">
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
				<h3 class="text-xl font-bold text-gray-900 mb-6">
					{{ $t('recentOrders') }}
				</h3>
				<!-- Orders content unchanged, can be localized later -->
			</div>

			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
				<h3 class="text-xl font-bold text-gray-900 mb-6">
					{{ $t('weeklyRevenue') }}
				</h3>
				<div
					class="w-full h-48 flex items-center justify-center bg-gray-50 rounded-lg"
				>
					<div class="text-center text-gray-500">
						<i class="ri-bar-chart-line text-3xl mb-2"></i>
						<p>{{ $t('revenueChartPlaceholder') }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/app/store/auth/auth.store';

const authStore = useAuthStore();

onMounted(() => {
	console.log('Dashboard mounted - auth state:', {
		isAuthenticated: authStore.isAuthenticated,
		user: authStore.user,
	});
});
</script>
