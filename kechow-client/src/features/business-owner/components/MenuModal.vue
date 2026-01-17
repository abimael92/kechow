<template>
	<transition name="modal">
		<div class="fixed inset-0 z-50 overflow-y-auto">
			<!-- Backdrop -->
			<div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="close"></div>
			<!-- Modal Container -->
			<div class="flex min-h-full items-center justify-center p-4">
				<!-- Modal Content -->
				<div class="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
					<!-- Header -->
					<div class="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="w-12 h-12 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center">
									<i :class="mode === 'add' ? 'ri-add-line' : 'ri-edit-line'" class="text-white text-lg"></i>
								</div>
								<div>
                                    <h2 class="text-bubble-h2 text-4xl shadow-primary-500 mt-2 mb-0">
                                    {{ mode === 'add' ? $t('addMenuItem') : $t('editMenuItem') }}
                                    </h2>
									<p class="text-sm text-neutral-950 dark:text-neutral-200 select-none">
										{{ mode === 'add' ? $t('addNewMenuItemDescription') : $t('editMenuItemDescription') }}
									</p>
								</div>
							</div>
							<button
								@click="close"
								class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
							>
								<i class="ri-close-line text-xl"></i>
							</button>
						</div>
					</div>
					<!-- Form -->
					<div class="p-6">
						<form @submit.prevent="save" class="space-y-6">
							<!-- Basic Information -->
							<div class="grid md:grid-cols-2 gap-6">
								<!-- Name -->
								<div class="space-y-2">
									<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
										{{ $t('name') }} *
									</label>
									<input
										v-model="formData.name"
										type="text"
										required
										:placeholder="$t('namePlaceholder')"
										class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
									/>
								</div>
								
								<!-- Category -->
								<div class="space-y-2">
									<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
										{{ $t('category') }} *
									</label>
									<div class="relative">
										<select
											v-model="formData.category"
											required
											class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
										>
											<option value="" disabled>{{ $t('selectCategory') }}</option>
											<option value="pizza">{{ $t('pizza') }}</option>
											<option value="pasta">{{ $t('pasta') }}</option>
											<option value="salads">{{ $t('salads') }}</option>
											<option value="desserts">{{ $t('desserts') }}</option>
											<option value="drinks">{{ $t('drinks') }}</option>
										</select>
										<i class="ri-arrow-down-s-line absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
									</div>
								</div>
							</div>
							
							<!-- Description -->
							<div class="space-y-2">
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
									{{ $t('description') }}
								</label>
								<textarea
									v-model="formData.description"
									rows="3"
									:placeholder="$t('descriptionPlaceholder')"
									class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
								></textarea>
							</div>
							
							<!-- Price & Availability -->
							<div class="grid md:grid-cols-2 gap-6">
								<!-- Price -->
								<div class="space-y-2">
									<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
										{{ $t('price') }} *
									</label>
									<div class="relative">
										<span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
										<input
											v-model="formData.price"
											type="number"
											min="0"
											step="0.01"
											required
											placeholder="0.00"
											class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
										/>
									</div>
								</div>
								
								<!-- Preparation Time -->
								<div class="space-y-2">
									<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
										{{ $t('preparationTime') }}
									</label>
									<div class="relative">
										<input
											v-model="formData.preparationTime"
											type="number"
											min="1"
											placeholder="15"
											class="w-full pr-12 pl-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
										/>
										<span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">min</span>
									</div>
								</div>
							</div>
							
							<!-- Tags -->
							<div class="space-y-2">
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
									{{ $t('tags') }}
								</label>
								<div class="flex flex-wrap gap-2 mb-2">
									<span
										v-for="(tag, index) in formData.tags"
										:key="index"
										class="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm"
									>
										{{ tag }}
										<button
											type="button"
											@click="removeTag(index)"
											class="text-primary-500 hover:text-primary-700 dark:hover:text-primary-200"
										>
											<i class="ri-close-line text-sm"></i>
										</button>
									</span>
								</div>
								<div class="flex gap-2">
									<input
										v-model="newTag"
										type="text"
										:placeholder="$t('addTagPlaceholder')"
										@keydown.enter.prevent="addTag"
										class="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
									/>
									<button
										type="button"
										@click="addTag"
										class="px-4 py-2.5 bg-primary-500 dark:bg-primary-700 text-primary-700 dark:text-primary-300 rounded-xl hover:bg-primary-200 dark:hover:bg-primary-600 transition-colors"
									>
										{{ $t('add') }}
									</button>
								</div>
							</div>
							
							<!-- Image Upload -->
							<div class="space-y-2">
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
									{{ $t('image') }}
								</label>
								<div
									@click="triggerFileInput"
									class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
									:class="{ 'border-primary-500 dark:border-primary-400': isDragging }"
									@dragover.prevent="isDragging = true"
									@dragleave.prevent="isDragging = false"
									@drop.prevent="handleDrop"
								>
									<div v-if="!formData.image" class="space-y-3">
										<div class="w-12 h-12 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
											<i class="ri-image-line text-gray-400 text-xl"></i>
										</div>
										<div>
											<p class="text-gray-600 dark:text-gray-400 font-medium">
												{{ $t('dragDropImage') }}
											</p>
											<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
												{{ $t('orClickToUpload') }}
											</p>
										</div>
										<p class="text-xs text-gray-400 dark:text-gray-500">
											PNG, JPG up to 5MB
										</p>
									</div>
									<div v-else class="space-y-3">
										<img :src="formData.image" alt="Preview" class="w-32 h-32 mx-auto object-cover rounded-lg">
										<button
											type="button"
											@click.stop="removeImage"
											class="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
										>
											{{ $t('removeImage') }}
										</button>
									</div>
									<input
										ref="fileInput"
										type="file"
										accept="image/*"
										class="hidden"
										@change="handleFileUpload"
									/>
								</div>
							</div>
							
							<!-- Availability & Special -->
							<div class="grid md:grid-cols-2 gap-6">
								<!-- Availability -->
								<div class="space-y-3">
									<label class="flex items-center gap-3 cursor-pointer">
										<div class="relative inline-flex items-center">
											<input
												v-model="formData.available"
												type="checkbox"
												class="sr-only peer"
											/>
											<div class="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
										</div>
										<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
											{{ $t('available') }}
										</span>
									</label>
									<p class="text-xs text-gray-500 dark:text-gray-400">
										{{ $t('availabilityDescription') }}
									</p>
								</div>
								
								<!-- Special Item -->
								<div class="space-y-3">
									<label class="flex items-center gap-3 cursor-pointer">
										<div class="relative inline-flex items-center">
											<input
												v-model="formData.isSpecial"
												type="checkbox"
												class="sr-only peer"
											/>
											<div class="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
										</div>
										<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
											{{ $t('specialItem') }}
										</span>
									</label>
									<p class="text-xs text-gray-500 dark:text-gray-400">
										{{ $t('specialItemDescription') }}
									</p>
								</div>
							</div>
							
							<!-- Calories & Allergens -->
							<div class="grid md:grid-cols-2 gap-6">
								<!-- Calories -->
								<div class="space-y-2">
									<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
										{{ $t('calories') }}
									</label>
									<div class="relative">
										<input
											v-model="formData.calories"
											type="number"
											min="0"
											placeholder="250"
											class="w-full pr-12 pl-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
										/>
										<span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">cal</span>
									</div>
								</div>
								
								<!-- Allergens -->
								<div class="space-y-2">
									<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
										{{ $t('allergens') }}
									</label>
									<select
										v-model="formData.allergens"
										multiple
										class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all h-32"
									>
										<option value="gluten">{{ $t('gluten') }}</option>
										<option value="dairy">{{ $t('dairy') }}</option>
										<option value="nuts">{{ $t('nuts') }}</option>
										<option value="soy">{{ $t('soy') }}</option>
										<option value="eggs">{{ $t('eggs') }}</option>
										<option value="fish">{{ $t('fish') }}</option>
										<option value="shellfish">{{ $t('shellfish') }}</option>
									</select>
								</div>
							</div>
						</form>
					</div>
					
					<!-- Footer -->
					<div class="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
						<div class="flex justify-end gap-3">
							<button
								type="button"
								@click="close"
								class="px-6 py-2.5 text-gray-700 dark:text-gray-300 font-medium bg-tertiary-500 dark:bg-gray-700 hover:bg-tertiary-600 dark:hover:bg-gray-600 rounded-xl transition-colors"
							>
								{{ $t('cancel') }}
							</button>
							<button
								type="button"
								@click="save"
								:disabled="saving"
								class="px-6 py-2.5 text-white font-medium bg-gradient-to-r from-primary-600 to-primary-500 hover:shadow-lg hover:shadow-primary-500/30 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							>
								<i v-if="saving" class="ri-loader-4-line animate-spin"></i>
								<i v-else :class="mode === 'add' ? 'ri-add-line' : 'ri-save-line'"></i>
								{{ mode === 'add' ? $t('addMenuItem') : $t('saveChanges') }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MenuItem } from '../types/';

