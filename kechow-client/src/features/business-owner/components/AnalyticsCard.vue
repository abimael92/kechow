<template>
	<div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-white text-sm">{{ title }}</p>
				<p class="text-3xl font-bold text-gray-900 mt-1">{{ value }}</p>
				<p
					class="text-sm mt-1"
					:class="positive ? 'text-green-600' : 'text-red-600'"
				>
					{{ change }}
				</p>
			</div>
			<div
				class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"
			>
				<i
					:class="icon"
					class="text-orange-600 text-xl w-6 h-6 flex items-center justify-center"
				></i>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	title: string;
	value: string;
	change: string;
	icon: string;
	positive?: boolean;
}>();
</script>
