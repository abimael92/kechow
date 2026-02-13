<template>
	<div ">
		<OrderPanel />
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/app/store/auth/auth.store';
import OrderPanel from '@/features/customer/containers/OrdersPanel.vue';

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
