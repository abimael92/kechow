<template>
	<div
		class="flex min-h-screen bg-gradient-to-br from-[#734ce8] via-[#a98dd4] to-[#6b4476] text-white font-sans"
	>
		<!-- Sidebar -->
		<aside class="hidden lg:flex flex-col w-64 bg-[#2a1a40] p-6 space-y-4">
			<img
				src="/images/kechow_logo.png"
				alt="Logo"
				class="w-16 h-16 object-contain animate-rushIn"
			/>
			<nav class="flex flex-col gap-2">
				<router-link
					to="/owner/dashboard"
					class="flex items-center gap-2 p-2 rounded hover:bg-purple-700"
					>📊 Dashboard</router-link
				>
				<router-link
					to="/owner/orders"
					class="flex items-center gap-2 p-2 rounded hover:bg-purple-700"
				>
					🛎 Pedidos
					<span
						v-if="notifications > 0"
						class="ml-auto bg-red-600 text-xs px-1 rounded"
						>{{ notifications }}</span
					>
				</router-link>
				<router-link
					to="/owner/menu"
					class="flex items-center gap-2 p-2 rounded hover:bg-purple-700"
					>🍲 Menú</router-link
				>
				<router-link
					to="/owner/reports"
					class="flex items-center gap-2 p-2 rounded hover:bg-purple-700"
					>📈 Reportes</router-link
				>
			</nav>
		</aside>

		<div class="flex-1 flex flex-col">
			<!-- Top Nav -->
			<nav
				class="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b border-white/10 shadow-soft bg-[#2a1a40]"
			>
				<h1 class="text-4xl font-bold text-gradient-pulse">Kechow Owner</h1>

				<div class="flex items-center gap-4">
					<!-- Dark Mode -->
					<button
						@click="toggleDarkMode"
						class="p-2 rounded hover:bg-purple-700"
					>
						<span v-if="isDark">🌙</span>
						<span v-else>☀️</span>
					</button>

					<!-- User Menu -->
					<div class="relative" @keydown.escape="closeUserMenu">
						<button
							@click="toggleUserMenu"
							class="p-1 rounded bg-gradient-to-r from-purple-400 to-purple-600"
						>
							<UserCircle class="w-7 h-7" />
							<span
								v-if="notifications > 0"
								class="absolute -top-1 -right-1 bg-red-600 w-4 h-4 text-xs rounded flex items-center justify-center"
								>{{ notifications }}</span
							>
						</button>
						<transition name="fade-scale">
							<ul
								v-if="userMenuOpen"
								class="absolute right-0 mt-2 w-40 bg-purple-700 rounded-xl shadow-lg text-white text-sm py-2"
							>
								<li>
									<button
										@click="goProfile"
										class="w-full px-4 py-2 hover:bg-purple-800 rounded"
									>
										Profile
									</button>
								</li>
								<li>
									<button
										@click="logout"
										class="w-full px-4 py-2 hover:bg-purple-800 rounded"
									>
										Logout
									</button>
								</li>
							</ul>
						</transition>
					</div>
				</div>
			</nav>

			<!-- Main Content -->
			<main class="flex-1 p-6 overflow-auto">
				<transition name="fade-slide" mode="out-in">
					<router-view />
				</transition>
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { UserCircle } from 'lucide-vue-next';
import { useAuthStore } from '@/features/auth/auth.store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const notifications = ref(3);
const userMenuOpen = ref(false);
const isDark = ref(localStorage.getItem('theme') === 'dark');

onMounted(() => {
	document.documentElement.classList.toggle('dark', isDark.value);
});

function toggleDarkMode() {
	isDark.value = !isDark.value;
	document.documentElement.classList.toggle('dark', isDark.value);
}

function toggleUserMenu() {
	userMenuOpen.value = !userMenuOpen.value;
}
function closeUserMenu() {
	userMenuOpen.value = false;
}
function goProfile() {
	alert('Go to profile');
	closeUserMenu();
}
function logout() {
	authStore.logout();
	router.push('/');
}
</script>

<style scoped>
.text-gradient-pulse {
	animation: pulseScaleMinimal 2.5s ease-in-out infinite;
}
@keyframes pulseScaleMinimal {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.03);
	}
}
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
.fade-scale-enter-active,
.fade-scale-leave-active {
	transition: all 0.2s ease;
	transform-origin: top right;
}
.fade-scale-enter-from {
	opacity: 0;
	transform: scale(0.95);
}
.fade-scale-leave-to {
	opacity: 0;
	transform: scale(0.95);
}
</style>
