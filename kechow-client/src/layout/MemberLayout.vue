<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/store/user.store';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';

const userStore = useUserStore();
const role = computed(() => userStore.user?.role || 'guest');

// Define role-based menus
const menuLinks = computed(() => {
	switch (role.value) {
		case 'owner':
			return [
				{ name: 'Dashboard', to: '/owner/dashboard' },
				{ name: 'Orders', to: '/owner/orders' },
				{ name: 'Menu', to: '/owner/menu' },
			];
		case 'delivery':
			return [{ name: 'My Deliveries', to: '/delivery/orders' }];
		case 'member':
			return [
				{ name: 'Home', to: '/' },
				{ name: 'Restaurants', to: '/restaurants' },
				{ name: 'Cart', to: '/cart' },
			];
		default:
			return [
				{ name: 'Home', to: '/' },
				{ name: 'Login', to: '/login' },
				{ name: 'Register', to: '/register' },
			];
	}
});
</script>

<template>
	<div class="min-h-screen flex flex-col">
		<!-- Header -->
		<Header :links="menuLinks" />

		<!-- Main content -->
		<main class="flex-1 p-4">
			<RouterView />
		</main>

		<!-- Footer -->
		<Footer />
	</div>
</template>
