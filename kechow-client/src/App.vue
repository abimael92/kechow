<template>
	<div
		class="min-h-screen min-w-0 overflow-x-hidden font-sans bg-bg-light text-text-light dark:bg-bg-dark dark:text-text-dark"
	>
		<NetworkBanner />
		<ErrorBoundary>
			<router-view :key="route.fullPath" />
		</ErrorBoundary>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import ErrorBoundary from '@/shared/ui/ErrorBoundary.vue';
import NetworkBanner from '@/shared/ui/NetworkBanner.vue';

const route = useRoute();
</script>
