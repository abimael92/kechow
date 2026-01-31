<template>
	<nav
		class="sticky top-16 sm:top-20 z-40 px-2 sm:px-4 md:px-6 py-2 bg-[#2a1a40]/90 backdrop-blur-md border-b border-white/10 overflow-auto dark:bg-gray-900/90"
	>
		<div class="flex flex-wrap justify-center items-center gap-1 sm:gap-2 md:gap-4 min-h-0">
			<!-- Owner Navigation: 44px tap targets -->
			<template v-if="authStore.isOwner">
				<router-link
					to="/owner/dashboard"
					class="flex items-center min-h-[44px] px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors text-white hover:text-purple-300 no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>Tablero</router-link
				>
				<router-link
					to="/owner/orders"
					class="flex items-center min-h-[44px] px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors text-white hover:text-purple-300 no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>Pedidos</router-link
				>
				<router-link
					to="/owner/menu"
					class="flex items-center min-h-[44px] px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors text-white hover:text-purple-300 no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>Elementos del Menú</router-link
				>
				<router-link
					to="/owner/analytics"
					class="flex items-center min-h-[44px] px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors text-white hover:text-purple-300 no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>Analíticas</router-link
				>
				<router-link
					to="/owner/reviews"
					class="flex items-center min-h-[44px] px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors text-white hover:text-purple-300 no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>Reseñas</router-link
				>
				<router-link
					to="/owner/settings"
					class="flex items-center min-h-[44px] px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors text-white hover:text-purple-300 no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>Configuración</router-link
				>
			</template>

			<!-- Delivery Navigation -->
			<template v-else-if="authStore.isDelivery">
				<router-link
					to="/delivery/dashboard"
					class="flex items-center min-h-[44px] px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors text-white hover:text-purple-300 no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>Tablero</router-link
				>
				<router-link
					to="/delivery/orders"
					class="flex items-center min-h-[44px] px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors text-white hover:text-purple-300 no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>Pedidos</router-link
				>
				<router-link
					to="/delivery/earnings"
					class="flex items-center min-h-[44px] px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors text-white hover:text-purple-300 no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>Ganancias</router-link
				>
				<router-link
					to="/delivery/profile"
					class="flex items-center min-h-[44px] px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors text-white hover:text-purple-300 no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>Perfil</router-link
				>
			</template>

			<!-- Customer Navigation -->
			<template v-else-if="authStore.isAuthenticated">
				<router-link
					to="/restaurants"
					class="flex items-center min-h-[44px] px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors text-white hover:text-purple-300 no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>Restaurantes</router-link
				>
				<router-link
					to="/cart"
					class="flex items-center min-h-[44px] px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors text-white hover:text-purple-300 no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>Mi Carrito</router-link
				>
				<router-link
					to="/orders"
					class="flex items-center min-h-[44px] px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors text-white hover:text-purple-300 no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>Mis Pedidos</router-link
				>
			</template>
		</div>
	</nav>
</template>

<script setup>
import { useAuthStore } from '@/app/store/auth/auth.store';

const authStore = useAuthStore();
</script>
