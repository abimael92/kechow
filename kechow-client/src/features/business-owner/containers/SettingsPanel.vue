<template>
	<div class="space-y-6">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">{{ $t('settings') }}</h1>
			<p class="text-black font-thin text-lg mt-1">
				{{ $t('manageRestaurantSettings') }}
			</p>
		</div>

		<div class="flex flex-col lg:flex-row gap-8">
			<!-- Sidebar Navigation -->
			<div class="lg:w-1/4">
				<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
					<nav class="space-y-1">
						<button
							v-for="tab in tabs"
							:key="tab.id"
							@click="activeTab = tab.id"
							:class="[
								'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer',
								activeTab === tab.id
									? 'bg-orange-50 text-orange-600 border border-orange-200'
									: 'text-gray-300 hover:bg-gray-50',
							]"
						>
							<i
								:class="tab.icon"
								class="mr-3 w-5 h-5 flex items-center justify-center"
							></i>
							{{ $t(tab.label) }}
						</button>
					</nav>
				</div>
			</div>

			<!-- Main Content -->
			<div class="lg:w-3/4">
				<div class="space-y-6">
					<GeneralSettings v-if="activeTab === 'general'" />
					<MenuSettings v-if="activeTab === 'menu'" />
					<DeliverySettings v-if="activeTab === 'delivery'" />
					<NotificationSettings v-if="activeTab === 'notifications'" />
					<PaymentSettings v-if="activeTab === 'payments'" />
					<StaffSettings v-if="activeTab === 'staff'" />
				</div>

				<div
					v-if="activeTab === 'general'"
					class="flex justify-end space-x-4 mt-6"
				>
					<button
						class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
					>
						{{ $t('cancel') }}
					</button>
					<button
						class="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
					>
						{{ $t('saveChanges') }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GeneralSettings from '../components/settings/GeneralSettings.vue';
import MenuSettings from '../components/settings/MenuSettings.vue';
import DeliverySettings from '../components/settings/DeliverySettings.vue';
import NotificationSettings from '../components/settings/NotificationSettings.vue';
import PaymentSettings from '../components/settings/PaymentSettings.vue';
import StaffSettings from '../components/settings/StaffSettings.vue';

const activeTab = ref('general');

const tabs = [
	{ id: 'general', label: 'general', icon: 'ri-settings-line' },
	{ id: 'menu', label: 'menuSettings', icon: 'ri-restaurant-line' },
	{ id: 'delivery', label: 'delivery', icon: 'ri-truck-line' },
	{ id: 'notifications', label: 'notifications', icon: 'ri-notification-line' },
	{ id: 'payments', label: 'payments', icon: 'ri-money-dollar-circle-line' },
	{ id: 'staff', label: 'staff', icon: 'ri-team-line' },
];
</script>
