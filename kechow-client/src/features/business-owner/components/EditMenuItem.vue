<template>
	<div class="p-4 border rounded-md space-y-4 bg-white shadow">
		<h2 class="text-lg font-semibold">
			{{ props.item ? 'Editar platillo' : 'Agregar platillo' }}
		</h2>

		<form @submit.prevent="handleSubmit" class="space-y-3">
			<div>
				<label class="block text-sm font-medium">Nombre</label>
				<input
					v-model="form.name"
					type="text"
					class="w-full border p-2 rounded"
					required
				/>
			</div>

			<div>
				<label class="block text-sm font-medium">Precio</label>
				<input
					v-model.number="form.price"
					type="number"
					class="w-full border p-2 rounded"
					required
				/>
			</div>

			<div>
				<label class="block text-sm font-medium">Descripción</label>
				<textarea
					v-model="form.description"
					class="w-full border p-2 rounded"
					rows="3"
					required
				></textarea>
			</div>

			<div class="flex gap-2">
				<button
					type="submit"
					class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
				>
					{{ props.item ? 'Actualizar' : 'Agregar' }}
				</button>
				<button
					v-if="props.item"
					@click="emit('cancel')"
					type="button"
					class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
				>
					Cancelar
				</button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
	item?: {
		id?: number;
		name: string;
		price: number;
		description?: string;
	};
}>();

const emit = defineEmits<{
	(e: 'save', item: { name: string; price: number; description: string }): void;
	(e: 'cancel'): void;
}>();

const form = ref<{ name: string; price: number; description: string }>({
	name: '',
	price: 0,
	description: '',
});

watch(
	() => props.item,
	(val) => {
		if (val) {
			form.value = {
				name: val.name,
				price: val.price,
				description: val.description ?? '', // Ensure description is a string
			};
		}
	},
	{ immediate: true }
);

function handleSubmit() {
	emit('save', {
		name: form.value.name.trim(),
		price: form.value.price,
		description: form.value.description.trim(),
	});
}
</script>
