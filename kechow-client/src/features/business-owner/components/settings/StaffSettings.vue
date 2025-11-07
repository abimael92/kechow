<template>
	<div class="space-y-6">
		<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
			<div class="flex justify-between items-center mb-6">
				<h3 class="text-lg font-bold text-gray-900">
					{{ t('staffManagement') }}
				</h3>
				<button
					class="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
				>
					<i
						class="ri-add-line mr-2 w-4 h-4 flex items-center justify-center inline"
					></i>
					{{ t('addStaff') }}
				</button>
			</div>

			<div class="space-y-4">
				<div
					v-for="member in staff"
					:key="member.email"
					class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
				>
					<div class="flex items-center">
						<div
							:class="[
								'w-10 h-10 rounded-full flex items-center justify-center mr-3',
								member.color,
							]"
						>
							<i
								class="ri-user-line w-5 h-5 flex items-center justify-center"
								:class="member.iconColor"
							></i>
						</div>
						<div>
							<p class="font-medium text-gray-900">{{ member.name }}</p>
							<p class="text-sm text-gray-500">
								{{ t(member.role) }} • {{ member.email }}
							</p>
						</div>
					</div>
					<span :class="member.statusClass">{{ t(member.status) }}</span>
				</div>
			</div>
		</div>

		<div class="flex justify-end space-x-4">
			<button
				class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
			>
				{{ t('cancel') }}
			</button>
			<button
				class="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
			>
				{{ t('saveChanges') }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const staff = [
	{
		name: 'Mario Rossi',
		role: 'owner',
		email: 'mario@marioskitchen.com',
		status: 'active',
		color: 'bg-orange-100',
		iconColor: 'text-orange-600',
		statusClass:
			'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium',
	},
	{
		name: 'Anna Smith',
		role: 'manager',
		email: 'anna@marioskitchen.com',
		status: 'active',
		color: 'bg-blue-100',
		iconColor: 'text-blue-600',
		statusClass:
			'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium',
	},
	{
		name: 'John Chef',
		role: 'kitchenStaff',
		email: 'john@marioskitchen.com',
		status: 'pending',
		color: 'bg-purple-100',
		iconColor: 'text-purple-600',
		statusClass:
			'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium',
	},
];
</script>
