<template>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog
			as="div"
			class="fixed inset-0 z-[9999] overflow-y-auto"
			@close="closeModal"
		>
			<TransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black bg-opacity-50" />
			</TransitionChild>

			<!-- Modal content -->
			<div class="flex min-h-full items-center justify-center p-4 text-center">
				<TransitionChild
					as="template"
					enter="duration-300 ease-out"
					enter-from="opacity-0 scale-95"
					enter-to="opacity-100 scale-100"
					leave="duration-200 ease-in"
					leave-from="opacity-100 scale-100"
					leave-to="opacity-0 scale-95"
				>
					<DialogPanel
						class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
					>
						<DialogTitle
							as="h3"
							class="text-lg font-medium leading-6 text-gray-900"
						>
							{{ mode === 'create' ? 'Agregar nuevo ítem' : 'Editar ítem' }}
						</DialogTitle>

						<form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
							<!-- Name -->
							<div>
								<label
									for="name"
									class="block text-sm font-medium text-gray-700"
								>
									Nombre
								</label>
								<input
									v-model="form.name"
									id="name"
									type="text"
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								/>
							</div>

							<!-- Description -->
							<div>
								<label
									for="description"
									class="block text-sm font-medium text-gray-700"
								>
									Descripción
								</label>
								<textarea
									v-model="form.description"
									id="description"
									rows="3"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								/>
							</div>

							<!-- Price -->
							<div>
								<label
									for="price"
									class="block text-sm font-medium text-gray-700"
								>
									Precio
								</label>
								<input
									v-model.number="form.price"
									id="price"
									type="number"
									min="0"
									step="0.01"
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								/>
							</div>

							<!-- Category -->
							<div>
								<label
									for="category"
									class="block text-sm font-medium text-gray-700"
								>
									Categoría
								</label>
								<select
									v-model="form.category"
									id="category"
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								>
									<option value="">Seleccione una categoría</option>
									<option
										v-for="category in categories"
										:key="category.id"
										:value="category.id"
									>
										{{ category.name }}
									</option>
								</select>
							</div>

							<!-- Image -->
							<div>
								<label class="block text-sm font-medium text-gray-700"
									>Imagen</label
								>
								<div class="mt-1 flex items-center">
									<div class="h-16 w-16 overflow-hidden rounded bg-gray-100">
										<img
											v-if="form.imageUrl"
											:src="form.imageUrl"
											alt="Preview"
											class="h-full w-full object-cover"
										/>
										<div
											v-else
											class="flex h-full w-full items-center justify-center text-gray-400"
										>
											No image
										</div>
									</div>
									<button
										type="button"
										@click="triggerFileInput"
										class="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
									>
										Cambiar
									</button>
									<input
										ref="fileInput"
										type="file"
										class="hidden"
										accept="image/*"
										@change="handleImageUpload"
									/>
								</div>
							</div>

							<!-- Actions -->
							<div class="flex justify-end space-x-3 pt-4">
								<button
									type="button"
									@click="closeModal"
									class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
								>
									Cancelar
								</button>
								<button
									type="submit"
									class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
								>
									{{ mode === 'create' ? 'Crear' : 'Guardar' }}
								</button>
							</div>
						</form>
					</DialogPanel>
				</TransitionChild>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup>
import { ref, reactive, watch, defineProps, defineEmits } from 'vue';
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	TransitionChild,
	TransitionRoot,
} from '@headlessui/vue';

const props = defineProps({
	isOpen: Boolean,
	mode: { type: String, default: 'create' },
	categories: { type: Array, default: () => [] },
	restaurantId: { type: Number, required: true }, // ✅ link to owner’s restaurant
	initialData: {
		type: Object,
		default: () => ({
			name: '',
			description: '',
			price: 0,
			category: '',
			imageUrl: '',
		}),
	},
});

const emit = defineEmits(['close', 'submit']);

const form = reactive({ ...props.initialData });
const fileInput = ref(null);

// Reset form when modal opens
watch(
	() => props.isOpen,
	(isOpen) => {
		if (isOpen) Object.assign(form, props.initialData);
	}
);

const triggerFileInput = () => fileInput.value?.click();

const handleImageUpload = (event) => {
	const file = event.target.files[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = (e) => (form.imageUrl = e.target.result);
	reader.readAsDataURL(file);
};

const closeModal = () => emit('close');

const handleSubmit = () => {
	if (!form.name || !form.price || !form.category) {
		alert('Todos los campos obligatorios deben completarse');
		return;
	}
	emit('submit', { ...form, restaurantId: props.restaurantId });
};
</script>
