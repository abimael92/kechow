<template>
	<div
		class="min-h-screen min-w-0 overflow-x-hidden font-sans bg-gradient-to-br from-primary-50 via-primary-100/40 to-primary-200/50 text-secondary-900 dark:bg-secondary-900 dark:text-secondary-100 dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-800"
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
