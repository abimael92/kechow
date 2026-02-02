<template>
	<div class="space-y-6">
		<div class="bg-card rounded-xl shadow-sm border border-gray-100 p-6">
			<h3 class="text-lg font-bold text-gray-900 mb-6">
				{{ t('paymentMethods') }}
			</h3>

			<div class="space-y-4">
				<div
					v-for="method in paymentMethods"
					:key="method.name"
					class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
				>
					<div class="flex items-center">
						<i
							:class="[
								method.icon,
								method.iconColor,
								'text-2xl mr-3 w-6 h-6 flex items-center justify-center',
							]"
						></i>
						<div>
							<p class="font-medium text-gray-900">{{ t(method.name) }}</p>
							<p class="text-sm text-gray-500">{{ t(method.description) }}</p>
						</div>
					</div>
					<input
						type="checkbox"
						class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
						checked
					/>
				</div>
			</div>
		</div>

		<div class="bg-card rounded-xl shadow-sm border border-gray-100 p-6">
			<h3 class="text-lg font-bold text-gray-900 mb-6">
				{{ t('taxSettings') }}
			</h3>

			<div class="grid md:grid-cols-2 gap-6">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">{{
						t('taxRate')
					}}</label>
					<input
						type="number"
						step="0.1"
						value="8.5"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
					/>
				</div>

				<div class="flex items-center">
					<input
						type="checkbox"
						class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mr-3"
						checked
					/>
					<span class="text-gray-700">{{ t('includeTax') }}</span>
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

const paymentMethods = [
	{
		name: 'creditDebitCards',
		description: 'supportedCards',
		icon: 'ri-bank-card-line',
		iconColor: 'text-blue-600',
	},
	{
		name: 'paypal',
		description: 'paypalDescription',
		icon: 'ri-paypal-line',
		iconColor: 'text-blue-600',
	},
	{
		name: 'cashOnDelivery',
		description: 'cashOnDeliveryDescription',
		icon: 'ri-money-dollar-circle-line',
		iconColor: 'text-green-600',
	},
];
</script>
