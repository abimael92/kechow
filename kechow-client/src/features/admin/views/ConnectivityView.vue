<template>
	<div class="p-4 sm:p-6">
		<h1 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Estado de conexión</h1>
		<ConnectivityMonitor />
	</div>
</template>

<script setup lang="ts">
import ConnectivityMonitor from '../components/ConnectivityMonitor.vue';
</script>
