<template>
	<div class="flex-1 flex flex-col">
		<!-- Main -->
		<main class="flex-1 overflow-auto pb-20 lg:pb-0 p-6 space-y-6">
			<div class="flex justify-between items-center">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">
						{{ $t('dashboard') }}
					</h1>
					<p class="text-gray-600 mt-1">{{ $t('readyToDeliver') }}</p>
				</div>
			</div>
			<!-- Status -->
			<div
				class="flex items-center justify-between rounded-xl bg-white/70 px-4 py-2 shadow-soft dark:bg-gray-800/70"
			>
				<!-- Status Text & Subtext -->
				<div class="flex flex-col justify-center w-36">
					<div class="flex items-center gap-2">
						<span
							class="font-semibold truncate"
							:class="isOnline ? 'text-green-600' : 'text-gray-500'"
						>
							{{ isOnline ? $t('online') : $t('offline') }}
						</span>
						<!-- Pulse Dot -->
						<span
							class="h-2 w-2 rounded-full animate-pulseScale"
							:class="isOnline ? 'bg-green-500' : 'bg-gray-400'"
						></span>
					</div>
					<p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
						{{ isOnline ? $t('receivingOrders') : $t('notReceivingOrders') }}
					</p>
				</div>

				<!-- Toggle -->
				<button
					type="button"
					role="switch"
					:aria-checked="isOnline"
					@click="isOnline = !isOnline"
					:class="[
						'relative inline-flex h-7 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
						isOnline ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600',
					]"
				>
					<span
						:class="[
							'inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-300',
							isOnline ? 'translate-x-6' : 'translate-x-1',
						]"
					></span>
				</button>
			</div>

			<!-- Current Delivery -->
			<div
				class="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-sm"
			>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">
					Current Delivery
				</h2>

				<!-- Improved Steps Container -->
				<div class="relative mb-6">
					<!-- Progress bar -->
					<div
						class="absolute top-5 left-5 right-5 h-1 bg-gray-200 rounded-full"
					>
						<div
							class="h-1 bg-green-600 rounded-full transition-all duration-500"
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
									'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
									step.completed
										? 'bg-green-600 border-black  text-black '
										: index === nextStepIndex
										? 'bg-green-500 border-green-800 text-green-800 animate-pulse-scale'
										: 'bg-green-300 border-green-600 text-green-600',
								]"
							>
								<i :class="[step.icon, 'step-icon']"></i>
							</div>

							<!-- Step Label -->
							<span
								:class="[
									'text-xs mt-2 font-medium text-center px-1',
									step.completed ? 'text-green-600' : 'text-gray-500',
								]"
							>
								{{ step.label }}
							</span>
						</div>
					</div>
				</div>

				<!-- Next Step Button -->
				<div
					v-if="nextStepIndex < deliverySteps.length"
					class="mt-6 flex justify-center"
				>
					<button
						@click="markNextStep"
						class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
					>
						Mark Next Step
					</button>
				</div>

				<!-- Current Order Details -->
				<div
					v-if="currentDelivery"
					class="bg-gray-50 rounded-xl p-4 mt-6 space-y-4"
				>
					<div
						class="flex flex-col md:flex-row md:items-center justify-between"
					>
						<div class="mb-3 md:mb-0">
							<h4 class="font-semibold text-gray-900">
								Order {{ currentDelivery.id }}
							</h4>
							<p class="text-sm text-gray-600 mt-1">
								<i class="ri-map-pin-line mr-1"></i>
								{{ currentDelivery.pickupLocation }} →
								{{ currentDelivery.dropoffName }}
							</p>
						</div>
						<div class="text-left md:text-right">
							<p class="font-bold text-green-600">
								${{ currentDelivery.price.toFixed(2) }}
							</p>
							<p class="text-sm text-gray-500 mt-1">
								{{ currentDelivery.paymentMethod }}
							</p>
						</div>
					</div>

					<div class="flex flex-col sm:flex-row gap-2">
						<button
							class="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
						>
							<i class="ri-checkbox-circle-line mr-2"></i> Mark Delivered
						</button>
						<button
							class="px-4 py-3 border border-gray-300 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center"
						>
							<i class="ri-phone-line mr-2"></i> Call Customer
						</button>
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
							<p class="text-gray-600 text-sm">{{ $t(stat.label) }}</p>
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
import { ref, computed } from 'vue';
import { useAuthStore } from '@/app/store/auth/auth.store';
import { useI18n } from 'vue-i18n';

const authStore = useAuthStore();
const { t } = useI18n();

const isOnline = ref(true);
const todayDeliveries = ref(12);
const todayEarnings = ref(145.5);

const deliverySteps = ref([
	{ label: 'accepted', icon: 'ri-check-line', completed: false },
	{ label: 'pickedUp', icon: 'ri-shopping-bag-line', completed: false },
	{ label: 'onTheWay', icon: 'ri-truck-line', completed: false },
	{ label: 'delivered', icon: 'ri-map-pin-line', completed: false },
]);

const nextStepIndex = computed(() =>
	deliverySteps.value.findIndex((step) => !step.completed)
);

const markNextStep = () => {
	const index = nextStepIndex.value;
	if (index !== -1) deliverySteps.value[index].completed = true;
};

// Calculate progress percentage
const progressPercentage = computed(() => {
	const totalSteps = deliverySteps.value.length;
	const completedSteps = deliverySteps.value.filter(
		(step) => step.completed
	).length;

	const currStep = completedSteps + 1;
	// If all steps completed
	if (completedSteps === totalSteps) return 100;

	const percentage = (currStep / totalSteps) * 100 - 12.5;

	return percentage;
});

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
		label: 'today',
		value: 12,
		change: '+3 from yesterday',
		icon: 'ri-truck-line text-blue-600 w-5 h-5',
		bg: 'bg-blue-100',
	},
	{
		label: 'earnings',
		value: '$145.5',
		change: '+$12.50',
		icon: 'ri-money-dollar-circle-line text-green-600 w-5 h-5',
		bg: 'bg-green-100',
	},
	{
		label: 'distanceStat',
		value: '45.2km',
		change: 'Avg 3.8km',
		icon: 'ri-map-pin-line text-orange-600 w-5 h-5',
		bg: 'bg-orange-100',
	},
	{
		label: 'ratingStat',
		value: 4.9,
		change: '',
		icon: 'ri-star-line text-purple-600 w-5 h-5',
		bg: 'bg-purple-100',
	},
	{
		label: 'online',
		value: '8.5h',
		change: 'Since 9:00 AM',
		icon: 'ri-time-line text-indigo-600 w-5 h-5',
		bg: 'bg-indigo-100',
	},
]);
</script>

<style>
.step-icon {
	font-size: 1.25rem; /* 20px like w-5 h-5 */
}

.hide-scrollbar::-webkit-scrollbar {
	display: none;
}
.hide-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
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
</style>
