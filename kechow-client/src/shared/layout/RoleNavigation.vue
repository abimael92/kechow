<template>
	<!-- Desktop only: top nav. Mobile uses Header drawer (no role leaks; role from layout). -->
	<nav
		class="hidden md:block sticky top-16 sm:top-20 z-40 bg-[#2a1a40]/90 backdrop-blur-md border-b border-white/10 shadow-sm min-w-0 overflow-x-hidden"
		role="navigation"
		:aria-label="`Navegación ${roleLabel}`"
	>
		<div class="flex items-center justify-center gap-1 px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex-wrap">
			<router-link
				v-for="item in navigationItems"
				:key="item.path"
				:to="item.path"
				class="flex items-center min-h-[44px] min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 relative break-words"
				:class="{
					'text-white bg-white/15 font-semibold': isActive(item.path),
					'text-white/70': !isActive(item.path),
				}"
			>
				<span class="truncate">{{ item.label }}</span>
				<span
					v-if="isActive(item.path)"
					class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400 rounded-full"
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
