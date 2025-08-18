<template>
	<div class="grid gap-4">
		<div v-for="item in items" :key="item.id" class="card">
			<h3>{{ item.name }} - ${{ item.price }}</h3>
			<p>{{ item.description }}</p>
			<button @click="$emit('edit', item)" class="btn">Edit</button>
			<button @click="$emit('delete', item.id)" class="btn btn-red">
				Delete
			</button>
		</div>
	</div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
	items: Array,
});
</script>