const { t } = useI18n();

interface Props {
  mode: 'add' | 'edit';
  item?: MenuItem | null;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'add',
  item: null
});

const emit = defineEmits<{
  close: [];
  save: [itemData: Partial<MenuItem>];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const newTag = ref('');
const saving = ref(false);

// Form data structure
const formData = ref({
  name: '',
  category: '',
  description: '',
  price: 0,
  preparationTime: 15,
  tags: [] as string[],
  image: '',
  available: true,
  isSpecial: false,
  calories: 0,
  allergens: [] as string[]
});

// ⬇️⬇️⬇️ MOVE ALL FUNCTIONS UP HERE ⬇️⬇️⬇️
const resetForm = () => {
  formData.value = {
    name: '',
    category: '',
    description: '',
    price: 0,
    preparationTime: 15,
    tags: [],
    image: '',
    available: true,
    isSpecial: false,
    calories: 0,
    allergens: []
  };
  newTag.value = '';
};

const close = () => {
  emit('close');
};

const save = async () => {
  if (!formData.value.name || !formData.value.category || formData.value.price <= 0) {
    // Show validation error
    return;
  }

  saving.value = true;
  try {
    emit('save', formData.value);
  } finally {
    saving.value = false;
  }
};

const addTag = () => {
  if (newTag.value.trim() && !formData.value.tags.includes(newTag.value.trim())) {
    formData.value.tags.push(newTag.value.trim());
    newTag.value = '';
  }
};

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1);
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        formData.value.image = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0];
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          formData.value.image = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }
};

