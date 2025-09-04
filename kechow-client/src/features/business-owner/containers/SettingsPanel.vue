<template>
	<div class="space-y-6">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Settings</h1>
			<p class="text-gray-600 mt-1">
				Manage your restaurant settings and preferences
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
									: 'text-gray-700 hover:bg-gray-50',
							]"
						>
							<i
								:class="tab.icon"
								class="mr-3 w-5 h-5 flex items-center justify-center"
							></i>
							{{ tab.label }}
						</button>
					</nav>
				</div>
			</div>

			<!-- Main Content -->
			<div class="lg:w-3/4">
				<div class="space-y-6">
					<!-- General Settings -->
					<GeneralSettings v-if="activeTab === 'general'" />

					<!-- Menu Settings -->
					<MenuSettings v-if="activeTab === 'menu'" />

					<!-- Delivery Settings -->
					<DeliverySettings v-if="activeTab === 'delivery'" />

					<!-- Notification Settings -->
					<NotificationSettings v-if="activeTab === 'notifications'" />

					<!-- Payment Settings -->
					<PaymentSettings v-if="activeTab === 'payments'" />

					<!-- Staff Settings -->
					<StaffSettings v-if="activeTab === 'staff'" />
				</div>

				<div
					v-if="activeTab === 'general'"
					class="flex justify-end space-x-4 mt-6"
				>
					<button
						class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
					>
						Cancel
					</button>
					<button
						class="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
					>
						Save Changes
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
	{ id: 'general', label: 'General', icon: 'ri-settings-line' },
	{ id: 'menu', label: 'Menu Settings', icon: 'ri-restaurant-line' },
	{ id: 'delivery', label: 'Delivery', icon: 'ri-truck-line' },
	{ id: 'notifications', label: 'Notifications', icon: 'ri-notification-line' },
	{ id: 'payments', label: 'Payments', icon: 'ri-money-dollar-circle-line' },
	{ id: 'staff', label: 'Staff', icon: 'ri-team-line' },
];
</script>
