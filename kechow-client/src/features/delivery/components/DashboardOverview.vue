<template>
	<div class="min-h-screen p-4 lg:p-8 space-y-8">
		<!-- Header -->
		<div class="space-y-2">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
					<i class="ri-dashboard-line text-white text-lg sm:text-xl md:text-2xl"></i>
				</div>
				<div>
					<h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-snug">
						Tablero
					</h1>
					<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none">
						¡Listo para entregar comida increíble!
					</p>
				</div>
			</div>
		</div>

		<!-- Simulation complete banner (delivery lifecycle validated) -->
		<div
			v-if="showSimulationComplete"
			class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 shadow-soft flex items-center gap-3"
		>
			<div class="w-10 h-10 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0">
				<i class="ri-checkbox-circle-line text-white text-xl"></i>
			</div>
			<div>
				<p class="font-semibold text-green-800 dark:text-green-200">Ciclo de entrega validado</p>
				<p class="text-sm text-green-700 dark:text-green-300">Simulación completada.</p>
			</div>
		</div>

		<!-- Status Card - UPDATED for better contrast -->
		<div
			class="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-soft"
		>
			<div class="flex items-center justify-between">
				<!-- Status Text & Subtext -->
				<div class="flex flex-col">
					<div class="flex items-center gap-2">
						<span
							class="font-semibold text-lg truncate"
							:class="deliveryStore.isOnline ? 'text-green-600 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400'"
						>
							{{ deliveryStore.isOnline ? t('online') : t('offline') }}
						</span>
						<!-- Pulse Dot -->
						<span
							class="h-2 w-2 rounded-full animate-pulseScale"
							:class="deliveryStore.isOnline ? 'bg-green-500' : 'bg-neutral-400'"
						></span>
					</div>
					<!-- FIXED: Use t() instead of $t() -->
					<p class="text-sm text-neutral-600 dark:text-neutral-300 mt-1 truncate">
						{{ deliveryStore.isOnline ? t('receivingOrders') : t('notReceivingOrders') }}
					</p>
				</div>

				<!-- Toggle - UPDATED styling -->
				<button
					type="button"
					role="switch"
					:aria-checked="deliveryStore.isOnline"
					@click="handleToggleAvailability"
					:disabled="deliveryStore.hasActiveOrder"
					:class="[
						'relative inline-flex h-7 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900',
						deliveryStore.isOnline ? 'bg-green-600' : 'bg-neutral-300 dark:bg-neutral-600',
						deliveryStore.hasActiveOrder ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
					]"
				>
					<span
						:class="[
							'inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-300',
							deliveryStore.isOnline ? 'translate-x-6' : 'translate-x-1',
						]"
					></span>
				</button>
			</div>
		</div>

		<!-- Current Delivery Card - UPDATED styling -->
		<div
			class="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-soft"
		>
			<h2 class="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
				Current Delivery
			</h2>

			<!-- Improved Steps Container -->
			<div class="relative mb-8">
				<!-- Progress bar -->
				<div
					class="absolute top-5 left-5 right-5 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full"
				>
					<div
						class="h-1 bg-green-600 dark:bg-green-500 rounded-full transition-all duration-500"
						:style="{ width: progressPercentage + '%' }"
					></div>
				</div>
				<!-- Steps -->
				<div class="flex justify-between relative z-10">
					<div
						v-for="(step, index) in deliverySteps"
						:key="index"
						class="flex flex-col items-center flex-none w-1/4"
					>
						<!-- Step Circle -->
						<div
							:class="[
								'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm',
								step.completed
									? 'bg-green-600 border-green-700 dark:border-green-400 text-white'
									: index === nextStepIndex
									? 'bg-green-500 border-green-600 dark:border-green-300 text-white animate-pulse-scale'
									: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400',
							]"
						>
							<i :class="[step.icon, 'step-icon']"></i>
						</div>

						<!-- Step Label -->
						<!-- FIXED: Use t() for step labels -->
						<span
							:class="[
								'text-sm mt-2 font-medium text-center px-1',
								step.completed ? 'text-green-600 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400',
							]"
						>
							{{ t(step.label) }}
						</span>
					</div>
				</div>
			</div>

			<!-- Next Step Button - UPDATED with pink hover -->
			<div
				v-if="deliveryStore.hasActiveOrder && nextStepIndex < deliverySteps.length"
				class="mt-8 flex justify-center"
			>
				<button
					@click="markNextStep"
					class="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-medium shadow-button hover:shadow-button-hover transition-all duration-200 hover:-translate-y-0.5 cursor-pointer w-full md:w-auto group"
				>
					<i class="ri-checkbox-circle-line mr-2"></i>
				{{ t('markNextStep') }}
				</button>
			</div>

			<!-- Current Order Details - UPDATED styling -->
			<div
				v-if="currentDelivery"
				class="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-6 mt-8 space-y-4 border border-neutral-200 dark:border-neutral-700"
			>
				<div
					class="flex flex-col md:flex-row md:items-center justify-between"
				>
					<div class="mb-4 md:mb-0">
						<h4 class="font-semibold text-neutral-900 dark:text-white text-lg">
							{{ t('order') }} {{ currentDelivery.id }}
						</h4>
						<p class="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
							<i class="ri-map-pin-line mr-2 text-primary-500"></i>
							{{ currentDelivery.pickupLocation }} →
							{{ currentDelivery.dropoffName }}
						</p>
					</div>
					<div class="text-left md:text-right">
						<p class="font-bold text-green-600 dark:text-green-400 text-xl">
							${{ currentDelivery.price.toFixed(2) }}
						</p>
						<p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
							{{ currentDelivery.paymentMethod }}
						</p>
					</div>
				</div>

				<div class="flex flex-col sm:flex-row gap-3">
					<button
						@click="markDelivered"
						class="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-medium shadow-button hover:shadow-button-hover transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group flex items-center justify-center"
					>
						<i class="ri-checkbox-circle-line mr-2"></i>  {{ t('markDelivered') }}
					</button>
					<a
						:href="`tel:${deliveryStore.activeOrder?.customer.phone}`"
						class="px-6 py-3 border border-primary-400 dark:border-primary-600 text-primary-700 dark:text-primary-400 rounded-xl font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-800 dark:hover:text-primary-300 transition-all duration-200 hover:shadow-sm cursor-pointer flex items-center justify-center"
					>
						<i class="ri-phone-line mr-2"></i> {{ t('callCustomer') }}
					</a>
				</div>
			</div>
			<div v-else class="text-center py-8 text-neutral-500 dark:text-neutral-400">
				<i class="ri-inbox-line text-4xl mb-2"></i>
				<p>{{ t('noActiveDelivery') }}</p>
			</div>
		</div>

		<!-- Stats Cards - UPDATED styling -->
		<div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
			<div
				v-for="(stat, index) in stats"
				:key="index"
				class="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-800 hover:shadow-medium transition-shadow duration-200"
			>
				<div class="flex items-center justify-between">
					<div>
						<!-- FIXED: Use t() instead of $t() -->
						<p class="text-neutral-600 dark:text-neutral-300 text-sm font-medium">{{ t(stat.label) }}</p>
						<p class="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{{ stat.value }}</p>
						<p class="text-xs text-green-600 dark:text-green-400 mt-1">{{ stat.change }}</p>
					</div>
					<div
						:class="[
							'w-12 h-12 rounded-xl flex items-center justify-center shadow-sm',
							stat.bg,
						]"
					>
						<i :class="stat.icon"></i>
					</div>
				</div>
			</div>
		</div>

		<!-- Insights Feed - UPDATED styling -->
		<div class="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-soft border border-neutral-200 dark:border-neutral-800">
			<div class="flex items-center gap-3 mb-4">
				<div class="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-sm">
					<i class="ri-lightbulb-flash-line text-white"></i>
				</div>
				<h4 class="font-semibold text-lg text-neutral-900 dark:text-white">
				{{ t('liveInsights') }}
				</h4>
			</div>
			<ul class="space-y-3">
				<li
					v-for="(item, i) in insights"
					:key="i"
					class="text-neutral-700 dark:text-neutral-300 text-sm flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
				>
					<i class="ri-lightbulb-flash-line text-yellow-500 dark:text-yellow-400"></i>
					<span>{{ item }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDeliveryStore } from '../store/delivery.store';
