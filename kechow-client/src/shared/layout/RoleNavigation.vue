<template>
	<!-- Desktop only: top nav. Mobile uses Header drawer (no role leaks; role from layout). -->
	<nav
		class="hidden md:block sticky top-16 sm:top-20 z-40 bg-gradient-to-r from-primary-50/90 via-white to-primary-50/90 dark:bg-gray-900 dark:[background-image:none] dark:border-gray-700 backdrop-blur-sm border-b border-primary-200/80 shadow-soft min-w-0 overflow-x-hidden"
		role="navigation"
		:aria-label="`Navegación ${roleLabel}`"
	>
		<div class="flex items-center justify-center gap-1 px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex-wrap">
			<router-link
				v-for="item in navigationItems"
				:key="item.path"
				:to="item.path"
				class="flex items-center min-h-[44px] min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-secondary-700 dark:text-gray-200 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 relative break-words"
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
		</div>
	</nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { getNavItemsForRole, roleLabels, type NavRole } from '@/shared/data/nav.config';

const props = defineProps<{
	role: NavRole;
}>();

const route = useRoute();

const roleLabel = computed(() => roleLabels[props.role] ?? '');
const navigationItems = computed(() => getNavItemsForRole(props.role));

function isActive(path: string): boolean {
	if (path === route.path) return true;
	if (route.path.startsWith(path) && path !== '/') return true;
	return false;
}
</script>
