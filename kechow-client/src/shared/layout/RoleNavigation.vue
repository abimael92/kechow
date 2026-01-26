<template>
	<nav
		class="sticky top-16 sm:top-20 z-40 bg-[#2a1a40]/90 backdrop-blur-md border-b border-white/10 shadow-sm"
		role="navigation"
		:aria-label="`Navegación ${roleLabel}`"
	>
		<!-- Desktop Navigation -->
		<div class="hidden md:flex items-center justify-center gap-1 px-4 py-3">
			<router-link
				v-for="item in navigationItems"
				:key="item.path"
				:to="item.path"
				class="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 relative"
				:class="{
					'text-white bg-white/15 font-semibold': isActive(item.path),
					'text-white/70': !isActive(item.path),
				}"
			>
				{{ item.label }}
				<span
					v-if="isActive(item.path)"
					class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400 rounded-full"
				></span>
			</router-link>
		</div>

		<!-- Mobile Navigation -->
		<div class="md:hidden">
			<!-- Mobile Menu Button -->
			<button
				@click="toggleMobileMenu"
				class="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-white/10 transition-colors"
				:aria-expanded="mobileMenuOpen"
				aria-label="Toggle navigation menu"
			>
				<span class="font-medium">
					{{ currentActiveLabel || 'Menú' }}
				</span>
				<svg
					class="w-5 h-5 transition-transform"
					:class="{ 'rotate-180': mobileMenuOpen }"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			<!-- Mobile Menu Dropdown -->
			<transition
				enter-active-class="transition ease-out duration-200"
				enter-from-class="opacity-0 -translate-y-2"
				enter-to-class="opacity-100 translate-y-0"
				leave-active-class="transition ease-in duration-150"
				leave-from-class="opacity-100 translate-y-0"
				leave-to-class="opacity-0 -translate-y-2"
			>
				<div
					v-if="mobileMenuOpen"
					class="border-t border-white/10 bg-[#2a1a40]/95 backdrop-blur-md"
				>
					<router-link
						v-for="item in navigationItems"
						:key="item.path"
						:to="item.path"
						@click="closeMobileMenu"
						class="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
						:class="{
							'text-white bg-white/15 font-semibold': isActive(item.path),
							'text-white/70': !isActive(item.path),
						}"
					>
						<div class="flex items-center justify-between">
							<span>{{ item.label }}</span>
							<svg
								v-if="isActive(item.path)"
								class="w-5 h-5 text-purple-400"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</router-link>
				</div>
			</transition>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

interface NavigationItem {
	path: string;
	label: string;
}

interface Props {
	role: 'customer' | 'owner' | 'delivery';
}

const props = defineProps<Props>();

const route = useRoute();
const mobileMenuOpen = ref(false);

const roleLabels: Record<string, string> = {
	customer: 'Cliente',
	owner: 'Propietario',
	delivery: 'Repartidor',
};

const roleLabel = computed(() => roleLabels[props.role] || '');

const customerNavItems: NavigationItem[] = [
	{ path: '/home', label: 'Inicio' },
	{ path: '/restaurants', label: 'Restaurantes' },
	{ path: '/cart', label: 'Mi Carrito' },
	{ path: '/orders', label: 'Mis Pedidos' },
];

const ownerNavItems: NavigationItem[] = [
	{ path: '/owner/dashboard', label: 'Panel de Control' },
	{ path: '/owner/orders', label: 'Pedidos' },
	{ path: '/owner/menu', label: 'Menú' },
	{ path: '/owner/analytics', label: 'Analíticas' },
	{ path: '/owner/reviews', label: 'Reseñas' },
	{ path: '/owner/settings', label: 'Configuración' },
];

const deliveryNavItems: NavigationItem[] = [
	{ path: '/delivery/dashboard', label: 'Panel de Control' },
	{ path: '/delivery/orders', label: 'Pedidos' },
	{ path: '/delivery/earnings', label: 'Ganancias' },
	{ path: '/delivery/profile', label: 'Perfil' },
];

const navigationItems = computed<NavigationItem[]>(() => {
	switch (props.role) {
		case 'customer':
			return customerNavItems;
		case 'owner':
			return ownerNavItems;
		case 'delivery':
			return deliveryNavItems;
		default:
			return [];
	}
});

const isActive = (path: string): boolean => {
	if (path === route.path) return true;
	// Handle nested routes
	if (route.path.startsWith(path) && path !== '/') {
		return true;
	}
	return false;
};

const currentActiveLabel = computed(() => {
	const activeItem = navigationItems.value.find((item) => isActive(item.path));
	return activeItem?.label || '';
});

const toggleMobileMenu = () => {
	mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
	mobileMenuOpen.value = false;
};
</script>
