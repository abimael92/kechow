<template>
	<div class="min-h-screen p-4 lg:p-8 space-y-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
					{{ t('liveDelivery') }}
				</h1>
				<p class="text-gray-600 dark:text-gray-400 mt-1">
					{{ t('trackYourDelivery') }}
				</p>
			</div>
			<button
				@click="$router.back()"
				class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
			>
				<i class="ri-arrow-left-line"></i>
			</button>
		</div>

		<!-- Order Info Card -->
		<div
			v-if="deliveryStore.activeOrder"
			class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
		>
			<div class="flex items-center justify-between mb-4">
				<div>
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						{{ deliveryStore.activeOrder.orderNumber }}
					</h2>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						{{ t('deliveryFee') }}: ${{ deliveryStore.activeOrder.fee.toFixed(2) }}
					</p>
				</div>
				<div class="text-right">
					<p class="text-2xl font-bold text-green-600 dark:text-green-400">
						${{ (deliveryStore.activeOrder.amount + deliveryStore.activeOrder.fee).toFixed(2) }}
					</p>
					<p class="text-xs text-gray-500 dark:text-gray-400">
						{{ deliveryStore.activeOrder.paymentMethod }}
					</p>
				</div>
			</div>

			<!-- Progress Steps -->
			<div class="relative mb-6">
				<div
					class="absolute top-5 left-5 right-5 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"
				>
					<div
						class="h-1 bg-green-600 dark:bg-green-500 rounded-full transition-all duration-500"
						:style="{ width: progressPercentage + '%' }"
					></div>
				</div>
				<div class="flex justify-between relative z-10">
					<div
						v-for="(step, index) in deliverySteps"
						:key="index"
						class="flex flex-col items-center flex-none w-1/4"
					>
						<div
							:class="[
								'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm',
								step.completed
									? 'bg-green-600 border-green-700 dark:border-green-400 text-white'
									: index === currentStepIndex
									? 'bg-green-500 border-green-600 dark:border-green-300 text-white animate-pulse'
									: 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400',
							]"
						>
							<i :class="step.icon"></i>
						</div>
						<span
							:class="[
								'text-xs mt-2 font-medium text-center px-1',
								step.completed
									? 'text-green-600 dark:text-green-400'
									: 'text-gray-500 dark:text-gray-400',
							]"
						>
							{{ t(step.label) }}
						</span>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-col sm:flex-row gap-3">
				<button
					v-if="currentStepIndex === 0"
					@click="updateStatus('picked_up')"
					class="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
				>
					<i class="ri-shopping-bag-line mr-2"></i>
					{{ t('markPickedUp') }}
				</button>
				<button
					v-if="currentStepIndex === 1"
					@click="updateStatus('on_the_way')"
					class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
				>
					<i class="ri-truck-line mr-2"></i>
					{{ t('startDelivery') }}
				</button>
				<button
					v-if="currentStepIndex === 2"
					@click="updateStatus('delivered')"
					class="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
				>
					<i class="ri-checkbox-circle-line mr-2"></i>
					{{ t('markDelivered') }}
				</button>
				<a
					:href="`tel:${deliveryStore.activeOrder.customer.phone}`"
					class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
				>
					<i class="ri-phone-line mr-2"></i>
					{{ t('callCustomer') }}
				</a>
			</div>
		</div>

		<!-- GPS Location Display -->
		<div
			class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
		>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
				<i class="ri-map-pin-line mr-2"></i>
				{{ t('currentLocation') }}
			</h3>
			<div v-if="deliveryStore.currentLocation" class="space-y-2">
				<div class="flex items-center justify-between">
					<span class="text-gray-600 dark:text-gray-400">{{ t('latitude') }}:</span>
					<span class="font-mono text-gray-900 dark:text-white">
						{{ deliveryStore.currentLocation.latitude.toFixed(6) }}
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-gray-600 dark:text-gray-400">{{ t('longitude') }}:</span>
					<span class="font-mono text-gray-900 dark:text-white">
						{{ deliveryStore.currentLocation.longitude.toFixed(6) }}
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-gray-600 dark:text-gray-400">{{ t('accuracy') }}:</span>
					<span class="font-mono text-gray-900 dark:text-white">
						{{ deliveryStore.currentLocation.accuracy?.toFixed(0) }}m
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-gray-600 dark:text-gray-400">{{ t('lastUpdate') }}:</span>
					<span class="text-sm text-gray-500 dark:text-gray-400">
						{{ formatTime(deliveryStore.currentLocation.timestamp) }}
					</span>
				</div>
			</div>
			<div v-else class="text-center py-4 text-gray-500 dark:text-gray-400">
				<i class="ri-map-pin-line text-2xl mb-2"></i>
				<p>{{ t('locationNotAvailable') }}</p>
			</div>
		</div>

		<!-- Route Info -->
		<div
			v-if="deliveryStore.activeOrder"
			class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 space-y-4"
		>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				{{ t('deliveryRoute') }}
			</h3>

			<!-- Pickup -->
			<div class="flex items-start space-x-3">
				<div
					class="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0"
				>
					<i class="ri-store-2-line text-orange-600 dark:text-orange-400"></i>
				</div>
				<div class="flex-1">
					<p class="font-medium text-gray-900 dark:text-white">
						{{ deliveryStore.activeOrder.restaurant.name }}
					</p>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						{{ deliveryStore.activeOrder.restaurant.address }}
					</p>
					<a
						:href="`tel:${deliveryStore.activeOrder.restaurant.phone}`"
						class="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
					>
						<i class="ri-phone-line mr-1"></i>
						{{ deliveryStore.activeOrder.restaurant.phone }}
					</a>
				</div>
			</div>

			<div class="flex items-center justify-center py-2">
				<div class="w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>
			</div>

			<!-- Dropoff -->
			<div class="flex items-start space-x-3">
				<div
					class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0"
				>
					<i class="ri-map-pin-line text-blue-600 dark:text-blue-400"></i>
				</div>
				<div class="flex-1">
					<p class="font-medium text-gray-900 dark:text-white">
						{{ deliveryStore.activeOrder.customer.name }}
					</p>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						{{ deliveryStore.activeOrder.customer.address }}
					</p>
					<a
						:href="`tel:${deliveryStore.activeOrder.customer.phone}`"
						class="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
					>
						<i class="ri-phone-line mr-1"></i>
						{{ deliveryStore.activeOrder.customer.phone }}
					</a>
				</div>
			</div>

			<!-- Distance & ETA -->
			<div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
				<div class="text-center">
					<p class="text-sm text-gray-600 dark:text-gray-400">{{ t('distance') }}</p>
					<p class="text-lg font-bold text-gray-900 dark:text-white">
						{{ deliveryStore.activeOrder.distance }} km
					</p>
				</div>
				<div class="text-center">
					<p class="text-sm text-gray-600 dark:text-gray-400">{{ t('estimatedTime') }}</p>
					<p class="text-lg font-bold text-gray-900 dark:text-white">
						{{ deliveryStore.activeOrder.estimatedTime }} min
					</p>
				</div>
			</div>
		</div>

		<!-- Items List -->
		<div
			v-if="deliveryStore.activeOrder"
			class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
		>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
				{{ t('orderItems') }}
			</h3>
			<div class="space-y-2">
				<div
					v-for="item in deliveryStore.activeOrder.items"
					:key="item.id"
					class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
				>
					<span class="text-gray-900 dark:text-white">{{ item.name }}</span>
					<span class="text-gray-600 dark:text-gray-400">x{{ item.quantity }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useDeliveryStore } from '../store/delivery.store';
