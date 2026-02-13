<template>
	<div 
		class="p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl border rounded-2xl"
		:class="color === 'primary' 
			? 'bg-primary-100 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800 hover:border-primary-500'
			: 'bg-accent-100 dark:bg-accent-900/10 border-accent-200 dark:border-accent-800 hover:border-accent-500'"
	>
		<div 
			class="inline-flex p-3 rounded-xl mb-4"
			:class="color === 'primary'
				? 'bg-primary-100 dark:bg-primary-900/30'
				: 'bg-accent-100 dark:bg-accent-900/30'"
		>
			<component 
				:is="icon" 
				class="w-8 h-8"
				:class="color === 'primary'
					? 'text-primary-600 dark:text-primary-400'
					: 'text-accent-600 dark:text-accent-400'"
			/>
		</div>
		<h3 
			class="text-xl font-bold mb-2"
			:class="color === 'primary'
				? 'text-primary-700 dark:text-primary-300'
				: 'text-accent-700 dark:text-accent-300'"
		>
			{{ title }}
		</h3>
		<p class="text-gray-600 dark:text-gray-300">
			{{ description }}
		</p>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	icon: any
	title: string
	description: string
	color: 'primary' | 'accent'
}>()
</script>