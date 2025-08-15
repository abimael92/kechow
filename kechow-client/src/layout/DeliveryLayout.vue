<template>
	<div
		class="flex flex-col min-h-screen bg-gradient-to-br from-[#4476b6] via-[#a9c4d4] to-[#73b4e8] text-white"
	>
		<nav
			class="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#1a2a40] shadow-soft"
		>
			<h1 class="text-3xl font-bold">Kechow Delivery</h1>
			<div class="flex gap-4">
				<router-link to="/delivery/orders">Orders</router-link>
				<router-link to="/delivery/history">History</router-link>
				<button @click="logout">Logout</button>
			</div>
		</nav>

		<main class="flex-1 p-6">
			<transition name="fade-slide" mode="out-in">
				<router-view />
			</transition>
		</main>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/auth.store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
function logout() {
	authStore.logout();
	router.push('/');
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
	transition: all 0.3s ease;
}
.fade-slide-enter-from {
	opacity: 0;
	transform: translateY(10px);
}
.fade-slide-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>
