<template>
	<form @submit.prevent="onSubmit" class="space-y-4">
		<input v-model="form.name" placeholder="Name" required class="input" />
		<textarea
			v-model="form.description"
			placeholder="Description"
			class="input"
		/>
		<input
			v-model.number="form.price"
			type="number"
			placeholder="Price"
			required
			class="input"
		/>
		<select v-model="form.category" required class="input">
			<option value="">Select category</option>
			<option v-for="c in categories" :key="c.id" :value="c.id">
				{{ c.name }}
			</option>
		</select>
		<button type="submit" class="btn">Save</button>
	</form>
</template>

<script setup>
import { reactive, defineProps, defineEmits } from 'vue';

const props = defineProps({
	initialData: Object,
	categories: Array,
});

const emit = defineEmits(['submit']);

const form = reactive({ ...props.initialData });

const onSubmit = () => emit('submit', { ...form });
</script>