import type { DeliveryStatus } from '../types';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const deliveryStore = useDeliveryStore();

const orderId = computed(() => route.params.id as string);

// Delivery steps
const deliverySteps = computed(() => {
	if (!deliveryStore.deliveryProgress) return [];

	return deliveryStore.deliveryProgress.steps.map((step) => ({
		label: step.label,
		icon: getStepIcon(step.label),
		completed: step.completed,
	}));
});

const getStepIcon = (label: string) => {
	const iconMap: Record<string, string> = {
		accepted: 'ri-check-line',
		pickedUp: 'ri-shopping-bag-line',
		onTheWay: 'ri-truck-line',
		delivered: 'ri-map-pin-line',
	};
	return iconMap[label] || 'ri-circle-line';
};

const currentStepIndex = computed(() => {
	return deliveryStore.deliveryProgress?.currentStep || 0;
});

const progressPercentage = computed(() => {
	if (!deliveryStore.deliveryProgress) return 0;

	const totalSteps = deliverySteps.value.length;
	const completedSteps = deliverySteps.value.filter((step) => step.completed).length;

	if (completedSteps === totalSteps) return 100;
	return ((completedSteps + 1) / totalSteps) * 100 - 12.5;
});

// Update status
const updateStatus = async (status: string) => {
	if (!deliveryStore.activeOrder) return;

	try {
		await deliveryStore.updateStatus(deliveryStore.activeOrder.id, status);
		await deliveryStore.loadDeliveryProgress(deliveryStore.activeOrder.id);

		if (status === 'delivered') {
			// Navigate back to dashboard after delivery
			setTimeout(() => {
				router.push('/delivery/dashboard');
			}, 2000);
		}
	} catch (error) {
		console.error('Failed to update status:', error);
	}
};

// Format time
const formatTime = (timestamp: string) => {
	const date = new Date(timestamp);
	return date.toLocaleTimeString();
};

// Location tracking
let locationInterval: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
	if (orderId.value && deliveryStore.activeOrder) {
		await deliveryStore.loadDeliveryProgress(orderId.value);
		deliveryStore.updateCurrentLocation(orderId.value);

		// Start location tracking
		locationInterval = setInterval(() => {
			deliveryStore.updateCurrentLocation(orderId.value);
		}, 10000); // Update every 10 seconds
	}
});

onUnmounted(() => {
	if (locationInterval) {
		clearInterval(locationInterval);
	}
});
</script>
