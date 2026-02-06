<template>
	<div 
		class="card group p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl"
		:class="`hover:border-${color}-500`"
	>
		<div 
			class="inline-flex p-3 rounded-xl mb-4 transition-colors duration-300"
			:class="`bg-${color}-100 dark:bg-${color}-900/30 group-hover:bg-${color}-200 dark:group-hover:bg-${color}-800/50`"
		>
			<component 
				:is="icon" 
				class="w-8 h-8 transition-colors duration-300"
				:class="`text-${color}-600 dark:text-${color}-400`"
			/>
		</div>
		<h3 
			class="text-xl font-bold mb-2 transition-colors duration-300"
			:class="`group-hover:text-${color}-600 dark:group-hover:text-${color}-400`"
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