<template>
	<!-- Top Nav: grid layout (no fixed widths; Flexbox/Grid only) -->
<nav
  class="sticky top-0 z-50 px-4 py-3 sm:px-6 sm:py-4 border-b border-primary-200/30 shadow-soft backdrop-blur-sm bg-gradient-to-r from-primary-800 via-primary-200 to-primary-800 text-secondary-900 dark:bg-gray-900 dark:[background-image:none] dark:backdrop-blur-md dark:border-gray-700 dark:shadow-soft dark:text-white grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 min-h-[44px] sm:min-h-0"
		role="navigation"
		aria-label="Navegación principal"
	>
		<!-- Left: logo -->
		<div class="flex items-center justify-start min-w-0">
			<img
				src="/images/kechow_logo.png"
				alt="Kechow Logo"
				class="w-12 h-12 sm:w-16 sm:h-16 object-contain animate-rushIn animate-wiggle flex-shrink-0"
			/>
		</div>

		<!-- Center: title -->
		<div class="flex justify-center items-center min-w-0 pointer-events-none">
			<h1
				class="text-2xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-wide select-text font-chewy text-primary-500 dark:text-primary-400 text-gradient-pulse truncate"
				aria-label="Kechow"
			>
				Kechow
			</h1>
		</div>

		<!-- Right: buttons -->
		<div class="flex items-center justify-end gap-2 sm:gap-4 min-w-0">
			<!-- Burger menu button - visible only on mobile/tablet -->
			<button
				@click="toggleDrawer"
				class="lg:hidden flex items-center justify-center min-h-[44px] min-w-[44px] text-primary-500 dark:text-primary-400 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
				aria-label="Abrir menú"
			>
				<svg
					class="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0"
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
			<!-- i18n preparado para múltiples idiomas. Por ahora la app usa solo español. -->
			<!-- <LanguageToggle class="hidden lg:block" /> -->
			<button
				class="hidden lg:flex items-center justify-center min-h-[44px] min-w-[44px] hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary rounded"
				@click="toggleDarkMode"
				aria-label="Cambiar tema"
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

			<div
				class="relative hidden lg:block"
				@keydown.escape="closeUserMenu"
				v-if="authStore.isAuthenticated"
			>
				<button
					@click="toggleUserMenu"
					class="flex items-center justify-center min-h-[44px] min-w-[44px] hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg bg-secondary-200 dark:bg-gradient-to-r dark:from-primary-light dark:to-primary-dark p-1 user-menu-button text-secondary-800 dark:text-white"
					aria-haspopup="true"
					:aria-expanded="userMenuOpen ? 'true' : 'false'"
					aria-label="Menú de usuario"
					title="Menú de usuario"
				>
					<UserCircle
						class="w-6 h-6 sm:w-7 sm:h-7 text-white bg-transparent rounded flex-shrink-0"
					/>
					<span
						v-if="notifications > 0"
						class="absolute -top-1 -right-1 bg-primary-500 dark:bg-accent rounded-full w-4 h-4 text-xs flex items-center justify-center font-bold text-white"
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
						class="absolute right-0 mt-2 min-w-[10rem] bg-gradient-to-br from-primary-light to-primary-dark rounded-xl shadow-strong text-white text-sm py-2"
						role="menu"
					>
						<li>
							<button
								class="w-full text-left px-4 py-3 min-h-[44px] flex items-center hover:bg-primary-500 rounded-lg transition-colors"
								role="menuitem"
								@click="goProfile"
							>
								Profile
							</button>
						</li>
						<li>
							<button
								class="w-full text-left px-4 py-3 min-h-[44px] flex items-center hover:bg-primary-500 rounded-lg transition-colors"
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

		<!-- Mobile drawer: nav links (by role from layout) + Perfil + Cerrar sesión + tema. Sin role leaks. -->
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
				class="absolute top-full left-0 right-0 bg-primary-200 dark:bg-[#2a1a40] dark:border-white border-b border-primary-200/80 shadow-soft lg:hidden overflow-auto max-h-[70vh]"
			>
				<div class="px-4 py-3 flex flex-col gap-0.5">
					<!-- Role-based nav links -->
					<template v-if="drawerNavItems.length">
						<div class="text-primary-600 dark:text-gray-400 text-md font-bold px-3 py-2 uppercase tracking-wide">
							Navegación
						</div>
						<router-link
							v-for="item in drawerNavItems"
							:key="item.path"
							:to="item.path"
							@click="closeDrawer"
							class="flex items-center w-full px-3 py-3 min-h-[44px] text-left rounded-lg text-primary-800 dark:text-gray-200 hover:bg-primary-100 dark:hover:bg-gray-700 hover:text-primary-900 dark:hover:text-white transition-colors break-words"
						>
							{{ item.label }}
						</router-link>
						<div class="border-t border-primary-800 dark:border-white/10 my-1" />
					</template>

					<button
						@click="toggleDarkMode"
						class="flex items-center w-full px-3 py-3 min-h-[44px] text-left rounded-lg hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors text-primary-800 dark:text-gray-200"
						aria-label="Cambiar tema"
					>
						<svg
							v-if="isDark"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							class="w-5 h-5 mr-3 flex-shrink-0"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3a9 9 0 009 9 9 9 0 11-9-9z" />
						</svg>
						<svg
							v-else
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							class="w-5 h-5 mr-3 flex-shrink-0"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m8.485-8.485h-1M4.515 12.515h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
						</svg>
						{{ isDark ? 'Modo claro' : 'Modo oscuro' }}
					</button>

					<template v-if="authStore.isAuthenticated">
						<button
							@click="goProfile"
							class="flex items-center w-full px-3 py-3 min-h-[44px] text-left rounded-lg hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors text-primary-800 dark:text-gray-200"
						>
							Perfil
						</button>
						<button
							@click="logout"
							class="flex items-center w-full px-3 py-3 min-h-[44px] text-left rounded-lg hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors text-primary-800 dark:text-gray-200"
						>
							Cerrar sesión
						</button>
					</template>
				</div>
			</div>
		</transition>
	</nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { UserCircle } from 'lucide-vue-next';
import { useAuthStore } from '@/app/store/auth/auth.store';
import { useRouter } from 'vue-router';
import { getNavItemsForRole, type NavRole } from '@/shared/data/nav.config';

const props = withDefaults(
	defineProps<{ role?: NavRole | null }>(),
	{ role: null }
);

const isDrawerOpen = ref(false);
const userMenuOpen = ref(false);
const notifications = ref(3);

const authStore = useAuthStore();
const router = useRouter();

/** Nav items for mobile drawer. Role comes from layout (route), not auth — no role leaks. */
const drawerNavItems = computed(() => getNavItemsForRole(props.role ?? undefined));

const isDark = ref(false);

onMounted(() => {
	const savedTheme = localStorage.getItem('theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	
	// Use saved theme or system preference
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
	// Role-aware profile/settings so navigation works for each role
	if (authStore.isOwner) {
		router.push('/owner/settings');
	} else if (authStore.isDelivery) {
		router.push('/delivery/profile');
	} else {
		router.push('/profile');
	}
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

</style>
