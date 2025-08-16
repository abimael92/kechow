<template>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" class="relative z-10" @close="closeModal">
			<TransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black bg-opacity-25" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-y-auto">
				<div
					class="flex min-h-full items-center justify-center p-4 text-center"
				>
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
								<div>
									<label
										for="name"
										class="block text-sm font-medium text-gray-700"
										>Nombre</label
									>
									<input
										type="text"
										id="name"
										v-model="form.name"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										required
									/>
								</div>

								<div>
									<label
										for="description"
										class="block text-sm font-medium text-gray-700"
										>Descripción</label
									>
									<textarea
										id="description"
										v-model="form.description"
										rows="3"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
								</div>

								<div>
									<label
										for="price"
										class="block text-sm font-medium text-gray-700"
										>Precio</label
									>
									<input
										type="number"
										id="price"
										v-model="form.price"
										min="0"
										step="0.01"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										required
									/>
								</div>

								<div>
									<label
										for="category"
										class="block text-sm font-medium text-gray-700"
										>Categoría</label
									>
									<select
										id="category"
										v-model="form.category"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										required
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

								<div>
									<label class="block text-sm font-medium text-gray-700"
										>Imagen</label
									>
									<div class="mt-1 flex items-center">
										<span
											class="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100"
										>
											<img
												v-if="form.imageUrl"
												:src="form.imageUrl"
												alt="Preview"
												class="h-full w-full object-cover"
											/>
											<span
												v-else
												class="h-full w-full text-gray-300 flex items-center justify-center"
											>
												No image
											</span>
										</span>
										<button
											type="button"
											@click="triggerFileInput"
											class="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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

								<div class="flex justify-end space-x-3 pt-4">
									<button
										type="button"
										@click="closeModal"
										class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									>
										Cancelar
									</button>
									<button
										type="submit"
										class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									>
										{{ mode === 'create' ? 'Crear' : 'Guardar' }}
									</button>
								</div>
							</form>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits } from 'vue';
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	TransitionChild,
	TransitionRoot,
} from '@headlessui/vue';

const props = defineProps({
	isOpen: {
		type: Boolean,
		required: true,
	},
	mode: {
		type: String,
		default: 'create',
		validator: (value) => ['create', 'edit'].includes(value),
	},
	categories: {
		type: Array,
		default: () => [],
	},
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

const form = reactive({
	...props.initialData,
});

const fileInput = ref(null);

const triggerFileInput = () => {
	fileInput.value.click();
};

const handleImageUpload = (event) => {
	const file = event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			form.imageUrl = e.target.result;
		};
		reader.readAsDataURL(file);
	}
};

const closeModal = () => {
	emit('close');
};

const handleSubmit = () => {
	emit('submit', { ...form });
};
</script>