const removeImage = () => {
  formData.value.image = '';
};

// ⬇️⬇️⬇️ NOW PUT THE WATCH HERE (AFTER FUNCTIONS) ⬇️⬇️⬇️
// Initialize form when props change
watch(() => props.item, (newItem) => {
  if (newItem) {
    formData.value = {
      name: newItem.name || '',
      category: newItem.category || '',
      description: newItem.description || '',
      price: newItem.price || 0,
      preparationTime: newItem.preparationTime || 15,
      tags: newItem.tags || [],
      image: newItem.image || '',
      available: newItem.available ?? true,
      isSpecial: newItem.isSpecial || false,
      calories: newItem.calories || 0,
      allergens: newItem.allergens || []
    };
  } else {
    resetForm(); // ✅ Now this function exists!
  }
}, { immediate: true });

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
	transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
	transform: scale(0.95);
}

/* Custom scrollbar for allergens select */
select[multiple] {
	scrollbar-width: thin;
	scrollbar-color: rgba(168, 85, 247, 0.3) transparent;
}

select[multiple]::-webkit-scrollbar {
	width: 6px;
}

select[multiple]::-webkit-scrollbar-track {
	background: transparent;
}

select[multiple]::-webkit-scrollbar-thumb {
	background-color: rgba(168, 85, 247, 0.3);
	border-radius: 3px;
}

.dark select[multiple]::-webkit-scrollbar-thumb {
	background-color: rgba(168, 85, 247, 0.5);
}
</style>