<template>
	<div class="card group overflow-hidden transition-all duration-300 hover:shadow-xl">
		<!-- Image -->
		<div class="aspect-video relative overflow-hidden">
			<div class="absolute inset-0 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900 flex items-center justify-center">
				<div class="text-4xl">{{ getEmoji(restaurant.cuisine) }}</div>
			</div>
			<!-- Rating Badge -->
			<div class="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
				<Star class="w-4 h-4 text-yellow-500 fill-yellow-500" />
				<span class="font-bold text-sm">{{ restaurant.rating }}</span>
			</div>
		</div>

		<!-- Content -->
		<div class="p-6">
			<div class="flex justify-between items-start mb-3">
				<h3 class="text-xl font-bold text-gray-900 dark:text-white">
					{{ restaurant.name }}
				</h3>
				<span class="text-sm font-medium px-3 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
					{{ restaurant.cuisine }}
				</span>
			</div>

			<div class="flex items-center gap-4 mb-4">
				<div class="flex items-center gap-1">
					<Clock class="w-4 h-4 text-gray-500" />
					<span class="text-sm text-gray-600 dark:text-gray-400">{{ restaurant.deliveryTime }}</span>
				</div>
			</div>

			<BaseButton 
				class="w-full bg-primary-500 hover:bg-primary-600 text-white"
				@click="viewRestaurant"
			>
				Ver Menú
			</BaseButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Star, Clock } from 'lucide-vue-next'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps<{
	restaurant: {
		id: number
		name: string
		cuisine: string
		rating: number
		deliveryTime: string
		image: string
	}
}>()

const getEmoji = (cuisine: string) => {
	const emojiMap: Record<string, string> = {
		'Mexicana': '🌮',
		'Italiana': '🍕',
		'Americana': '🍔',
		'Japonesa': '🍣',
		'Café & Postres': '☕'
	}
	return emojiMap[cuisine] || '🍽️'
}

const viewRestaurant = () => {
	router.push(`/restaurants/${props.restaurant.id}`)
}
</script>