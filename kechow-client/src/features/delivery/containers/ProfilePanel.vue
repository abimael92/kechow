<template>
	<div class="space-y-6 p-6">
		<!-- Header -->
		<div class="space-y-2">
			<h1 class="text-2xl font-bold text-gray-900">
				{{ $t('profileAndSettings') }}
			</h1>
			<p class="text-gray-600">{{ $t('manageAccountPreferences') }}</p>
		</div>

		<!-- Profile Card -->
		<div
			class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-center justify-between"
		>
			<div class="flex items-center space-x-6">
				<div
					class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center"
				>
					<i
						class="ri-user-line text-white text-3xl w-12 h-12 flex items-center justify-center"
					></i>
				</div>
				<div class="flex-1">
					<h3 class="text-xl font-bold text-gray-900">
						{{ authStore.user?.name }}
					</h3>
					<p class="text-gray-600">{{ authStore.user?.email }}</p>
					<div class="flex items-center space-x-4 mt-2 text-sm text-gray-600">
						<div class="flex items-center space-x-1">
							<i
								v-for="n in 5"
								:key="n"
								class="ri-star-fill text-yellow-400 w-3 h-3 flex items-center justify-center"
							></i>
							<span class="ml-1">{{ $t('rating') }}</span>
						</div>
						<span>•</span>
						<span>{{ $t('deliveriesCount', { count: 1247 }) }}</span>
						<span>•</span>
						<span>{{ $t('memberSince', { date: 'March 2023' }) }}</span>
					</div>
				</div>
			</div>
			<button
				class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
			>
				{{ $t('editProfile') }}
			</button>
		</div>

		<!-- Tabs -->
		<div class="border-b border-gray-200 overflow-x-auto">
			<div class="flex space-x-0">
				<button
					v-for="tab in tabs"
					:key="tab.id"
					@click="activeTab = tab.id"
					:class="[
						'flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer',
						activeTab === tab.id
							? 'border-blue-600 text-blue-600 bg-blue-50'
							: 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50',
					]"
				>
					<i
						:class="tab.icon"
						class="w-4 h-4 flex items-center justify-center"
					></i>
					<span>{{ $t(tab.label) }}</span>
				</button>
			</div>
		</div>

		<!-- Tab Content -->
		<div
			class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6"
		>
			<ProfileInfo v-if="activeTab === 'profile'" />
			<VehicleInfo v-if="activeTab === 'vehicle'" />
			<ScheduleInfo v-if="activeTab === 'schedule'" />
			<NotificationsSettings v-if="activeTab === 'notifications'" />
			<SupportInfo v-if="activeTab === 'support'" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/app/store/auth/auth.store';
import ProfileInfo from '../components/profile/ProfileInfo.vue';
import VehicleInfo from '../components/profile/VehicleInfo.vue';
import ScheduleInfo from '../components/profile/ScheduleInfo.vue';
import NotificationsSettings from '../components/profile/NotificationsSettings.vue';
import SupportInfo from '../components/profile/SupportInfo.vue';

const authStore = useAuthStore();
const activeTab = ref('profile');

const tabs = [
	{ id: 'profile', label: 'profile', icon: 'ri-user-line' },
	{ id: 'vehicle', label: 'vehicle', icon: 'ri-bike-line' },
	{ id: 'schedule', label: 'schedule', icon: 'ri-calendar-line' },
	{ id: 'notifications', label: 'notifications', icon: 'ri-notification-line' },
	{ id: 'support', label: 'support', icon: 'ri-customer-service-line' },
];
</script>
