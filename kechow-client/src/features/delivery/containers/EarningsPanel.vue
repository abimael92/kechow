<template>
	<div class="space-y-6 px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div
			class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
		>
			<div class="flex items-center gap-2 sm:gap-3 md:gap-4">
				<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
					<i class="ri-money-dollar-circle-line text-white text-lg sm:text-xl md:text-2xl"></i>
				</div>
				<div>
					<h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-snug">
						Ganancias
					</h1>
					<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none">
						Sigue tus ganancias y pagos de entregas
					</p>
				</div>
			</div>
			<div class="flex flex-wrap bg-gray-100 rounded-lg p-1 gap-1">
				<button
					class="px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
					:class="
						period === 'week'
							? 'bg-white text-gray-900 shadow-sm'
							: 'text-gray-600 hover:text-gray-900'
					"
					@click="
						period = 'week';
						updateStats('week');
					"
				>
					{{ $t('thisWeek') }}
				</button>
				<button
					class="px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
					:class="
						period === 'month'
							? 'bg-white text-gray-900 shadow-sm'
							: 'text-gray-600 hover:text-gray-900'
					"
					@click="
						period = 'month';
						updateStats('month');
					"
				>
					{{ $t('thisMonth') }}
				</button>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
			<div
				v-for="card in statsCards"
				:key="card.titleKey"
				class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 min-w-0"
			>
				<div class="flex items-center justify-between">
					<div class="min-w-0">
						<p class="text-gray-600 text-sm sm:text-base truncate">
							{{ $t(card.titleKey) }}
						</p>
						<p class="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
							{{ card.value }}
						</p>
						<p :class="['text-sm mt-1 truncate', card.changeColor]">
							{{ card.change }}
						</p>
					</div>
					<div
						:class="`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`"
					>
						<component
							:is="card.icon"
							class="w-6 h-6"
							:class="card.iconColor"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Earnings Trend -->
		<div
			class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 w-full overflow-x-auto"
		>
			<h3 class="text-lg font-semibold text-gray-900 mb-6">
				{{ $t('earningsTrend') }}
			</h3>
			<LineChart :chart-data="trendChartData" :chart-options="chartOptions" v-if="deliveryStore.earningsSummary" />
			<div v-else class="text-center py-8 text-gray-500">
				<i class="ri-line-chart-line text-4xl mb-2"></i>
				<p>{{ t('noDataAvailable') }}</p>
			</div>
		</div>

		<!-- Earnings Breakdown -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<div
				class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 w-full overflow-x-auto"
			>
				<h3 class="text-lg font-semibold text-gray-900 mb-6">
					{{ $t('earningsBreakdown') }}
				</h3>
				<PieChart
					:chart-data="breakdownChartData"
					:chart-options="chartOptions"
				/>
			</div>
		</div>

		<!-- Payment History -->
		<div
			class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100"
		>
			<div class="flex justify-between items-center mb-6">
				<h3 class="text-lg font-semibold text-gray-900">
					{{ $t('paymentHistory') }}
				</h3>
				<button
					class="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
				>
					{{ $t('viewAll') }}
				</button>
			</div>
			<div class="space-y-4">
				<div
					v-for="(payout, index) in payouts"
					:key="index"
					class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
				>
					<div class="flex items-center space-x-4 min-w-0">
						<div
							class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
						>
							<CurrencyDollarIcon class="text-green-600 w-5 h-5" />
						</div>
						<div class="truncate">
							<p class="font-medium text-gray-900 truncate">
								{{ payout.title }}
							</p>
							<p class="text-sm text-gray-600 truncate">{{ payout.date }}</p>
						</div>
					</div>
					<div class="text-right min-w-0">
						<p class="font-bold text-green-600">${{ payout.amount }}</p>
						<span
							class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
						>
							{{ $t(payout.status.toLowerCase()) }}
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Action Buttons -->
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
			<button
				class="bg-white border border-primary-300 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
			>
				<div class="text-center">
					<CurrencyDollarIcon
						class="text-blue-600 text-2xl mb-2 w-8 h-8 mx-auto"
					/>
					<p class="font-medium text-gray-900">{{ $t('downloadReport') }}</p>
					<p class="text-sm text-gray-500">{{ $t('exportEarningsData') }}</p>
				</div>
			</button>
			<button
				class="bg-white border border-primary-300 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
			>
				<div class="text-center">
					<BadgeCheckIcon
						class="text-green-600 text-2xl mb-2 w-8 h-8 mx-auto"
					/>
					<p class="font-medium text-gray-900">{{ $t('paymentMethods') }}</p>
					<p class="text-sm text-gray-500">{{ $t('manageBankAccounts') }}</p>
				</div>
			</button>
			<button
				class="bg-white border border-primary-300 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
			>
				<div class="text-center">
					<CalculatorIcon
						class="text-purple-600 text-2xl mb-2 w-8 h-8 mx-auto"
					/>
					<p class="font-medium text-gray-900">{{ $t('taxDocuments') }}</p>
					<p class="text-sm text-gray-500">{{ $t('taxFormsReceipts') }}</p>
				</div>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Filler,
} from 'chart.js';
import { Line, Pie } from 'vue-chartjs';
import {
	CurrencyDollarIcon,
	TruckIcon,
	ClockIcon,
	StarIcon,
	CalculatorIcon,
	BadgeCheckIcon,
} from '@heroicons/vue/outline';
import { useDeliveryStore } from '../store/delivery.store';

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Filler
);

