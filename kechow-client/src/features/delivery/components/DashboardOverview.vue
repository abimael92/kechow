<template>
	<div class="flex-1 flex flex-col">
		<!-- Header -->
		<header
			class="bg-white shadow-sm border-b border-gray-200 lg:shadow-none lg:border-0"
		>
			<div class="flex items-center justify-between h-16 px-6">
				<button class="lg:hidden w-6 h-6 flex items-center justify-center">
					<i class="ri-menu-line text-gray-500 text-xl"></i>
				</button>
				<div
					class="flex-1 flex justify-center lg:justify-end items-center space-x-4"
				>
					<div class="hidden md:flex items-center space-x-6 text-sm">
						<div class="text-center">
							<p class="text-gray-500">Today</p>
							<p class="font-semibold text-gray-900">
								{{ todayDeliveries }} deliveries
							</p>
						</div>
						<div class="text-center">
							<p class="text-gray-500">Earnings</p>
							<p class="font-semibold text-green-600">
								${{ todayEarnings.toFixed(2) }}
							</p>
						</div>
					</div>

					<button class="relative p-2 text-gray-400 hover:text-gray-600">
						<i class="ri-notification-line text-xl"></i>
						<span
							class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
						></span>
					</button>

					<div class="flex items-center space-x-3">
						<div
							class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
						>
							<i class="ri-user-line text-white text-sm"></i>
						</div>
						<div class="hidden md:block">
							<p class="text-sm font-medium text-gray-900">
								{{ authStore.user?.name }}
							</p>
							<p class="text-xs text-gray-500">Delivery Partner</p>
						</div>
					</div>
				</div>
			</div>
		</header>

		<!-- Main -->
		<main class="flex-1 overflow-auto pb-20 lg:pb-0 p-6 space-y-6">
			<!-- Status -->
			<div class="flex justify-between items-center">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
					<p class="text-gray-600 mt-1">Ready to deliver amazing food!</p>
				</div>

				<div class="flex items-center space-x-3">
					<span class="text-sm text-gray-600">Status:</span>
					<button
						class="relative inline-flex h-7 w-12 items-center rounded-full bg-green-600"
					>
						<span
							class="inline-block h-5 w-5 transform rounded-full bg-white translate-x-6 transition-transform"
						></span>
					</button>
					<div class="text-right">
						<span class="text-sm font-semibold text-green-600">Online</span>
						<p class="text-xs text-gray-500">Receiving orders</p>
					</div>
					<div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
				</div>
			</div>

			<!-- Current Delivery -->
			<div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">
					Current Delivery
				</h2>
				<div class="space-y-6">
					<div class="relative flex justify-between">
						<div
							v-for="(step, index) in deliverySteps"
							:key="index"
							class="flex flex-col items-center relative flex-1"
						>
							<div
								:class="[
									'w-10 h-10 rounded-full flex items-center justify-center border-2 text-white',
									step.completed
										? 'bg-green-600 border-green-600'
										: 'bg-white border-gray-300 text-gray-400',
								]"
							>
								<i :class="step.icon"></i>
							</div>
							<span
								:class="[
									'text-sm font-medium mt-2',
									step.completed ? 'text-green-600' : 'text-gray-400',
								]"
								>{{ step.label }}</span
							>
							<div
								v-if="index < deliverySteps.length - 1"
								:class="[
									'absolute top-5 left-1/2 w-full h-0.5 -z-10',
									deliverySteps[index + 1].completed
										? 'bg-green-600'
										: 'bg-gray-200',
								]"
								style="transform: translateX(50%)"
							></div>
						</div>
					</div>

					<!-- Current Order Details -->
					<div v-if="currentDelivery" class="bg-gray-50 rounded-xl p-4">
						<div class="flex items-center justify-between mb-4">
							<div>
								<h4 class="font-semibold text-gray-900">
									{{ currentDelivery.id }}
								</h4>
								<p class="text-sm text-gray-600">
									{{ currentDelivery.pickupLocation }} →
									{{ currentDelivery.dropoffName }}
								</p>
							</div>
							<div class="text-right">
								<p class="font-bold text-green-600">
									${{ currentDelivery.price.toFixed(2) }}
								</p>
								<p class="text-sm text-gray-500">
									{{ currentDelivery.paymentMethod }}
								</p>
							</div>
						</div>

						<div class="space-y-3">
							<div
								class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
							>
								<div>
									<p class="font-medium text-blue-900">Navigate to Customer</p>
									<p class="text-sm text-blue-700">
										{{ currentDelivery.dropoffAddress }}
									</p>
								</div>
								<button
									class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
								>
									<i class="ri-navigation-line mr-2"></i>Navigate
								</button>
							</div>
							<div class="flex space-x-2">
								<button
									class="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
								>
									Mark as Delivered
								</button>
								<button
									class="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
								>
									<i class="ri-phone-line"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Stats Cards -->
			<div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
				<div
					v-for="(stat, index) in stats"
					:key="index"
					class="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
				>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-gray-600 text-sm">{{ stat.label }}</p>
							<p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
							<p class="text-xs text-green-600">{{ stat.change }}</p>
						</div>
						<div
							:class="[
								'w-10 h-10 rounded-lg flex items-center justify-center',
								stat.bg,
							]"
						>
							<i :class="stat.icon"></i>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/app/store/auth/auth.store';

const authStore = useAuthStore();

const todayDeliveries = ref(12);
const todayEarnings = ref(145.5);

const deliverySteps = ref([
	{ label: 'Accepted', icon: 'ri-check-line w-5 h-5', completed: true },
	{ label: 'Picked Up', icon: 'ri-shopping-bag-line w-5 h-5', completed: true },
	{ label: 'On the Way', icon: 'ri-truck-line w-5 h-5', completed: false },
	{ label: 'Delivered', icon: 'ri-map-pin-line w-5 h-5', completed: false },
]);

const currentDelivery = ref({
	id: '#12348',
	pickupLocation: 'Spice Garden',
	dropoffName: 'Sarah Wilson',
	dropoffAddress: '222 Flavor Ave',
	price: 19.25,
	paymentMethod: 'Card',
});

const stats = ref([
	{
		label: 'Today',
		value: 12,
		change: '+3 from yesterday',
		icon: 'ri-truck-line text-blue-600 w-5 h-5',
		bg: 'bg-blue-100',
	},
	{
		label: 'Earnings',
		value: '$145.5',
		change: '+$12.50',
		icon: 'ri-money-dollar-circle-line text-green-600 w-5 h-5',
		bg: 'bg-green-100',
	},
	{
		label: 'Distance',
		value: '45.2km',
		change: 'Avg 3.8km',
		icon: 'ri-map-pin-line text-orange-600 w-5 h-5',
		bg: 'bg-orange-100',
	},
	{
		label: 'Rating',
		value: 4.9,
		change: '',
		icon: 'ri-star-line text-purple-600 w-5 h-5',
		bg: 'bg-purple-100',
	},
	{
		label: 'Online',
		value: '8.5h',
		change: 'Since 9:00 AM',
		icon: 'ri-time-line text-indigo-600 w-5 h-5',
		bg: 'bg-indigo-100',
	},
]);
</script>
