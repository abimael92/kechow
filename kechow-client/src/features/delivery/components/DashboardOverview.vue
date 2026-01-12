<template>
	<div class="min-h-screen p-4 lg:p-8 space-y-8">
		<!-- Header -->
		<div class="space-y-2">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30">
					<i class="ri-dashboard-line text-white text-lg"></i>
				</div>
				<div>
					<!-- FIXED: Use t() instead of $t() -->
					<h1 class="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
						{{ t('dashboard') }}
					</h1>
					<!-- FIXED: Use t() instead of $t() -->
					<p class="text-neutral-800 dark:text-neutral-200 font-normal text-lg">
						{{ t('readyToDeliver') }}
					</p>
				</div>
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
							:class="isOnline ? 'text-green-600 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400'"
						>
							{{ isOnline ? t('online') : t('offline') }}
						</span>
						<!-- Pulse Dot -->
						<span
							class="h-2 w-2 rounded-full animate-pulseScale"
							:class="isOnline ? 'bg-green-500' : 'bg-neutral-400'"
						></span>
					</div>
					<!-- FIXED: Use t() instead of $t() -->
					<p class="text-sm text-neutral-600 dark:text-neutral-300 mt-1 truncate">
						{{ isOnline ? t('receivingOrders') : t('notReceivingOrders') }}
					</p>
				</div>

				<!-- Toggle - UPDATED styling -->
				<button
					type="button"
					role="switch"
					:aria-checked="isOnline"
					@click="isOnline = !isOnline"
					:class="[
						'relative inline-flex h-7 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900',
						isOnline ? 'bg-green-600' : 'bg-neutral-300 dark:bg-neutral-600',
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
				v-if="nextStepIndex < deliverySteps.length"
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
							Order {{ currentDelivery.id }}
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
						class="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-medium shadow-button hover:shadow-button-hover transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group flex items-center justify-center"
					>
						<i class="ri-checkbox-circle-line mr-2"></i>  {{ t('markDelivered') }}
					</button>
					<button
						class="px-6 py-3 border border-primary-400 dark:border-primary-600 text-primary-700 dark:text-primary-400 rounded-xl font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-800 dark:hover:text-primary-300 transition-all duration-200 hover:shadow-sm cursor-pointer flex items-center justify-center"
					>
						<i class="ri-phone-line mr-2"></i> {{ t('callCustomer') }}
					</button>
				</div>
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
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

// Get the translation function
const { t } = useI18n();

// Add debug logging to verify translations work
console.log('🌐 Dashboard Component Loaded');
// console.log('Current locale:', i18n.global.locale); // If you need to check locale
console.log('Translation test - "dashboard":', t('dashboard'));
console.log('Translation test - "readyToDeliver":', t('readyToDeliver'));

// Keep this for debug if needed:
console.log('Translation test - "dashboard":', t('dashboard'));
console.log('Translation test - "readyToDeliver":', t('readyToDeliver'));

const isOnline = ref(true);
const todayDeliveries = ref(12);
const todayEarnings = ref(145.5);

const deliverySteps = ref([
	{ label: 'accepted', icon: 'ri-check-line', completed: false },
	{ label: 'pickedUp', icon: 'ri-shopping-bag-line', completed: false },
	{ label: 'onTheWay', icon: 'ri-truck-line', completed: false },
	{ label: 'delivered', icon: 'ri-map-pin-line', completed: false },
]);

const insights = ref([
    t('insight1'),
    t('insight2'),
    t('insight3'),
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
        change: t('changeFromYesterday', { value: 3 }),  // Dynamic value
        icon: 'ri-truck-line text-blue-600 dark:text-blue-400 w-5 h-5',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
        label: 'earnings',
        value: '$145.5',
        change: t('changeEarnings', { amount: '12.50' }),  // Dynamic value
        icon: 'ri-money-dollar-circle-line text-green-600 dark:text-green-400 w-5 h-5',
        bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
        label: 'distanceStat',
        value: '45.2km',
        change: t('avgDistance', { distance: 3.8 }),  // Dynamic value
        icon: 'ri-map-pin-line text-orange-600 dark:text-orange-400 w-5 h-5',
        bg: 'bg-orange-100 dark:bg-orange-900/30',
    },
    {
        label: 'online',
        value: '8.5h',
        change: t('sinceTime', { time: '9:00 AM' }),  // Dynamic value
        icon: 'ri-time-line text-indigo-600 dark:text-indigo-400 w-5 h-5',
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    },
]);

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