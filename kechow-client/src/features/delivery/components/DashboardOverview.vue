<template>
	<div class="space-y-8">
		<div class="flex justify-between items-center">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
				<p class="text-gray-600 mt-1">
					Welcome back! Here's what's happening at your restaurant.
				</p>
			</div>
			<button
				class="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
			>
				+ Add Menu Item
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm">Today's Orders</p>
						<p class="text-3xl font-bold text-gray-900 mt-1">24</p>
						<p class="text-sm mt-1 text-green-600">+12% from yesterday</p>
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
						<p class="text-gray-600 text-sm">Revenue</p>
						<p class="text-3xl font-bold text-gray-900 mt-1">$1,247</p>
						<p class="text-sm mt-1 text-green-600">+8% from yesterday</p>
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
						<p class="text-gray-600 text-sm">Avg. Order</p>
						<p class="text-3xl font-bold text-gray-900 mt-1">$28.50</p>
						<p class="text-sm mt-1 text-green-600">+3% from yesterday</p>
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
						<p class="text-gray-600 text-sm">Rating</p>
						<p class="text-3xl font-bold text-gray-900 mt-1">4.8</p>
						<p class="text-sm mt-1 text-green-600">+0.2 from yesterday</p>
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
					Overview
				</button>
				<button
					class="py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer border-transparent text-gray-500 hover:text-gray-700"
				>
					Active Orders
				</button>
				<button
					class="py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer border-transparent text-gray-500 hover:text-gray-700"
				>
					Menu Management
				</button>
				<button
					class="py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer border-transparent text-gray-500 hover:text-gray-700"
				>
					Analytics
				</button>
			</div>
		</div>

		<div class="grid lg:grid-cols-2 gap-8">
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
				<h3 class="text-xl font-bold text-gray-900 mb-6">Recent Orders</h3>
				<div class="space-y-4">
					<div
						class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
					>
						<div class="flex items-start justify-between mb-3">
							<div>
								<h4 class="font-semibold text-gray-900">#12345</h4>
								<p class="text-sm text-gray-600">John Doe</p>
								<p class="text-xs text-gray-500">15 mins ago</p>
							</div>
							<div class="flex items-center space-x-2">
								<span
									class="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
								>
									<i
										class="ri-time-line mr-1 w-3 h-3 flex items-center justify-center inline"
									></i
									>Preparing
								</span>
							</div>
						</div>
						<div class="mb-3">
							<p class="text-sm text-gray-700 mb-1">Items:</p>
							<p class="text-sm text-gray-600">
								Margherita Pizza, Caesar Salad
							</p>
						</div>
						<div class="flex items-center justify-between">
							<span class="font-bold text-lg text-gray-900">$24.98</span>
							<div class="flex space-x-2">
								<button
									class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
								>
									Mark Ready
								</button>
								<button
									class="text-gray-600 hover:text-gray-800 p-2 cursor-pointer"
								>
									<i
										class="ri-more-line w-4 h-4 flex items-center justify-center"
									></i>
								</button>
							</div>
						</div>
					</div>

					<div
						class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
					>
						<div class="flex items-start justify-between mb-3">
							<div>
								<h4 class="font-semibold text-gray-900">#12346</h4>
								<p class="text-sm text-gray-600">Jane Smith</p>
								<p class="text-xs text-gray-500">5 mins ago</p>
							</div>
							<div class="flex items-center space-x-2">
								<span
									class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
								>
									<i
										class="ri-check-line mr-1 w-3 h-3 flex items-center justify-center inline"
									></i
									>Ready
								</span>
							</div>
						</div>
						<div class="mb-3">
							<p class="text-sm text-gray-700 mb-1">Items:</p>
							<p class="text-sm text-gray-600">Pepperoni Pizza, Garlic Bread</p>
						</div>
						<div class="flex items-center justify-between">
							<span class="font-bold text-lg text-gray-900">$19.99</span>
							<div class="flex space-x-2">
								<button
									class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
								>
									Out for Delivery
								</button>
								<button
									class="text-gray-600 hover:text-gray-800 p-2 cursor-pointer"
								>
									<i
										class="ri-more-line w-4 h-4 flex items-center justify-center"
									></i>
								</button>
							</div>
						</div>
					</div>

					<div
						class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
					>
						<div class="flex items-start justify-between mb-3">
							<div>
								<h4 class="font-semibold text-gray-900">#12347</h4>
								<p class="text-sm text-gray-600">Mike Johnson</p>
								<p class="text-xs text-gray-500">Just now</p>
							</div>
							<div class="flex items-center space-x-2">
								<span
									class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
								>
									<i
										class="ri-file-add-line mr-1 w-3 h-3 flex items-center justify-center inline"
									></i
									>New
								</span>
							</div>
						</div>
						<div class="mb-3">
							<p class="text-sm text-gray-700 mb-1">Items:</p>
							<p class="text-sm text-gray-600">Chicken Alfredo, Tiramisu</p>
						</div>
						<div class="flex items-center justify-between">
							<span class="font-bold text-lg text-gray-900">$28.50</span>
							<div class="flex space-x-2">
								<button
									class="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
								>
									Accept
								</button>
								<button
									class="text-gray-600 hover:text-gray-800 p-2 cursor-pointer"
								>
									<i
										class="ri-more-line w-4 h-4 flex items-center justify-center"
									></i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
				<h3 class="text-xl font-bold text-gray-900 mb-6">Weekly Revenue</h3>
				<div
					class="w-full h-48 flex items-center justify-center bg-gray-50 rounded-lg"
				>
					<div class="text-center text-gray-500">
						<i class="ri-bar-chart-line text-3xl mb-2"></i>
						<p>Revenue chart will be displayed here</p>
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
