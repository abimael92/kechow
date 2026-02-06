<template>
	<div class="text-center relative">
		<!-- Step Number -->
		<div class="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
			{{ number }}
		</div>

		<!-- Icon -->
		<div class="mb-4 flex justify-center">
			<div class="p-3 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30">
				<component :is="icon" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
			</div>
		</div>

		<!-- Content -->
		<h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">
			{{ title }}
		</h3>
		<p class="text-gray-600 dark:text-gray-300">
			{{ description }}
		</p>

		<!-- Connector (except last) -->
		<div v-if="number < 4" class="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	number: number
	title: string
	description: string
	icon: any
}>()
</script>