<template>
	<div class="p-6">
		<CartPanel />
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/app/store/auth/auth.store';
import CartPanel from '@/features/customer/containers/CartPanel.vue';

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
