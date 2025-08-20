<template>
	<TransitionRoot appear :show="true" as="template">
		<Dialog
			as="div"
			class="fixed inset-0 z-[9999] overflow-y-auto"
			@close="$emit('close')"
		>
			<!-- Overlay -->
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
			<div class="flex min-h-full items-center justify-center p-4">
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
						class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all"
					>
						<!-- Header -->
						<div class="flex justify-between items-center p-6 border-b">
							<DialogTitle class="text-xl font-semibold text-gray-900">
								{{ isEditing ? 'Editar Item' : 'Agregar Item' }}
							</DialogTitle>
							<button
								@click="$emit('close')"
								class="rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
								aria-label="Cerrar"
							>
								<IconClose class="h-6 w-6" />
							</button>
						</div>

						<!-- Body -->
						<div class="p-6">
							<MenuItemForm
								:item="item"
								:is-editing="isEditing"
								@submit="handleSubmit"
								@cancel="$emit('close')"
							/>
						</div>
					</DialogPanel>
				</TransitionChild>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import type { MenuItem } from '../services/businessOwner.service';
import MenuItemForm from './MenuItemForm.vue';
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	TransitionChild,
	TransitionRoot,
} from '@headlessui/vue';
import IconClose from '@shared/ui/IconClose.vue';

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

const emit = defineEmits<{
	close: [];
	save: [itemData: Omit<MenuItem, 'id'>];
}>();

function handleSubmit(data: Omit<MenuItem, 'id'>) {
	emit('save', data);
}
</script>
