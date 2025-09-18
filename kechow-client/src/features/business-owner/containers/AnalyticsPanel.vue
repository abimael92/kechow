<template>
	<div class="space-y-8">
		<div class="flex justify-between items-center">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">{{ $t('analytics') }}</h1>
				<p class="text-gray-600 mt-1">{{ $t('trackPerformance') }}</p>
			</div>
			<div class="flex space-x-3">
				<button
					class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
				>
					<i class="ri-download-line mr-2"></i>{{ $t('export') }}
				</button>
				<button
					class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
				>
					{{ $t('last30Days') }}<i class="ri-arrow-down-s-line ml-2"></i>
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<AnalyticsCard
				:title="$t('totalRevenue')"
				value="$19,247"
				:change="`+15.3% ${t('fromLastMonth')}`"
				icon="ri-money-dollar-circle-line"
				:positive="true"
			/>
			<AnalyticsCard
				:title="$t('totalOrders')"
				value="1,834"
				:change="`+12.1% ${t('fromLastMonth')}`"
				icon="ri-file-list-line"
				:positive="true"
			/>
			<AnalyticsCard
				:title="$t('avgOrderValue')"
				value="$28.50"
				:change="`+8.2% ${t('fromLastMonth')}`"
				icon="ri-shopping-cart-line"
				:positive="true"
			/>
			<AnalyticsCard
				:title="$t('customerRating')"
				value="4.8"
				:change="`+0.3 ${t('fromLastMonth')}`"
				icon="ri-star-line"
				:positive="true"
			/>
		</div>

		<div class="border-b border-gray-200">
			<div class="flex space-x-8">
				<button
					class="py-4 px-2 border-b-2 font-medium text-sm cursor-pointer border-orange-600 text-orange-600"
				>
					{{ $t('overview') }}
				</button>
				<button
					class="py-4 px-2 border-b-2 font-medium text-sm cursor-pointer border-transparent text-gray-500 hover:text-gray-700"
				>
					{{ $t('revenue') }}
				</button>
				<button
					class="py-4 px-2 border-b-2 font-medium text-sm cursor-pointer border-transparent text-gray-500 hover:text-gray-700"
				>
					{{ $t('products') }}
				</button>
				<button
					class="py-4 px-2 border-b-2 font-medium text-sm cursor-pointer border-transparent text-gray-500 hover:text-gray-700"
				>
					{{ $t('customers') }}
				</button>
			</div>
		</div>

		<div class="grid lg:grid-cols-2 gap-8">
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
				<h3 class="text-xl font-bold text-gray-900 mb-6">
					{{ $t('revenueTrend') }}
				</h3>
				<div
					class="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg text-center text-gray-500"
				>
					<i class="ri-line-chart-line text-3xl mb-2"></i>
					<p>{{ $t('revenueChartPlaceholder') }}</p>
				</div>
			</div>

			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
				<h3 class="text-xl font-bold text-gray-900 mb-6">
					{{ $t('ordersByHour') }}
				</h3>
				<div
					class="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg text-center text-gray-500"
				>
					<i class="ri-bar-chart-line text-3xl mb-2"></i>
					<p>{{ $t('ordersByHourPlaceholder') }}</p>
				</div>
			</div>

			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
				<h3 class="text-xl font-bold text-gray-900 mb-6">
					{{ $t('salesByCategory') }}
				</h3>
				<div
					class="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg text-center text-gray-500"
				>
					<i class="ri-pie-chart-line text-3xl mb-2"></i>
					<p>{{ $t('salesByCategoryPlaceholder') }}</p>
				</div>
			</div>

			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
				<h3 class="text-xl font-bold text-gray-900 mb-6">
					{{ $t('topSellingItems') }}
				</h3>
				<div class="space-y-4">
					<TopSellingItem
						rank="1"
						:name="$t('margheritaPizza')"
						orders="142"
						revenue="$2130"
					/>
					<TopSellingItem
						rank="2"
						:name="$t('chickenAlfredo')"
						orders="98"
						revenue="$1666"
					/>
					<TopSellingItem
						rank="3"
						:name="$t('caesarSalad')"
						orders="87"
						revenue="$869"
					/>
					<TopSellingItem
						rank="4"
						:name="$t('pepperoniPizza')"
						orders="76"
						revenue="$1291"
					/>
					<TopSellingItem
						rank="5"
						:name="$t('tiramisu')"
						orders="65"
						revenue="$454"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AnalyticsCard from '../components/AnalyticsCard.vue';
import TopSellingItem from '../components/TopSellingItem.vue';
import { getAnalyticsData } from '../services/businessOwner.service';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const loadAnalyticsData = async () => {
	try {
		const data = await getAnalyticsData();
		console.log('Analytics data:', data);
	} catch (error) {
		console.error('Failed to load analytics data:', error);
	}
};

onMounted(() => {
	loadAnalyticsData();
});
</script>
