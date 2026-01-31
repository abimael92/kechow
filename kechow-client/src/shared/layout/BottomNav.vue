<template>
	<!-- Mobile only: fixed bottom nav. Role from layout — no role leaks. -->
	<nav
		v-if="items.length > 0"
		class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#2a1a40]/95 backdrop-blur-md border-t border-white/10 min-w-0"
		role="navigation"
		:aria-label="`Navegación rápida ${roleLabel}`"
	>
		<div class="flex items-center justify-around min-h-[56px] px-2 gap-1">
			<router-link
				v-for="item in items"
				:key="item.path"
				:to="item.path"
				class="flex flex-col items-center justify-center min-h-[44px] min-w-[56px] py-2 px-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors flex-1 max-w-[120px]"
				:class="{ 'text-white bg-white/15 font-semibold': isActive(item.path) }"
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
