<template>
	<div class="p-6">
		<DashboardOverview />
	</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/store/auth/auth.store';
import DashboardOverview from '@/features/business-owner/components/DashboardOverview.vue';

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
