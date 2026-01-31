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
					class="flex min-h-full items-center justify-center p-4 sm:p-6 text-center"
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
							class="w-full max-w-md transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-4 sm:p-6 text-left align-middle shadow-xl transition-all min-w-0"
						>
							<div class="sm:flex sm:items-start gap-3 sm:gap-4">
								<div
									class="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0"
								>
									<span class="text-red-600 dark:text-red-400 text-lg sm:text-xl font-bold" aria-hidden="true">!</span>
								</div>
								<div class="mt-3 text-center sm:ml-0 sm:mt-0 sm:text-left min-w-0 flex-1">
									<DialogTitle
										as="h3"
										class="text-base sm:text-lg font-medium leading-snug text-gray-900 dark:text-white break-words"
									>
										{{ title }}
									</DialogTitle>
									<div class="mt-2">
										<p class="text-sm text-gray-500 dark:text-gray-400 break-words">
											{{ message }}
										</p>
									</div>
								</div>
							</div>

							<div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:gap-3">
								<button
									type="button"
									class="inline-flex w-full justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2.5 sm:py-2 text-sm sm:text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-h-[44px] sm:w-auto sm:ml-0"
									@click="confirm"
								>
									{{ confirmButtonText }}
								</button>
								<button
									type="button"
									class="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 sm:py-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-h-[44px] sm:mt-0 sm:w-auto"
									@click="closeModal"
								>
									{{ cancelButtonText }}
								</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup>
import { ref } from 'vue';
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
	title: {
		type: String,
		default: 'Confirmar acción',
	},
	message: {
		type: String,
		default:
			'¿Estás seguro de que quieres realizar esta acción? No se puede deshacer.',
	},
	confirmButtonText: {
		type: String,
		default: 'Confirmar',
	},
	cancelButtonText: {
		type: String,
		default: 'Cancelar',
	},
});

const emit = defineEmits(['confirm', 'close']);

const closeModal = () => {
	emit('close');
};

const confirm = () => {
	emit('confirm');
	closeModal();
};
</script>
