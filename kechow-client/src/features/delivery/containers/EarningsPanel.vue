<template>
	<div class="space-y-6">
		<!-- Header -->
		<div class="flex justify-between items-center">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Earnings</h1>
				<p class="text-gray-600 mt-1">
					Track your delivery earnings and payments
				</p>
			</div>
			<div class="flex bg-gray-100 rounded-lg p-1">
				<button
					class="px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
					:class="
						period === 'week'
							? 'bg-white text-gray-900 shadow-sm'
							: 'text-gray-600 hover:text-gray-900'
					"
					@click="period = 'week'"
				>
					This Week
				</button>
				<button
					class="px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
					:class="
						period === 'month'
							? 'bg-white text-gray-900 shadow-sm'
							: 'text-gray-600 hover:text-gray-900'
					"
					@click="period = 'month'"
				>
					This Month
				</button>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
			<div
				v-for="card in statsCards"
				:key="card.title"
				class="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm">{{ card.title }}</p>
						<p class="text-3xl font-bold text-gray-900">{{ card.value }}</p>
						<p :class="['text-sm mt-1', card.changeColor]">{{ card.change }}</p>
					</div>
					<div
						:class="`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`"
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
		<div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
			<h3 class="text-lg font-semibold text-gray-900 mb-6">Earnings Trend</h3>
			<LineChart :chart-data="trendChartData" :chart-options="chartOptions" />
		</div>

		<!-- Earnings Breakdown -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
				<h3 class="text-lg font-semibold text-gray-900 mb-6">
					Earnings Breakdown
				</h3>
				<PieChart
					:chart-data="breakdownChartData"
					:chart-options="chartOptions"
				/>
			</div>
		</div>

		<!-- Payment History -->
		<div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
			<div class="flex justify-between items-center mb-6">
				<h3 class="text-lg font-semibold text-gray-900">Payment History</h3>
				<button
					class="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
				>
					View All
				</button>
			</div>
			<div class="space-y-4">
				<div
					v-for="(payout, index) in payouts"
					:key="index"
					class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
				>
					<div class="flex items-center space-x-4">
						<div
							class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
						>
							<CurrencyDollarIcon class="text-green-600 w-5 h-5" />
						</div>
						<div>
							<p class="font-medium text-gray-900">{{ payout.title }}</p>
							<p class="text-sm text-gray-600">{{ payout.date }}</p>
						</div>
					</div>
					<div class="text-right">
						<p class="font-bold text-green-600">${{ payout.amount }}</p>
						<span
							class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
						>
							{{ payout.status }}
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Action Buttons -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
			<button
				class="bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
			>
				<div class="text-center">
					<CurrencyDollarIcon
						class="text-blue-600 text-2xl mb-2 w-8 h-8 mx-auto"
					/>
					<p class="font-medium text-gray-900">Download Report</p>
					<p class="text-sm text-gray-500">Export earnings data</p>
				</div>
			</button>

			<button
				class="bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
			>
				<div class="text-center">
					<BadgeCheckIcon
						class="text-green-600 text-2xl mb-2 w-8 h-8 mx-auto"
					/>
					<p class="font-medium text-gray-900">Payment Methods</p>
					<p class="text-sm text-gray-500">Manage bank accounts</p>
				</div>
			</button>

			<button
				class="bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
			>
				<div class="text-center">
					<CalculatorIcon
						class="text-purple-600 text-2xl mb-2 w-8 h-8 mx-auto"
					/>
					<p class="font-medium text-gray-900">Tax Documents</p>
					<p class="text-sm text-gray-500">1099 forms & receipts</p>
				</div>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
import { Chart as VueChart, Line, Pie } from 'vue-chartjs';

// Heroicons
import {
	CurrencyDollarIcon,
	TruckIcon,
	ClockIcon,
	StarIcon,
	CalculatorIcon,
	BadgeCheckIcon,
} from '@heroicons/vue/outline';

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

const period = ref('week');

const statsCards = [
	{
		title: 'Total Earnings',
		value: '$557.00',
		change: '+12.5% from last week',
		changeColor: 'text-green-600',
		icon: CurrencyDollarIcon,
		iconColor: 'text-green-600',
		bgColor: 'bg-green-100',
	},
	{
		title: 'Deliveries',
		value: '51',
		change: 'Avg $10.92 per order',
		changeColor: 'text-blue-600',
		icon: TruckIcon,
		iconColor: 'text-blue-600',
		bgColor: 'bg-blue-100',
	},
	{
		title: 'Hours Online',
		value: '40.0h',
		change: '$13.93/hr',
		changeColor: 'text-purple-600',
		icon: ClockIcon,
		iconColor: 'text-purple-600',
		bgColor: 'bg-purple-100',
	},
	{
		title: 'Avg Rating',
		value: '4.9',
		change: '',
		changeColor: '',
		icon: StarIcon,
		iconColor: 'text-yellow-600',
		bgColor: 'bg-yellow-100',
	},
];

// Earnings Trend Data
const trendChartData = {
	labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
	datasets: [
		{
			label: 'Earnings',
			data: [50, 75, 60, 90, 120, 80, 100],
			fill: true,
			backgroundColor: 'rgba(59, 130, 246, 0.3)',
			borderColor: '#3B82F6',
			tension: 0.4,
		},
	],
};
const payouts = [
	{
		title: 'Weekly Payout',
		date: '2024-01-15',
		amount: 245.5,
		status: 'Completed',
	},
	{
		title: 'Weekly Payout',
		date: '2024-01-08',
		amount: 198.75,
		status: 'Completed',
	},
	{
		title: 'Weekly Payout',
		date: '2024-01-01',
		amount: 267.25,
		status: 'Completed',
	},
	{
		title: 'Weekly Payout',
		date: '2023-12-25',
		amount: 189.5,
		status: 'Completed',
	},
];

// Earnings Breakdown Data
const breakdownChartData = {
	labels: ['Delivery Fees', 'Tips', 'Bonuses', 'Peak Hour'],
	datasets: [
		{
			data: [245.5, 178.25, 67, 89.25],
			backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
		},
	],
};

const chartOptions = {
	responsive: true,
	plugins: {
		legend: { position: 'bottom' },
	},
};

// // Use VueChart components directly
// const LineChart = (props: any) => <Line {...props} />;
// const PieChart = (props: any) => <Pie {...props} />;
</script>

<style scoped>
/* Optional custom styling */
</style>
