<template>
	<!-- Desktop only: top nav. Mobile uses Header drawer (no role leaks; role from layout). -->
	<nav
		class="hidden md:block sticky top-16 sm:top-20 z-40 bg-primary-200 dark:bg-gray-900 dark:[background-image:none] dark:border-gray-700 backdrop-blur-sm border-b border-primary-200/80 shadow-soft min-w-0 overflow-x-hidden"
		role="navigation"
		:aria-label="`Navegación ${roleLabel}`"
	>
		<div class="flex items-center justify-center gap-1 px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex-wrap">
			<template v-for="item in navigationItems" :key="item.path">
				<!-- Cart: open drawer and show summary (customer only) -->
				<button
					v-if="isCartItem(item)"
					type="button"
					class="flex items-center min-h-[44px] min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-primary-800 dark:text-gray-200 hover:text-secondary-900 dark:hover:text-white hover:bg-primary-400 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 relative break-words"
					:class="{
						'text-primary-600 dark:text-white font-semibold': isActive(item.path),
						'text-secondary-500 dark:text-gray-400': !isActive(item.path),
					}"
					@click="openCartPanel"
					:aria-label="`Carrito, ${cartItemCount} artículo${cartItemCount !== 1 ? 's' : ''}`"
				>
					<span class="truncate">{{ item.label }}</span>
					<span
						v-if="cartItemCount > 0"
						class="ml-1.5 flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-primary-500 text-white text-xs font-bold"
					>
						{{ cartItemCount > 99 ? '99+' : cartItemCount }}
					</span>
					<span
						v-if="cartItemCount > 0 && cartSubtotal > 0"
						class="ml-1 text-xs opacity-90 hidden lg:inline"
					>
						· ${{ formatPrice(cartSubtotal) }} MXN
					</span>
					<span
						v-if="isActive(item.path)"
						class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
					></span>
				</button>
				<router-link
					v-else
					:to="item.path"
					class="flex items-center min-h-[44px] min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-primary-800 dark:text-gray-200 hover:text-secondary-900 dark:hover:text-white hover:bg-primary-400 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 relative break-words"
					:class="{
						'text-primary-600 dark:text-white font-semibold': isActive(item.path),
						'text-secondary-500 dark:text-gray-400': !isActive(item.path),
					}"
				>
					<span class="truncate">{{ item.label }}</span>
					<span
						v-if="isActive(item.path)"
						class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
					></span>
				</router-link>
			</template>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { getNavItemsForRole, roleLabels, type NavRole } from '@/shared/data/nav.config';
import { useCartStore } from '@/features/customer/cart/cart.store';
import { useCartPanel } from '@/features/customer/cart/useCartPanel';

const props = defineProps<{
	role: NavRole;
}>();

const route = useRoute();
const cartStore = useCartStore();
const { openCartPanel } = useCartPanel();
const { itemCount: cartItemCount, subtotal: cartSubtotal } = storeToRefs(cartStore);

const roleLabel = computed(() => roleLabels[props.role] ?? '');
const navigationItems = computed(() => getNavItemsForRole(props.role));

function isCartItem(item: { path: string; label: string }): boolean {
	return props.role === 'customer' && item.path === '/cart';
}

function isActive(path: string): boolean {
	if (path === route.path) return true;
	if (route.path.startsWith(path) && path !== '/') return true;
	return false;
}

function formatPrice(n: number): string {
	return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
</script>
