<template>
	<!-- Mobile only: fixed bottom nav. Role from layout — no role leaks. -->
	<nav
		v-if="items.length > 0"
		class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-primary-100/70 via-white to-white dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-gray-900 dark:border-gray-700 border-t border-primary-200/80 shadow-soft min-w-0 dark:[background-image:none]"
		role="navigation"
		:aria-label="`Navegación rápida ${roleLabel}`"
	>
		<div class="flex items-center justify-around min-h-[56px] px-2 gap-1">
			<router-link
				v-for="item in items"
				:key="item.path"
				:to="item.path"
				class="flex flex-col items-center justify-center min-h-[44px] min-w-[56px] py-2 px-2 rounded-lg text-secondary-500 dark:text-gray-400 hover:text-secondary-900 dark:hover:text-white transition-colors flex-1 max-w-[120px]"
				:class="{ 'text-primary-500 dark:text-primary-400 font-semibold': isActive(item.path) }"
			>
				<span class="text-xs sm:text-sm truncate w-full text-center break-words line-clamp-1">{{ item.label }}</span>
			</router-link>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { getNavItemsForRole, roleLabels, type NavRole } from '@/shared/data/nav.config';

const props = defineProps<{
	role: NavRole | null | undefined;
}>();

const route = useRoute();

const roleLabel = computed(() => (props.role ? roleLabels[props.role] : ''));
/** Show max 5 items on bottom nav for tap targets. */
const items = computed(() => getNavItemsForRole(props.role ?? undefined).slice(0, 5));

function isActive(path: string): boolean {
	if (path === route.path) return true;
	if (route.path.startsWith(path) && path !== '/') return true;
	return false;
}
</script>
