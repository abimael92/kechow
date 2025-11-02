<template>
	<div class="space-y-6 p-4 sm:p-6">
		<!-- Online Toggle -->
		<div
			class="bg-white rounded-xl border p-4 flex justify-between items-center shadow-sm"
		>
			<div>
				<h3 class="font-bold text-gray-900">Availability</h3>
				<p class="text-sm text-white">
					You are currently
					<span :class="isOnline ? 'text-green-600' : 'text-red-600'">
						{{ isOnline ? 'Online' : 'Offline' }}
					</span>
				</p>
			</div>
			<button
				@click="isOnline = !isOnline"
				:class="
					isOnline
						? 'bg-red-600 hover:bg-red-700'
						: 'bg-green-600 hover:bg-green-700'
				"
				class="px-4 py-2 text-white rounded-lg font-medium transition-colors"
			>
				{{ isOnline ? 'Go Offline' : 'Go Online' }}
			</button>
		</div>

		<!-- Today and Weekly Summary Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Work Summary -->
			<div class="bg-white rounded-xl border p-4 shadow-sm">
				<h4 class="font-semibold text-gray-800">Today's Summary</h4>
				<div class="grid grid-cols-3 text-center mt-4">
					<div>
						<p class="text-lg font-bold">{{ hoursWorked }}</p>
						<p class="text-xs text-gray-500">Hours Online</p>
					</div>
					<div>
						<p class="text-lg font-bold">{{ deliveries }}</p>
						<p class="text-xs text-gray-500">Deliveries</p>
					</div>
					<div>
						<p class="text-lg font-bold">${{ earnings }}</p>
						<p class="text-xs text-gray-500">Earnings</p>
					</div>
				</div>
			</div>

			<!-- Weekly Summary -->
			<div class="bg-white rounded-xl border p-4 shadow-sm">
				<h4 class="font-semibold text-gray-800">This Week</h4>
				<div class="grid grid-cols-3 text-center mt-4">
					<div>
						<p class="text-lg font-bold">{{ weekly.hours }}</p>
						<p class="text-xs text-gray-500">Hours</p>
					</div>
					<div>
						<p class="text-lg font-bold">{{ weekly.deliveries }}</p>
						<p class="text-xs text-gray-500">Deliveries</p>
					</div>
					<div>
						<p class="text-lg font-bold">${{ weekly.earnings }}</p>
						<p class="text-xs text-gray-500">Earnings</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Daily Breakdown -->
		<div class="bg-white rounded-xl border p-4 shadow-sm">
			<h4 class="font-semibold mb-3 text-gray-800">Daily Breakdown</h4>
			<ul class="divide-y text-sm">
				<li
					v-for="day in history"
					:key="day.date"
					class="flex justify-between py-2"
				>
					<span class="text-white">{{ day.date }}</span>
					<span class="text-gray-900"
						>{{ day.hours }}h / {{ day.deliveries }} deliveries / ${{
							day.earnings
						}}</span
					>
				</li>
			</ul>
		</div>

		<!-- Insights -->
		<div class="bg-white rounded-xl border p-4 shadow-sm">
			<h4 class="font-semibold text-gray-800 mb-2">Best Times to Work</h4>
			<p class="text-sm text-white mb-3">Based on last 7 days</p>
			<!-- chart placeholder -->
			<div
				class="h-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400"
			>
				[Chart: busiest hours]
			</div>
		</div>

		<!-- Schedule & Days Off -->
		<div class="bg-white rounded-xl border p-4 shadow-sm">
			<h4 class="font-semibold text-gray-800 mb-3">Schedule & Days Off</h4>
			<ul class="space-y-2">
				<li
					v-for="(day, i) in daysOff"
					:key="i"
					class="flex justify-between bg-gray-50 p-2 rounded-lg"
				>
					<span>{{ day }}</span>
					<button
						@click="removeDayOff(i)"
						class="text-red-600 text-xs hover:text-red-800 transition-colors"
					>
						Remove
					</button>
				</li>
			</ul>
			<button
				@click="addDayOff"
				class="mt-2 text-blue-600 text-sm hover:text-blue-800 transition-colors"
			>
				+ Add Day Off
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isOnline = ref(false);
const hoursWorked = 5;
const deliveries = 12;
const earnings = 56;

const daysOff = ref<string[]>(['2025-09-15']);

const weekly = { hours: 32, deliveries: 54, earnings: 450 };

const history = [
	{ date: 'Mon 8 Sep', hours: 6, deliveries: 9, earnings: 85 },
	{ date: 'Tue 9 Sep', hours: 5, deliveries: 8, earnings: 70 },
	{ date: 'Wed 10 Sep', hours: 7, deliveries: 11, earnings: 95 },
];

function addDayOff() {
	daysOff.value.push(new Date().toISOString().slice(0, 10));
}

function removeDayOff(i: number) {
	daysOff.value.splice(i, 1);
}
</script>
