<template>
	<nav
		class="sticky top-16 z-40 px-4 sm:px-6 py-2 bg-[#2a1a40]/90 backdrop-blur-md border-b border-white/10"
	>
		<div class="mx-auto flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6">
			<!-- Owner Navigation -->
			<template v-if="authStore.isOwner">
				<router-link
					to="/owner/dashboard"
					class="text-white hover:text-purple-300 px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors"
					active-class="font-bold border-b-2 border-purple-400"
					>{{ $t('dashboard') }}</router-link
				>
				<router-link
					to="/owner/orders"
					class="text-white hover:text-purple-300 px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>{{ $t('orders') }}</router-link
				>
				<router-link
					to="/owner/menu"
					class="text-white hover:text-purple-300 px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>{{ $t('menuItems') }}</router-link
				>
				<router-link
					to="/owner/analytics"
					class="text-white hover:text-purple-300 px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>{{ $t('analytics') }}</router-link
				>
				<router-link
					to="/owner/reviews"
					class="text-white hover:text-purple-300 px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>{{ $t('reviews') }}</router-link
				>
				<router-link
					to="/owner/settings"
					class="text-white hover:text-purple-300 px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>{{ $t('settings') }}</router-link
				>
			</template>

			<!-- Delivery Navigation -->
			<template v-else-if="authStore.isDelivery">
				<router-link
					to="/delivery/dashboard"
					class="text-white hover:text-purple-300 px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>{{ $t('dashboard') }}</router-link
				>
				<router-link
					to="/delivery/orders"
					class="text-white hover:text-purple-300 px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>{{ $t('orders') }}</router-link
				>
				<router-link
					to="/delivery/Earnings"
					class="text-white hover:text-purple-300 px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>{{ $t('earnings') }}</router-link
				>
				<router-link
					to="/delivery/profile"
					class="text-white hover:text-purple-300 px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>{{ $t('profile') }}</router-link
				>
			</template>

			<!-- Customer Navigation -->
			<template v-else-if="authStore.isAuthenticated">
				<router-link
					to="/restaurants"
					class="text-white hover:text-purple-300 px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>{{ $t('restaurants') }}</router-link
				>
				<router-link
					to="/cart"
					class="text-white hover:text-purple-300 px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>{{ $t('cartNav') }}</router-link
				>
				<router-link
					to="/orders"
					class="text-white hover:text-purple-300 px-2 py-1 text-sm sm:px-3 sm:text-base rounded transition-colors no-underline"
					active-class="font-bold border-b-2 border-purple-400"
					>{{ $t('myOrders') }}</router-link
				>
			</template>
		</div>
	</nav>
</template>

<script setup>
import { useAuthStore } from '@/app/store/auth/auth.store';
import { useI18n } from 'vue-i18n';

const authStore = useAuthStore();
const { t } = useI18n();
</script>
