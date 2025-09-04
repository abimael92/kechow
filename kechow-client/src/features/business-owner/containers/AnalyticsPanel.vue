<template>
	<div class="space-y-8">
		<div class="flex justify-between items-center">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Analytics</h1>
				<p class="text-gray-600 mt-1">
					Track your restaurant's performance and insights
				</p>
			</div>
			<div class="flex space-x-3">
				<button
					class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
				>
					<i
						class="ri-download-line mr-2 w-4 h-4 flex items-center justify-center inline"
					></i
					>Export
				</button>
				<button
					class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
				>
					Last 30 days<i
						class="ri-arrow-down-s-line ml-2 w-4 h-4 flex items-center justify-center inline"
					></i>
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<AnalyticsCard
				title="Total Revenue"
				value="$19,247"
				change="+15.3% from last month"
				icon="ri-money-dollar-circle-line"
				:positive="true"
			/>

			<AnalyticsCard
				title="Total Orders"
				value="1,834"
				change="+12.1% from last month"
				icon="ri-file-list-line"
				:positive="true"
			/>

			<AnalyticsCard
				title="Avg Order Value"
				value="$28.50"
				change="+8.2% from last month"
				icon="ri-shopping-cart-line"
				:positive="true"
			/>

			<AnalyticsCard
				title="Customer Rating"
				value="4.8"
				change="+0.3 from last month"
				icon="ri-star-line"
				:positive="true"
			/>
		</div>

		<div class="border-b border-gray-200">
			<div class="flex space-x-8">
				<button
					class="py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer border-orange-600 text-orange-600"
				>
					Overview
				</button>
				<button
					class="py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer border-transparent text-gray-500 hover:text-gray-700"
				>
					Revenue
				</button>
				<button
					class="py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer border-transparent text-gray-500 hover:text-gray-700"
				>
					Products
				</button>
				<button
					class="py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer border-transparent text-gray-500 hover:text-gray-700"
				>
					Customers
				</button>
			</div>
		</div>

		<div class="grid lg:grid-cols-2 gap-8">
			<!-- Revenue Trend Chart -->
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
				<h3 class="text-xl font-bold text-gray-900 mb-6">Revenue Trend</h3>
				<div
					class="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg"
				>
					<div class="text-center text-gray-500">
						<i class="ri-line-chart-line text-3xl mb-2"></i>
						<p>Revenue chart will be displayed here</p>
					</div>
				</div>
			</div>

			<!-- Orders by Hour Chart -->
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
				<h3 class="text-xl font-bold text-gray-900 mb-6">Orders by Hour</h3>
				<div
					class="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg"
				>
					<div class="text-center text-gray-500">
						<i class="ri-bar-chart-line text-3xl mb-2"></i>
						<p>Orders by hour chart will be displayed here</p>
					</div>
				</div>
			</div>

			<!-- Sales by Category Chart -->
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
				<h3 class="text-xl font-bold text-gray-900 mb-6">Sales by Category</h3>
				<div
					class="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg"
				>
					<div class="text-center text-gray-500">
						<i class="ri-pie-chart-line text-3xl mb-2"></i>
						<p>Sales by category chart will be displayed here</p>
					</div>
				</div>
			</div>

			<!-- Top Selling Items -->
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
				<h3 class="text-xl font-bold text-gray-900 mb-6">Top Selling Items</h3>
				<div class="space-y-4">
					<TopSellingItem
						rank="1"
						name="Margherita Pizza"
						orders="142"
						revenue="$2130"
					/>
					<TopSellingItem
						rank="2"
						name="Chicken Alfredo"
						orders="98"
						revenue="$1666"
					/>
					<TopSellingItem
						rank="3"
						name="Caesar Salad"
						orders="87"
						revenue="$869"
					/>
					<TopSellingItem
						rank="4"
						name="Pepperoni Pizza"
						orders="76"
						revenue="$1291"
					/>
					<TopSellingItem rank="5" name="Tiramisu" orders="65" revenue="$454" />
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
