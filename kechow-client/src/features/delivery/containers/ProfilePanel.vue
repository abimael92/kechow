<template>
	<div class="space-y-6 p-4 sm:p-6">
		<!-- Header -->
		<div class="space-y-1">
			<h1 class="text-2xl font-bold text-gray-900">
				{{ $t('profileAndSettings') }}
			</h1>
			<p class="text-gray-600 text-sm sm:text-base">
				{{ $t('manageAccountPreferences') }}
			</p>
		</div>

		<!-- Profile Card -->
		<div
			class="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-6"
		>
			<div
				class="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 w-full md:w-auto"
			>
				<div
					class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center"
				>
					<i class="ri-user-line text-white text-3xl"></i>
				</div>
				<div class="flex-1 min-w-0 text-center sm:text-left">
					<h3 class="text-lg sm:text-xl font-bold text-gray-900 truncate">
						{{ authStore.user?.name || 'John Doe' }}
					</h3>
					<p class="text-gray-600 text-sm truncate">
						{{ authStore.user?.email || 'johndoe@example.com' }}
					</p>
					<div
						class="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2 text-sm text-gray-600"
					>
						<div class="flex items-center gap-1">
							<i
								v-for="n in 5"
								:key="n"
								class="ri-star-fill text-yellow-400 w-3 h-3"
							></i>
							<span>{{ $t('rating') }}</span>
						</div>
						<span>•</span>
						<span>{{ $t('deliveriesCount', { count: 1247 }) }}</span>
						<span>•</span>
						<span>{{ $t('memberSince', { date: 'March 2023' }) }}</span>
					</div>
				</div>
			</div>
			<button
				class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto mt-4 md:mt-0"
			>
				{{ $t('editProfile') }}
			</button>
		</div>

		<!-- Tabs -->
		<div class="border-b border-gray-200 overflow-x-auto">
			<div class="flex space-x-1 sm:space-x-2 w-max flex-nowrap snap-x">
				<button
					v-for="tab in tabs"
					:key="tab.id"
					@click="activeTab = tab.id"
					:class="[
						'flex items-center space-x-1 sm:space-x-2 py-3 px-4 sm:px-6 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer transition-colors snap-start',
						activeTab === tab.id
							? 'border-blue-600 text-blue-600 bg-blue-50'
							: 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50',
					]"
				>
					<i :class="tab.icon" class="w-4 h-4 sm:w-5 sm:h-5"></i>
					<span>{{ $t(tab.label) }}</span>
				</button>
			</div>
		</div>

		<!-- Tab Content -->
		<div
			class="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm space-y-4"
		>
			<transition name="fade" mode="out-in">
				<component :is="getTabComponent(activeTab)" :key="activeTab" />
			</transition>
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

function getTabComponent(tabId: string) {
	switch (tabId) {
		case 'profile':
			return ProfileInfo;
		case 'vehicle':
			return VehicleInfo;
		case 'schedule':
			return ScheduleInfo;
		case 'notifications':
			return NotificationsSettings;
		case 'support':
			return SupportInfo;
		default:
			return ProfileInfo;
	}
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