import type { DeliveryStatus } from '../types';

const { t } = useI18n();
const deliveryStore = useDeliveryStore();

// Initialize store on mount
onMounted(async () => {
	await deliveryStore.initialize();
	await deliveryStore.loadEarningsSummary();
	if (deliveryStore.activeOrder) {
		await deliveryStore.loadDeliveryProgress(deliveryStore.activeOrder.id);
		deliveryStore.startLocationTracking(deliveryStore.activeOrder.id);
	}
});

// Cleanup on unmount
onUnmounted(() => {
	// Location tracking cleanup handled by store
});

// Availability toggle
const handleToggleAvailability = async () => {
	await deliveryStore.toggleAvailability();
	if (deliveryStore.isOnline) {
		await deliveryStore.loadAvailableJobs();
	}
};

// Delivery steps based on active order status
const deliverySteps = computed(() => {
	if (!deliveryStore.activeOrder) return [];

	const statusMap: Record<DeliveryStatus, number> = {
		accepted: 0,
		picked_up: 1,
		on_the_way: 2,
		delivered: 3,
		cancelled: -1,
		available: -1,
	};

	const currentStep = statusMap[deliveryStore.activeOrder.status] || 0;

	return [
		{ label: 'accepted', icon: 'ri-check-line', completed: currentStep >= 0 },
		{ label: 'pickedUp', icon: 'ri-shopping-bag-line', completed: currentStep >= 1 },
		{ label: 'onTheWay', icon: 'ri-truck-line', completed: currentStep >= 2 },
		{ label: 'delivered', icon: 'ri-map-pin-line', completed: currentStep >= 3 },
	];
});

const nextStepIndex = computed(() =>
	deliverySteps.value.findIndex((step) => !step.completed)
);

