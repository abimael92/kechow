<template>
	<div>
		<h2 class="text-lg font-semibold mb-4">Menú</h2>
		<div
			v-for="item in items"
			:key="item.id"
			class="flex justify-between items-center border-b py-2"
		>
			<div>
				<p class="font-semibold">{{ item.name }}</p>
				<p class="text-sm text-gray-500">{{ item.price }} MXN</p>
			</div>
			<div class="space-x-2">
				<button class="text-blue-600" @click="$emit('edit', item)">✏️</button>
				<button class="text-red-600" @click="$emit('delete', item.id)">
					🗑️
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{ items: Array<{ id: number; name: string; price: number }> }>();
defineEmits(['edit', 'delete']);
</script>