const { t } = useI18n();
const deliveryStore = useDeliveryStore();
const period = ref('week');

// Load earnings on mount
onMounted(async () => {
	await deliveryStore.initialize();
	await deliveryStore.loadEarningsSummary();
});

// Stats cards from earnings summary
const statsCards = computed(() => {
	const earnings = deliveryStore.earningsSummary;
	if (!earnings) {
		return [
			{
				titleKey: 'totalEarnings',
				value: '$0.00',
				change: t('noData'),
				changeColor: 'text-gray-600',
				icon: CurrencyDollarIcon,
				iconColor: 'text-gray-600',
				bgColor: 'bg-gray-100',
			},
			{
				titleKey: 'deliveries',
				value: '0',
				change: t('noData'),
				changeColor: 'text-gray-600',
				icon: TruckIcon,
				iconColor: 'text-gray-600',
				bgColor: 'bg-gray-100',
			},
			{
				titleKey: 'hoursOnline',
				value: '0h',
				change: t('noData'),
				changeColor: 'text-gray-600',
				icon: ClockIcon,
				iconColor: 'text-gray-600',
				bgColor: 'bg-gray-100',
			},
			{
				titleKey: 'avgRating',
				value: '0.0',
				change: '',
				changeColor: '',
				icon: StarIcon,
				iconColor: 'text-gray-600',
				bgColor: 'bg-gray-100',
			},
		];
	}

	const selectedPeriod = period.value === 'week' ? earnings.week : earnings.month;

	return [
		{
			titleKey: 'totalEarnings',
			value: `$${selectedPeriod.earnings.toFixed(2)}`,
			change: t('changeFromLastWeek', { value: '0%' }),
			changeColor: 'text-green-600',
			icon: CurrencyDollarIcon,
			iconColor: 'text-green-600',
			bgColor: 'bg-green-100',
		},
		{
			titleKey: 'deliveries',
			value: selectedPeriod.deliveries.toString(),
			change: t('avgPerOrder', { value: `$${earnings.averagePerDelivery.toFixed(2)}` }),
			changeColor: 'text-blue-600',
			icon: TruckIcon,
			iconColor: 'text-blue-600',
			bgColor: 'bg-blue-100',
		},
		{
			titleKey: 'hoursOnline',
			value: `${selectedPeriod.hours.toFixed(1)}h`,
			change: t('ratePerHour', {
				value: `$${(
					selectedPeriod.earnings / selectedPeriod.hours || 0
				).toFixed(2)}`,
			}),
			changeColor: 'text-purple-600',
			icon: ClockIcon,
			iconColor: 'text-purple-600',
			bgColor: 'bg-purple-100',
		},
		{
			titleKey: 'avgRating',
			value: '4.9',
			change: '',
			changeColor: '',
			icon: StarIcon,
			iconColor: 'text-yellow-600',
			bgColor: 'bg-yellow-100',
		},
	];
});

const payouts = [
	{
		title: t('weeklyPayout'),
		date: '2024-01-15',
		amount: 245.5,
		status: 'completed',
	},
	{
		title: t('weeklyPayout'),
		date: '2024-01-08',
		amount: 198.75,
		status: 'completed',
	},
	{
		title: t('weeklyPayout'),
		date: '2024-01-01',
		amount: 267.25,
		status: 'completed',
	},
	{
		title: t('weeklyPayout'),
		date: '2023-12-25',
		amount: 189.5,
		status: 'completed',
	},
];

const trendChartData = computed(() => {
	const earnings = deliveryStore.earningsSummary;
	return {
		labels: [
			t('dayMon'),
			t('dayTue'),
			t('dayWed'),
			t('dayThu'),
			t('dayFri'),
			t('daySat'),
			t('daySun'),
		],
		datasets: [
			{
				label: t('earnings'),
				data: earnings
					? [
							earnings.week.earnings * 0.1,
							earnings.week.earnings * 0.15,
							earnings.week.earnings * 0.12,
							earnings.week.earnings * 0.18,
							earnings.week.earnings * 0.24,
							earnings.week.earnings * 0.16,
							earnings.week.earnings * 0.2,
					  ]
					: [0, 0, 0, 0, 0, 0, 0],
				fill: true,
				backgroundColor: 'rgba(59, 130, 246, 0.3)',
				borderColor: '#3B82F6',
				tension: 0.4,
			},
		],
	};
});

const breakdownChartData = {
	labels: [t('deliveryFees'), t('tips'), t('bonuses'), t('peakHour')],
	datasets: [
		{
			data: [245.5, 178.25, 67, 89.25],
			backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
		},
	],
};

const chartOptions = {
	responsive: true,
	plugins: { legend: { position: 'bottom' } },
};

const updateStats = async (selected: string) => {
	period.value = selected;
	await deliveryStore.loadEarningsSummary();
};
</script>