const markNextStep = async () => {
	if (!deliveryStore.activeOrder) return;

	const index = nextStepIndex.value;
	const statusMap: DeliveryStatus[] = ['accepted', 'picked_up', 'on_the_way', 'delivered'];

	if (index >= 0 && index < statusMap.length) {
		await deliveryStore.updateStatus(deliveryStore.activeOrder.id, statusMap[index]);
	}
};

// Progress percentage
const progressPercentage = computed(() => {
	if (!deliveryStore.activeOrder) return 0;

	const totalSteps = deliverySteps.value.length;
	const completedSteps = deliverySteps.value.filter((step) => step.completed).length;

	if (completedSteps === totalSteps) return 100;
	return ((completedSteps + 1) / totalSteps) * 100 - 12.5;
});

// Current delivery info
const currentDelivery = computed(() => {
	if (!deliveryStore.activeOrder) return null;

	return {
		id: deliveryStore.activeOrder.orderNumber,
		pickupLocation: deliveryStore.activeOrder.restaurant.name,
		dropoffName: deliveryStore.activeOrder.customer.name,
		dropoffAddress: deliveryStore.activeOrder.customer.address,
		price: deliveryStore.activeOrder.amount + deliveryStore.activeOrder.fee,
		paymentMethod: deliveryStore.activeOrder.paymentMethod,
	};
});

// Mark delivered
const markDelivered = async () => {
	if (!deliveryStore.activeOrder) return;
	await deliveryStore.updateStatus(deliveryStore.activeOrder.id, 'delivered');
};

// Stats from earnings summary
const stats = computed(() => {
	const earnings = deliveryStore.earningsSummary;
	if (!earnings) {
		return [
			{
				label: 'today',
				value: 0,
				change: t('noData'),
				icon: 'ri-truck-line text-blue-600 dark:text-blue-400 w-5 h-5',
				bg: 'bg-blue-100 dark:bg-blue-900/30',
			},
			{
				label: 'earnings',
				value: '$0',
				change: t('noData'),
				icon: 'ri-money-dollar-circle-line text-green-600 dark:text-green-400 w-5 h-5',
				bg: 'bg-green-100 dark:bg-green-900/30',
			},
			{
				label: 'distanceStat',
				value: '0km',
				change: t('noData'),
				icon: 'ri-map-pin-line text-orange-600 dark:text-orange-400 w-5 h-5',
				bg: 'bg-orange-100 dark:bg-orange-900/30',
			},
			{
				label: 'online',
				value: '0h',
				change: t('noData'),
				icon: 'ri-time-line text-indigo-600 dark:text-indigo-400 w-5 h-5',
				bg: 'bg-indigo-100 dark:bg-indigo-900/30',
			},
		];
	}

	return [
		{
			label: 'today',
			value: earnings.today.deliveries,
			change: t('changeFromYesterday', { value: earnings.today.deliveries }),
			icon: 'ri-truck-line text-blue-600 dark:text-blue-400 w-5 h-5',
			bg: 'bg-blue-100 dark:bg-blue-900/30',
		},
		{
			label: 'earnings',
			value: `$${earnings.today.earnings.toFixed(2)}`,
			change: t('changeEarnings', { amount: earnings.today.earnings.toFixed(2) }),
			icon: 'ri-money-dollar-circle-line text-green-600 dark:text-green-400 w-5 h-5',
			bg: 'bg-green-100 dark:bg-green-900/30',
		},
		{
			label: 'distanceStat',
			value: `${earnings.today.distance.toFixed(1)}km`,
			change: t('avgDistance', { distance: earnings.today.distance.toFixed(1) }),
			icon: 'ri-map-pin-line text-orange-600 dark:text-orange-400 w-5 h-5',
			bg: 'bg-orange-100 dark:bg-orange-900/30',
		},
		{
			label: 'online',
			value: `${earnings.today.hours.toFixed(1)}h`,
			change: t('sinceTime', { time: new Date().toLocaleTimeString() }),
			icon: 'ri-time-line text-indigo-600 dark:text-indigo-400 w-5 h-5',
			bg: 'bg-indigo-100 dark:bg-indigo-900/30',
		},
	];
});

const insights = ref([
	t('insight1'),
	t('insight2'),
	t('insight3'),
]);

// Show "Delivery lifecycle validated" when at least one delivery completed today and no active order
const showSimulationComplete = computed(
	() =>
		!deliveryStore.hasActiveOrder &&
		deliveryStore.earningsSummary != null &&
		deliveryStore.earningsSummary.today.deliveries >= 1
);

</script>

<style scoped>
.step-icon {
	font-size: 1.25rem;
}

@keyframes pulse-scale {
	0%,
	100% {
		transform: scale(1);
		opacity: 1;
	}
	50% {
		transform: scale(1.25);
		opacity: 1;
	}
}

.animate-pulse-scale {
	animation: pulse-scale 1s infinite;
}

/* Custom hover effect for primary buttons */
.group:hover {
	background: linear-gradient(135deg, #ff5eae, #a855f7) !important;
	transition: all 0.3s ease;
}
</style>