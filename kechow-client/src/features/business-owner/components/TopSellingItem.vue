<template>
	<div class="flex items-center justify-between">
		<div class="flex items-center">
			<div
				class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3"
			>
				<span class="text-orange-600 font-bold text-sm">{{ rank }}</span>
			</div>
			<div>
				<p class="font-medium text-gray-900">{{ name }}</p>
				<p class="text-sm text-gray-500">{{ orders }} orders</p>
			</div>
		</div>
		<span class="font-bold text-gray-900">{{ revenue }}</span>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	rank: string;
	name: string;
	orders: string;
	revenue: string;
}>();
</script>
