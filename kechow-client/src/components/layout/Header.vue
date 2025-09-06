<template>
	<!-- Top Nav -->
	<nav
		class="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b border-white/10 shadow-soft bg-[#2a1a40] text-white"
		role="navigation"
		aria-label="Primary Navigation"
	>
		<div class="flex items-center gap-3">
			<img
				src="/images/kechow_logo.png"
				alt="Kechow Logo"
				class="w-16 h-16 object-contain animate-rushIn animate-wiggle"
				role="img"
				aria-hidden="true"
				tabindex="-1"
			/>
		</div>

		<h1
			class="text-5xl font-bold tracking-wide select-text text-gradient-pulse"
			aria-label="Kechow"
			style="
				color: #ec4899;
				text-shadow: -1px -1px 0 #4f46e5, 1px -1px 0 #4f46e5, -1px 1px 0 #4f46e5,
					1px 1px 0 #4f46e5;
			"
		>
			Kechow
		</h1>

		<div class="flex items-center gap-6">
			<button
				@click="toggleDrawer"
				class="lg:hidden text-primary hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary rounded"
				aria-label="Toggle menu"
			>
				<svg
					class="w-7 h-7"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>

			<LanguageToggle />

			<button
				class="icon-button"
				@click="toggleDarkMode"
				aria-label="Toggle dark mode"
			>
				<svg
					v-if="isDark"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M12 3a9 9 0 009 9 9 9 0 11-9-9z"
					/>
				</svg>
				<svg
					v-else
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M12 3v1m0 16v1m8.485-8.485h-1M4.515 12.515h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
			</button>

			<div class="relative" @keydown.escape="closeUserMenu">
				<button
					@click="toggleUserMenu"
					class="hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary rounded relative bg-gradient-to-r from-primary-light to-primary-dark p-1"
					aria-haspopup="true"
					:aria-expanded="userMenuOpen ? 'true' : 'false'"
					aria-label="User menu"
					title="User menu"
				>
					<UserCircle class="w-7 h-7 text-white bg-transparent rounded" />
					<span
						v-if="notifications > 0"
						class="absolute -top-1 -right-1 bg-accent rounded-full w-4 h-4 text-xs flex items-center justify-center font-bold text-white"
						>{{ notifications }}</span
					>
				</button>

				<transition
					enter-active-class="transition ease-out duration-200"
					enter-from-class="opacity-0 scale-95"
					enter-to-class="opacity-100 scale-100"
					leave-active-class="transition ease-in duration-150"
					leave-from-class="opacity-100 scale-100"
					leave-to-class="opacity-0 scale-95"
				>
					<ul
						v-if="userMenuOpen"
						class="absolute right-0 mt-2 w-40 bg-gradient-to-br from-primary-light to-primary-dark rounded-xl shadow-strong text-white text-sm py-2"
						role="menu"
					>
						<li>
							<button
								class="w-full text-left px-4 py-2 hover:bg-blue-600 rounded-lg transition-colors"
								role="menuitem"
								@click="goProfile"
							>
								Profile
							</button>
						</li>
						<li>
							<button
								class="w-full text-left px-4 py-2 hover:bg-blue-600 rounded-lg transition-colors"
								role="menuitem"
								@click="logout"
							>
								Logout
							</button>
						</li>
					</ul>
				</transition>
			</div>
		</div>
	</nav>

	<!-- Role Navbar fixed below TopNav -->
	<RoleNavbar v-if="authStore.isAuthenticated" class="sticky top-[80px] z-40" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserCircle } from 'lucide-vue-next';
import LanguageToggle from '@layout/LanguageToggle.vue';
import RoleNavbar from '@/components/layout/RoleNavbar.vue';
import { useAuthStore } from '@/app/store/auth/auth.store';
import { useRouter } from 'vue-router';

const isDrawerOpen = ref(false);
const userMenuOpen = ref(false);
const notifications = ref(3);

const authStore = useAuthStore();
const router = useRouter();
const isDark = ref(
	localStorage.getItem('theme') === 'dark' ||
		(!localStorage.getItem('theme') &&
			window.matchMedia('(prefers-color-scheme: dark)').matches)
);

function toggleDarkMode() {
	isDark.value = !isDark.value;
	document.documentElement.classList.toggle('dark', isDark.value);
}
function toggleDrawer() {
	isDrawerOpen.value = !isDrawerOpen.value;
}
function closeDrawer() {
	isDrawerOpen.value = false;
}
function toggleUserMenu() {
	userMenuOpen.value = !userMenuOpen.value;
}
function closeUserMenu() {
	userMenuOpen.value = false;
}
function goProfile() {
	closeUserMenu();
	router.push('/profile');
}
function logout() {
	authStore.logout();
	closeUserMenu();
	router.push('/');
}
</script>

<style scoped>
/* Keep all existing animations exactly as they were */
@keyframes rushIn {
	0% {
		opacity: 0;
		transform: translateX(-200%) rotate(0deg);
	}
	50% {
		opacity: 1;
		transform: translateX(20%) rotate(10deg);
	}
	75% {
		transform: translateX(0%) rotate(-6deg);
	}
	90% {
		transform: translateX(5%) rotate(4deg);
	}
	100% {
		transform: translateX(0%) rotate(0deg);
	}
}
.animate-rushIn {
	animation: rushIn 1s ease forwards;
}

@keyframes wiggle {
	0%,
	20%,
	100% {
		transform: rotate(0deg);
	}
	5%,
	15% {
		transform: rotate(5deg);
	}
	10% {
		transform: rotate(-5deg);
	}
	12%,
	18% {
		transform: rotate(3deg);
	}
}
.animate-wiggle {
	animation: wiggle 5s ease-in-out infinite;
	animation-delay: 1.2s;
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
.text-gradient-pulse {
	animation: pulseScaleMinimal 2.5s ease-in-out infinite;
}
</style>
