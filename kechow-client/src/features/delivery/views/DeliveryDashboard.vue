<template>
	<div class="min-w-0 overflow-x-hidden p-4 sm:p-6">
		<DashboardOverview />
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/app/store/auth/auth.store';
import DashboardOverview from '@/features/delivery/components/DashboardOverview.vue';

const authStore = useAuthStore();

onMounted(() => {
	console.log('Dashboard mounted - auth state:', {
		isAuthenticated: authStore.isAuthenticated,
		isOwner: authStore.isOwner,
		user: authStore.user,
		token: authStore.token,
	});
});
</script>
