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
							class="w-full max-w-md transform overflow-hidden rounded-card bg-card p-4 sm:p-5 text-left align-middle shadow-medium transition-all min-w-0 border border-secondary-200"
						>
							<div class="sm:flex sm:items-start gap-3 sm:gap-4">
								<div
									class="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-error-bg sm:mx-0"
								>
									<span class="text-error text-lg sm:text-xl font-bold" aria-hidden="true">!</span>
								</div>
								<div class="mt-3 text-center sm:ml-0 sm:mt-0 sm:text-left min-w-0 flex-1">
									<DialogTitle
										as="h3"
										class="text-base sm:text-lg font-medium leading-snug text-secondary-900 dark:text-white break-words"
									>
										{{ title }}
									</DialogTitle>
									<div class="mt-2">
										<p class="text-sm text-secondary-500 dark:text-secondary-400 break-words">
											{{ message }}
										</p>
									</div>
								</div>
							</div>

							<div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:gap-3">
								<button
									type="button"
									class="inline-flex w-full justify-center rounded-button border border-transparent bg-error px-4 py-2.5 sm:py-2 text-sm sm:text-base font-medium text-white shadow-soft hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 min-h-[44px] sm:w-auto sm:ml-0"
									@click="confirm"
								>
									{{ confirmButtonText }}
								</button>
								<button
									type="button"
									class="mt-3 inline-flex w-full justify-center rounded-button border border-secondary-300 bg-card px-4 py-2.5 sm:py-2 text-sm sm:text-base font-medium text-secondary-800 dark:text-secondary-200 shadow-soft hover:bg-panel focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-h-[44px] sm:mt-0 sm:w-auto"
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
