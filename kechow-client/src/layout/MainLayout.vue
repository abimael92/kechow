<template>
	<div
		class="min-h-screen bg-gradient-to-br from-[#734ce8] via-[#a98dd4] via-50% to-[#6b4476] dark:from-gray-900 dark:to-gray-800 text-skin-base dark:text-skin-dark flex flex-col font-sans"
		role="application"
		aria-label="Kechow Food Delivery Application"
	>
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
					text-shadow: -1px -1px 0 #4f46e5, 1px -1px 0 #4f46e5,
						-1px 1px 0 #4f46e5, 1px 1px 0 #4f46e5;
				"
			>
				Kechow
			</h1>

			<div class="flex items-center gap-6">
				<!-- Hamburger menu (mobile only) -->
				<button
					@click="toggleDrawer"
					class="lg:hidden text-primary hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary rounded"
					aria-label="Toggle menu"
					:aria-expanded="userMenuOpen ? 'true' : 'false'"
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

				<!-- Language Toggle -->
				<LanguageToggle />

				<!-- Dark Mode Toggle -->
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

				<!-- User Menu -->
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
							aria-label="You have new notifications"
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
							aria-label="User menu options"
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

		<!-- Mobile drawer (sidebar) -->
		<transition
			enter-active-class="transition duration-300 ease-in-out"
			enter-from-class="-translate-x-full"
			enter-to-class="translate-x-0"
			leave-active-class="transition duration-300 ease-in-out"
			leave-from-class="translate-x-0"
			leave-to-class="-translate-x-full"
		>
			<aside
				v-if="isDrawerOpen"
				class="fixed inset-y-0 left-0 z-40 w-64 bg-white bg-opacity-10 backdrop-blur-md border-r border-white/20 shadow-soft text-white p-6 lg:hidden"
				@click.self="closeDrawer"
			>
				<nav
					class="flex flex-col space-y-4"
					role="menu"
					aria-label="Mobile Navigation"
				>
					<router-link
						to="/"
						class="block px-3 py-2 rounded hover:bg-primary hover:text-white transition"
						:class="{ 'bg-primary text-white': $route.name === 'Landing' }"
						role="menuitem"
						@click="closeDrawer"
					>
						{{ t('home') }}
					</router-link>
					<router-link
						to="/home"
						class="block px-3 py-2 rounded hover:bg-primary hover:text-white transition"
						:class="{ 'bg-primary text-white': $route.name === 'Home' }"
						role="menuitem"
						@click="closeDrawer"
					>
						{{ t('restaurants') }}
					</router-link>
				</nav>
			</aside>
		</transition>

		<!-- Main Content -->
		<main
			class="flex-grow px-6 py-10 md:px-12 lg:px-20 animate-fadeInUp focus:outline-none"
			tabindex="-1"
			role="main"
		>
			<router-view />
		</main>

		<!-- Footer -->
		<div
			class="bg-[#1B1333] px-8 py-6 border-t border-white/10 text-sm text-white/80 dark:bg-[your-dark-bg-color] dark:text-[your-dark-text-color]"
		>
			<div
				class="flex flex-col md:flex-row justify-evenly items-start text-center gap-10 md:gap-0 px-4 md:px-12"
			>
				<!-- Logo + Message -->
				<div class="flex flex-col items-center text-center mb-4 cursor-pointer">
					<div class="flex items-center gap-2 mb-2">
						<img
							src="/images/kechow_logo.png"
							alt="Kechow Logo"
							class="w-8 h-8 object-contain"
						/>
						<span
							class="text-lg font-semibold text-white hover:text-[#ec4899] dark:hover:text-accent"
							>Kechow</span
						>
					</div>

					<p
						class="opacity-80 max-w-xs mt-2 transition-colors duration-200 text-[rgb(106,100,236)] hover:text-[#ec4899] hover:opacity-100 dark:text-primary dark:hover:text-accent"
					>
						{{ $t('yourLocalFoodDeliveryIsCooking') }}
					</p>
				</div>

				<!-- Links -->
				<div class="flex flex-col items-center text-center">
					<h5 class="text-white font-semibold mb-2">Explore</h5>
					<div class="grid grid-cols-2 gap-x-6 gap-y-1">
						<a href="#" class="hover:underline">About Us</a>
						<a href="#" class="hover:underline">Careers</a>
						<a href="#" class="hover:underline">Terms</a>
						<a href="#" class="hover:underline">Privacy</a>
					</div>
				</div>

				<!-- Social Icons -->
				<div>
					<h5 class="text-white font-semibold mb-2">Connect</h5>
					<div class="flex gap-4 text-xl">
						<a
							href="mailto:support@kechow.com"
							aria-label="Email"
							class="hover:text-accent"
						>
							<i class="fa-solid fa-envelope"></i>
						</a>
						<a href="#" aria-label="Instagram" class="hover:text-accent">
							<i class="fa-brands fa-instagram"></i>
						</a>
						<a href="#" aria-label="Twitter" class="hover:text-accent">
							<i class="fa-brands fa-x-twitter"></i>
						</a>
					</div>
				</div>
			</div>

			<!-- Bottom Bar -->
			<div
				class="mt-5 text-center text-md opacity-90 border-t border-white/10 pt-4"
			>
				© 2025 <span class="font-semibold text-white">Kechow</span>. All rights
				reserved.
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { UserCircle } from 'lucide-vue-next';
import LanguageToggle from '@layout/LanguageToggle.vue';

const { t } = useI18n();

const isDrawerOpen = ref(false);
const userMenuOpen = ref(false);
const notifications = ref(3);

const isDark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches);

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
	alert('Go to profile page');
	closeUserMenu();
}

function logout() {
	alert('Logging out...');
	closeUserMenu();
}
</script>

<style scoped>
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
	animation-delay: 1.2s; /* after rushIn */
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
