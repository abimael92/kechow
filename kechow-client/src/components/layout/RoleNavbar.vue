<template>
	<nav
		class="sticky top-16 sm:top-20 z-40 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 bg-primary-800 dark:bg-gray-900/90 overflow-auto min-w-0"
		role="navigation"
		aria-label="Navegación principal"
	>
		<div class="flex flex-wrap justify-center items-center gap-1 sm:gap-2 md:gap-4 min-h-0">
			<!-- Landing: links + CTAs (when on /, /login, /register) -->
			<template v-if="isLandingRoute">
				<a :href="landingHash('#features')" class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline">Características</a>
				<a :href="landingHash('#restaurants')" class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline">Restaurantes</a>
				<a :href="landingHash('#how-it-works')" class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline">Cómo funciona</a>
				<a :href="landingHash('#testimonials')" class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline">Testimonios</a>
				<span class="hidden sm:inline w-px h-6 bg-primary-600 dark:bg-gray-600 mx-1" aria-hidden="true" />
				<router-link to="/login" class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline">Iniciar sesión</router-link>
				<router-link to="/register" class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline border border-primary-400 dark:border-gray-500">Registrarse</router-link>
				<router-link to="/restaurants" class="flex items-center min-h-[44px] min-w-0 px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded font-semibold bg-primary-500 text-white hover:bg-primary-600 no-underline">Ordenar ahora</router-link>
			</template>

			<!-- Owner Navigation: 44px tap targets -->
			<template v-else-if="authStore.isOwner">
				<router-link
					to="/owner/dashboard"
					class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline break-words"
					active-class="font-semibold border-b-2 border-primary-500"
					>Tablero</router-link
				>
				<router-link
					to="/owner/orders"
					class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline break-words"
					active-class="font-semibold border-b-2 border-primary-500"
					>Pedidos</router-link
				>
				<router-link
					to="/owner/menu"
					class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline break-words"
					active-class="font-semibold border-b-2 border-primary-500"
					>Menú</router-link
				>
				<router-link
					to="/owner/analytics"
					class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline break-words"
					active-class="font-semibold border-b-2 border-primary-500"
					>Analíticas</router-link
				>
				<router-link
					to="/owner/reviews"
					class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline break-words"
					active-class="font-semibold border-b-2 border-primary-500"
					>Reseñas</router-link
				>
				<router-link
					to="/owner/settings"
					class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline break-words"
					active-class="font-semibold border-b-2 border-primary-500"
					>Configuración</router-link
				>
			</template>

			<!-- Delivery Navigation -->
			<template v-else-if="authStore.isDelivery">
				<router-link
					to="/delivery/dashboard"
					class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline break-words"
					active-class="font-semibold border-b-2 border-primary-500"
					>Tablero</router-link
				>
				<router-link
					to="/delivery/orders"
					class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline break-words"
					active-class="font-semibold border-b-2 border-primary-500"
					>Pedidos</router-link
				>
				<router-link
					to="/delivery/earnings"
					class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline break-words"
					active-class="font-semibold border-b-2 border-primary-500"
					>Ganancias</router-link
				>
				<router-link
					to="/delivery/profile"
					class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline break-words"
					active-class="font-semibold border-b-2 border-primary-500"
					>Perfil</router-link
				>
			</template>

			<!-- Customer Navigation -->
			<template v-else-if="authStore.isAuthenticated">
				<router-link
					to="/restaurants"
					class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline break-words"
					active-class="font-semibold border-b-2 border-primary-500"
					>Restaurantes</router-link
				>
				<router-link
					to="/cart"
					class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline break-words"
					active-class="font-semibold border-b-2 border-primary-500"
					>Mi Carrito</router-link
				>
				<router-link
					to="/orders"
					class="flex items-center min-h-[44px] min-w-0 px-2 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base rounded transition-colors text-white hover:text-primary-300 no-underline break-words"
					active-class="font-semibold border-b-2 border-primary-500"
					>Mis Pedidos</router-link
				>
			</template>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/app/store/auth/auth.store';

const authStore = useAuthStore();
const route = useRoute();

const isLandingRoute = computed(() => {
	const name = route.name;
	return name === 'Landing' || name === 'Login' || name === 'Register';
});

function landingHash(hash: string): string {
	return route.name === 'Landing' ? hash : `/${hash}`;
}
</script>
