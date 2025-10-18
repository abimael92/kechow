<template>
	<!-- Top Nav -->
	<nav
		class="sticky top-0 z-50 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-md border-b border-white/10 shadow-soft bg-[#2a1a40] text-white flex items-center justify-between relative"
		role="navigation"
		aria-label="Primary Navigation"
	>
		<!-- Left logo -->
		<div class="flex items-center gap-3 z-10">
			<img
				src="/images/kechow_logo.png"
				alt="Kechow Logo"
				class="w-12 h-12 sm:w-16 sm:h-16 object-contain animate-rushIn animate-wiggle"
			/>
		</div>

		<!-- Center title -->
		<div
			class="absolute inset-0 flex justify-center items-center pointer-events-none"
		>
			<h1
				class="text-3xl sm:text-8xl font-bold tracking-wide select-text font-chewy text-gradient-pulse"
				aria-label="Kechow"
				style="
					color: #ec4899;
					text-shadow: -1px -1px 0 #4f46e5, 1px -1px 0 #4f46e5,
						-1px 1px 0 #4f46e5, 1px 1px 0 #4f46e5;
				"
			>
				Kechow
			</h1>
		</div>

		<!-- Right buttons -->
		<div class="flex items-center gap-4 sm:gap-6 z-10">
			<!-- Burger menu button - visible only on mobile -->
			<button
				@click="toggleDrawer"
				class="lg:hidden text-primary hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary rounded"
				aria-label="Toggle menu"
			>
				<svg
					class="w-6 h-6 sm:w-7 sm:h-7"
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

			<!-- Desktop items - hidden on mobile -->
			<LanguageToggle class="hidden lg:block" />
			<button
				class="icon-button hidden lg:block"
				@click="toggleDarkMode"
				aria-label="Toggle dark mode"
			>
				<svg
					v-if="!isDark"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					class="w-5 h-5 sm:w-6 sm:h-6"
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
					class="w-5 h-5 sm:w-6 sm:h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M12 3v1m0 16v1m8.485-8.485h-1M4.515 12.515h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
			</button>

			<div class="relative hidden lg:block" @keydown.escape="closeUserMenu">
				<button
					@click="toggleUserMenu"
					class="hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary rounded relative bg-gradient-to-r from-primary-light to-primary-dark p-1 user-menu-button"
					aria-haspopup="true"
					:aria-expanded="userMenuOpen ? 'true' : 'false'"
					aria-label="User menu"
					title="User menu"
				>
					<UserCircle
						class="w-6 h-6 sm:w-7 sm:h-7 text-white bg-transparent rounded"
					/>
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

		<!-- Mobile drawer menu -->
		<transition
			enter-active-class="transition ease-out duration-200"
			enter-from-class="opacity-0 transform -translate-y-4"
			enter-to-class="opacity-100 transform translate-y-0"
			leave-active-class="transition ease-in duration-150"
			leave-from-class="opacity-100 transform translate-y-0"
			leave-to-class="opacity-0 transform -translate-y-4"
		>
			<div
				v-if="isDrawerOpen"
				class="absolute top-full left-0 right-0 bg-[#2a1a40] border-b border-white/10 shadow-soft lg:hidden"
			>
				<div class="px-4 py-3 space-y-3">
					<button
						@click="toggleDarkMode"
						class="flex items-center w-full px-3 py-2 text-left rounded-lg hover:bg-white/10 transition-colors"
						aria-label="Toggle dark mode"
					>
						<svg
							v-if="isDark"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							class="w-5 h-5 mr-3"
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
							class="w-5 h-5 mr-3"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M12 3v1m0 16v1m8.485-8.485h-1M4.515 12.515h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
						{{ isDark ? 'Light Mode' : 'Dark Mode' }}
					</button>

					<LanguageToggle class="w-full px-2 py-1" />

					<button
						@click="goProfile"
						class="flex items-center w-full px-3 py-2 text-left rounded-lg hover:bg-white/10 transition-colors"
					>
						Profile
					</button>
					<button
						@click="logout"
						class="flex items-center w-full px-3 py-2 text-left rounded-lg hover:bg-white/10 transition-colors"
					>
						Logout
					</button>
				</div>
			</div>
		</transition>
	</nav>

	<!-- Role Navbar fixed below TopNav -->
	<RoleNavbar
		v-if="authStore.isAuthenticated"
		class="sticky top-[68px] sm:top-[80px] z-40"
	/>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
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

const isDark = ref(false);

onMounted(() => {
	const savedTheme = localStorage.getItem('theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	isDark.value = savedTheme ? savedTheme === 'dark' : prefersDark;
	document.documentElement.classList.toggle('dark', isDark.value);

	document.addEventListener('click', closeOnClickOutside);
	document.addEventListener('click', closeDrawerOnClickOutside);
});

onUnmounted(() => {
	document.removeEventListener('click', closeOnClickOutside);
	document.removeEventListener('click', closeDrawerOnClickOutside);
});

function toggleDarkMode() {
	isDark.value = !isDark.value;
	document.documentElement.classList.toggle('dark', isDark.value);
	localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
	closeDrawer();
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
	closeDrawer();
	router.push('/profile');
}

function logout() {
	authStore.logout();
	closeUserMenu();
	closeDrawer();
	router.push('/');
}

// Outside click handlers
const closeOnClickOutside = (event: MouseEvent) => {
	const menuBtn = document.querySelector('.user-menu-button');
	if (
		userMenuOpen.value &&
		menuBtn &&
		!menuBtn.contains(event.target as Node)
	) {
		closeUserMenu();
	}
};

const closeDrawerOnClickOutside = (event: MouseEvent) => {
	const nav = document.querySelector('nav');
	if (isDrawerOpen.value && nav && !nav.contains(event.target as Node)) {
		closeDrawer();
	}
};
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

@media (max-width: 640px) {
	nav {
		padding: 0.75rem 1rem;
	}
	button {
		min-height: 44px;
		min-width: 44px;
	}
}
</style>
