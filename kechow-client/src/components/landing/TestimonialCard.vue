<template>
	<div class="card p-6 transition-all duration-300 hover:shadow-lg">
		<!-- Rating -->
		<div class="flex items-center gap-1 mb-4">
			<Star 
				v-for="n in 5" 
				:key="n"
				class="w-5 h-5"
				:class="n <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-700'"
			/>
		</div>

		<!-- Testimonial -->
		<p class="text-gray-700 dark:text-gray-300 italic mb-6">
			"{{ text }}"
		</p>

		<!-- Author -->
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-200 flex items-center justify-center text-white font-bold">
				{{ avatar }}
			</div>
			<div>
				<div class="font-bold text-gray-900 dark:text-white">{{ name }}</div>
				<div class="text-sm text-gray-600 dark:text-gray-400">Cliente de Jiménez</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Star } from 'lucide-vue-next'

defineProps<{
	name: string
	text: string
	rating: number
	avatar: string
}>()
</script>