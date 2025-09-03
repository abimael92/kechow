<template>
	<div
		class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
	>
		<div class="relative">
			<img
				:alt="item.name"
				:src="item.image"
				class="w-full h-48 object-cover object-top"
				@error="handleImageError"
			/>
			<div class="absolute top-3 left-3">
				<span
					class="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium"
				>
					{{ item.category }}
				</span>
			</div>
			<div class="absolute top-3 right-3">
				<button
					@click="toggleAvailability"
					:class="[
						'w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer',
						item.available
							? 'bg-green-100 text-green-600'
							: 'bg-red-100 text-red-600',
					]"
				>
					<i
						:class="item.available ? 'ri-check-line' : 'ri-close-line'"
						class="w-4 h-4 flex items-center justify-center"
					></i>
				</button>
			</div>
		</div>

		<div class="p-4">
			<div class="flex justify-between items-start mb-2">
				<h3 class="font-semibold text-gray-900 text-lg">{{ item.name }}</h3>
				<span class="font-bold text-orange-600 text-lg"
					>${{ item.price.toFixed(2) }}</span
				>
			</div>

			<p class="text-gray-600 text-sm mb-4">{{ item.description }}</p>

			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<span
						:class="[
							'w-3 h-3 rounded-full',
							item.available ? 'bg-green-500' : 'bg-red-500',
						]"
					></span>
					<span class="text-sm text-gray-600">
						{{ item.available ? 'Available' : 'Out of stock' }}
					</span>
				</div>

				<div class="flex space-x-2">
					<button
						@click="emitEdit"
						class="text-gray-600 hover:text-orange-600 p-2 cursor-pointer"
					>
						<i
							class="ri-edit-line w-4 h-4 flex items-center justify-center"
						></i>
					</button>
					<button
						@click="emitDelete"
						class="text-gray-600 hover:text-red-600 p-2 cursor-pointer"
					>
						<i
							class="ri-delete-bin-line w-4 h-4 flex items-center justify-center"
						></i>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { MenuItem } from '../types';

const props = defineProps<{
	item: MenuItem;
}>();

const emit = defineEmits<{
	(event: 'edit', item: MenuItem): void;
	(event: 'delete', item: MenuItem): void;
	(event: 'toggle-availability', item: MenuItem): void;
}>();

const defaultImage = ref('https://via.placeholder.com/300x200?text=No+Image');

const handleImageError = (event: Event) => {
	const img = event.target as HTMLImageElement;
	img.src = defaultImage.value;
};

const emitEdit = () => {
	emit('edit', props.item);
};

const emitDelete = () => {
	emit('delete', props.item);
};

const toggleAvailability = () => {
	emit('toggle-availability', props.item);
};
</script>
