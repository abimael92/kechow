<template>
	<div class="p-6">
		<!-- Header -->
		<div>
			<div>
				<h1 class="text-2xl font-bold text-gray-900">{{ $t('orders') }}</h1>
				<p class="text-gray-600 mt-1">{{ $t('manageDeliveries') }}</p>
			</div>

			<!-- Tabs -->
			<div class="border-b border-gray-200">
				<div class="flex space-x-0">
					<button
						v-for="(tab, index) in tabs"
						:key="index"
						@click="activeTab = index"
						:class="[
							'py-4 px-6 border-b-2 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer',
							activeTab === index
								? 'border-blue-600 text-blue-600 bg-blue-50'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50',
						]"
					>
						{{ $t(tab.label) }} ({{ tab.count }})
					</button>
				</div>
			</div>

			<!-- Orders Summary -->
			<div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<i
							class="ri-notification-line text-blue-600 mr-3 w-5 h-5 flex items-center justify-center"
						></i>
						<div>
							<p class="font-medium text-blue-900">
								{{ $t(ordersSummary.title) }}
							</p>
							<p class="text-sm text-blue-700">
								{{ $t(ordersSummary.subtitle) }}
							</p>
						</div>
					</div>
					<div class="text-right">
						<p class="text-sm text-blue-600">{{ $t('avgDistance') }}</p>
						<p class="font-semibold text-blue-900">
							{{ ordersSummary.avgDistance }}
						</p>
					</div>
				</div>
			</div>

			<!-- Orders List -->
			<div class="space-y-4">
				<div
					v-for="order in orders"
					:key="order.id"
					class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
				>
					<!-- Order Header -->
					<div class="p-4 border-b border-gray-100">
						<div class="flex justify-between items-start">
							<div class="flex-1">
								<div class="flex items-center space-x-2 mb-1">
									<h4 class="font-bold text-lg text-gray-900">
										{{ order.number }}
									</h4>
								</div>
								<p class="text-gray-600 font-medium">{{ order.restaurant }}</p>
								<p class="text-sm text-gray-500">
									{{ $t('to') }} {{ order.customer }}
								</p>
							</div>
							<div class="text-right">
								<p class="text-2xl font-bold text-green-600">
									${{ order.amount }}
								</p>
								<p class="text-sm text-gray-500">
									{{ order.items }} {{ $t('items') }}
								</p>
								<p class="text-xs text-gray-400">{{ order.paymentMethod }}</p>
							</div>
						</div>
					</div>

					<!-- Order Details -->
					<div class="p-4">
						<div class="flex items-center justify-between text-sm mb-4">
							<div class="flex items-center space-x-4">
								<div class="flex items-center text-gray-600">
									<i
										class="ri-map-pin-distance-line mr-1 w-4 h-4 flex items-center justify-center"
									></i>
									<span>{{ order.distance }}</span>
								</div>
								<div class="flex items-center text-gray-600">
									<i
										class="ri-time-line mr-1 w-4 h-4 flex items-center justify-center"
									></i>
									<span>{{ order.eta }}</span>
								</div>
							</div>
							<button class="text-blue-600 hover:text-blue-800 cursor-pointer">
								<i
									class="ri-arrow-down-s-line w-4 h-4 flex items-center justify-center"
								></i>
							</button>
						</div>

						<div class="space-y-3 mb-4">
							<!-- Pickup -->
							<div class="flex items-start space-x-3">
								<div
									class="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5"
								>
									<i
										class="ri-store-2-line text-orange-600 text-xs w-3 h-3 flex items-center justify-center"
									></i>
								</div>
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium text-gray-900">
										{{ $t('pickup') }}
									</p>
									<p class="text-sm text-gray-600 truncate">
										{{ order.pickup }}
									</p>
								</div>
							</div>

							<div class="flex items-center justify-center">
								<div class="w-6 border-t border-dashed border-gray-300"></div>
							</div>

							<!-- Drop-off -->
							<div class="flex items-start space-x-3">
								<div
									class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5"
								>
									<i
										class="ri-map-pin-line text-blue-600 text-xs w-3 h-3 flex items-center justify-center"
									></i>
								</div>
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium text-gray-900">
										{{ $t('dropoff') }}
									</p>
									<p class="text-sm text-gray-600 truncate">
										{{ order.dropoff }}
									</p>
								</div>
							</div>
						</div>

						<!-- Actions -->
						<div class="flex space-x-2 mt-4">
							<button
								class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
							>
								{{ $t('acceptOrder') }}
							</button>
							<button
								class="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
							>
								{{ $t('decline') }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tabs = ref([
	{ label: 'available', count: 3 },
	{ label: 'active', count: 1 },
	{ label: 'completed', count: 2 },
]);
const activeTab = ref(0);

const ordersSummary = ref({
	title: 'ordersWaitingPickup',
	subtitle: 'potentialEarnings',
	avgDistance: '2.4 km',
});

const orders = ref([
	{
		id: 1,
		number: '#12345',
		restaurant: "Mario's Italian Kitchen",
		customer: 'John Doe',
		amount: 18.5,
		items: 2,
		paymentMethod: 'Cash',
		distance: '2.1 km',
		eta: '25 min',
		pickup: '123 Restaurant St',
		dropoff: '456 Customer Ave',
	},
	{
		id: 2,
		number: '#12346',
		restaurant: 'Dragon Palace',
		customer: 'Jane Smith',
		amount: 15.75,
		items: 3,
		paymentMethod: 'Card',
		distance: '1.8 km',
		eta: '20 min',
		pickup: '789 Asian Blvd',
		dropoff: '321 Home St',
	},
	{
		id: 3,
		number: '#12347',
		restaurant: 'Burger Baron',
		customer: 'Mike Johnson',
		amount: 22.0,
		items: 3,
		paymentMethod: 'Card',
		distance: '3.2 km',
		eta: '30 min',
		pickup: '555 Fast Food Lane',
		dropoff: '999 Office Plaza',
	},
]);
</script>
