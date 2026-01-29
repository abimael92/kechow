<template>
	<div
		class="min-h-screen bg-bg-light text-text-light dark:bg-bg-dark dark:text-text-dark font-sans"
	>
		<NetworkBanner />
		<ErrorBoundary>
			<router-view />
		</ErrorBoundary>
	</div>
</template>

<script setup lang="ts">
import ErrorBoundary from '@/shared/ui/ErrorBoundary.vue';
import NetworkBanner from '@/shared/ui/NetworkBanner.vue';
</script>
