<template>
	<transition name="modal">
		<div class="menu-item-modal">
			<!-- Backdrop -->
			<div class="modal-backdrop" @click="close"></div>
			<!-- Modal Container -->
			<div class="modal-container">
				<!-- Modal Content -->
				<div class="modal-content">
					<!-- Header -->
					<div class="modal-header">
						<div class="header-content">
							<div class="header-icon-container">
								<i :class="mode === 'add' ? 'ri-add-line' : 'ri-edit-line'" class="header-icon"></i>
							</div>
							<div>
                                <h2 class="modal-title">
                                {{ mode === 'add' ? $t('addMenuItem') : $t('editMenuItem') }}
                                </h2>
								<p class="modal-subtitle">
									{{ mode === 'add' ? $t('addNewMenuItemDescription') : $t('editMenuItemDescription') }}
								</p>
							</div>
						</div>
						<button
							@click="close"
							class="close-button"
							:aria-label="$t('close')"
						>
							<i class="ri-close-line"></i>
						</button>
					</div>
					<!-- Form -->
					<div class="modal-body">
						<form @submit.prevent="save" class="modal-form">
							<!-- Basic Information -->
							<div class="form-grid">
								<!-- Name -->
								<div class="form-group">
									<label class="form-label">
										{{ $t('name') }} <span class="required-indicator">*</span>
									</label>
									<input
										v-model="formData.name"
										type="text"
										required
										:placeholder="$t('namePlaceholder')"
										class="form-input"
										:aria-label="$t('name')"
									/>
								</div>
								
								<!-- Category -->
								<div class="form-group">
									<label class="form-label">
										{{ $t('category') }} <span class="required-indicator">*</span>
									</label>
									<div class="select-container">
										<select
											v-model="formData.category"
											required
											class="form-select"
											:aria-label="$t('category')"
										>
											<option value="" disabled>{{ $t('selectCategory') }}</option>
											<option value="appetizers">{{ $t('appetizers') }}</option>
											<option value="main_courses">{{ $t('mainCourses') }}</option>
											<option value="desserts">{{ $t('desserts') }}</option>
											<option value="drinks">{{ $t('drinks') }}</option>
											<option value="specials">{{ $t('specials') }}</option>
										</select>
										<i class="ri-arrow-down-s-line select-icon"></i>
									</div>
								</div>
							</div>
							
							<!-- Description -->
							<div class="form-group">
								<label class="form-label">
									{{ $t('description') }}
								</label>
								<textarea
									v-model="formData.description"
									rows="3"
									:placeholder="$t('descriptionPlaceholder')"
									class="form-textarea"
									:aria-label="$t('description')"
								></textarea>
							</div>
							
							<!-- Price & Preparation Time -->
							<div class="form-grid">
								<!-- Price -->
								<div class="form-group">
									<label class="form-label">
										{{ $t('price') }} <span class="required-indicator">*</span>
									</label>
									<div class="input-with-prefix">
										<span class="input-prefix">$</span>
										<input
											v-model="formData.price"
											type="number"
											min="0"
											step="0.01"
											required
											placeholder="0.00"
											class="form-input"
											:aria-label="$t('price')"
										/>
									</div>
								</div>
								
								<!-- Preparation Time -->
								<div class="form-group">
									<label class="form-label">
										{{ $t('preparationTime') }}
									</label>
									<div class="input-with-suffix">
										<input
											v-model="formData.preparationTime"
											type="number"
											min="1"
											placeholder="15"
											class="form-input"
											:aria-label="$t('preparationTime')"
										/>
										<span class="input-suffix">{{ $t('minutes') }}</span>
									</div>
								</div>
							</div>
							
							<!-- Tags -->
							<div class="form-group">
								<label class="form-label">
									{{ $t('tags') }}
								</label>
								<div class="tags-container">
									<div class="tags-list">
										<span
											v-for="(tag, index) in formData.tags"
											:key="index"
											class="tag-item"
										>
											{{ tag }}
											<button
												type="button"
												@click="removeTag(index)"
												class="tag-remove-button"
												:aria-label="$t('removeTag', { tag })"
											>
												<i class="ri-close-line"></i>
											</button>
										</span>
									</div>
									<div class="tag-input-container">
										<input
											v-model="newTag"
											type="text"
											:placeholder="$t('addTagPlaceholder')"
											@keydown.enter.prevent="addTag"
											class="tag-input"
											:aria-label="$t('addTag')"
										/>
										<button
											type="button"
											@click="addTag"
											class="tag-add-button"
											:aria-label="$t('addTag')"
										>
											{{ $t('add') }}
										</button>
									</div>
								</div>
							</div>
							
							<!-- Image Upload -->
							<div class="form-group">
								<label class="form-label">
									{{ $t('image') }}
								</label>
								<div
									@click="triggerFileInput"
									class="image-upload-area"
									:class="{ 'dragging': isDragging }"
									@dragover.prevent="isDragging = true"
									@dragleave.prevent="isDragging = false"
									@drop.prevent="handleDrop"
									:aria-label="$t('uploadImage')"
								>
									<div v-if="!formData.image" class="upload-placeholder">
										<div class="upload-icon">
											<i class="ri-image-line"></i>
										</div>
										<div class="upload-text">
											<p class="upload-title">{{ $t('dragDropImage') }}</p>
											<p class="upload-subtitle">{{ $t('orClickToUpload') }}</p>
										</div>
										<p class="upload-hint">
											{{ $t('supportedFormats') }}: PNG, JPG {{ $t('upTo') }} 5MB
										</p>
									</div>
									<div v-else class="image-preview">
										<img :src="formData.image" :alt="$t('imagePreview')" class="preview-image">
										<button
											type="button"
											@click.stop="removeImage"
											class="remove-image-button"
											:aria-label="$t('removeImage')"
										>
											{{ $t('removeImage') }}
										</button>
									</div>
									<input
										ref="fileInput"
										type="file"
										accept="image/*"
										class="file-input"
										@change="handleFileUpload"
									/>
								</div>
							</div>
							
							<!-- Availability & Special -->
							<div class="form-grid">
								<!-- Availability -->
								<div class="toggle-group">
									<label class="toggle-label">
										<input
											v-model="formData.available"
											type="checkbox"
											class="toggle-input"
											:aria-label="$t('availability')"
										/>
										<span class="toggle-slider"></span>
										<span class="toggle-text">{{ $t('available') }}</span>
									</label>
									<p class="toggle-description">
										{{ $t('availabilityDescription') }}
									</p>
								</div>
								
								<!-- Special Item -->
								<div class="toggle-group">
									<label class="toggle-label">
										<input
											v-model="formData.isSpecial"
											type="checkbox"
											class="toggle-input"
											:aria-label="$t('specialItem')"
										/>
										<span class="toggle-slider"></span>
										<span class="toggle-text">{{ $t('specialItem') }}</span>
									</label>
									<p class="toggle-description">
										{{ $t('specialItemDescription') }}
									</p>
								</div>
							</div>
							
							<!-- Calories & Allergens -->
							<div class="form-grid">
								<!-- Calories -->
								<div class="form-group">
									<label class="form-label">
										{{ $t('calories') }}
									</label>
									<div class="input-with-suffix">
										<input
											v-model="formData.calories"
											type="number"
											min="0"
											placeholder="250"
											class="form-input"
											:aria-label="$t('calories')"
										/>
										<span class="input-suffix">{{ $t('caloriesShort') }}</span>
									</div>
								</div>
								
								<!-- Allergens -->
								<div class="form-group">
									<label class="form-label">
										{{ $t('allergens') }}
									</label>
									<select
										v-model="formData.allergens"
										multiple
										class="allergens-select"
										:aria-label="$t('allergens')"
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
					<div class="modal-footer">
						<div class="footer-actions">
							<button
								type="button"
								@click="close"
								class="cancel-button"
								:aria-label="$t('cancel')"
							>
								{{ $t('cancel') }}
							</button>
							<button
								type="button"
								@click="save"
								:disabled="saving || !isFormValid"
								class="save-button"
								:aria-label="mode === 'add' ? $t('addMenuItem') : $t('saveChanges')"
								:class="{ 'saving': saving }"
							>
								<span v-if="saving" class="button-loading">
									<i class="ri-loader-4-line"></i>
									{{ $t('saving') }}
								</span>
								<span v-else class="button-content">
									<i :class="mode === 'add' ? 'ri-add-line' : 'ri-save-line'"></i>
									{{ mode === 'add' ? $t('addMenuItem') : $t('saveChanges') }}
								</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
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

// Computed properties
const isFormValid = computed(() => {
  return formData.value.name.trim() !== '' && 
         formData.value.category.trim() !== '' && 
         formData.value.price > 0;
});

// Functions
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
  if (!isFormValid.value) {
    // Show validation error
    return;
  }

  saving.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
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
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('fileTooLarge'));
      return;
    }
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
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        alert(t('fileTooLarge'));
        return;
      }
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
    resetForm();
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
/* Base modal styles */
.menu-item-modal {
	position: fixed;
	inset: 0;
	z-index: 50;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
}

/* Backdrop */
.modal-backdrop {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	transition: opacity 0.3s ease;
}

/* Modal Container */
.modal-container {
	position: relative;
	width: 100%;
	max-width: 42rem;
	max-height: calc(100vh - 2rem);
	overflow-y: auto;
}

/* Modal Content */
.modal-content {
	position: relative;
	background: var(--color-card);
	border-radius: 1.5rem;
	box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
	overflow: hidden;
	transition: transform 0.3s ease;
}

@media (prefers-color-scheme: dark) {
	.modal-content {
		background: #1f2937;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
	}
}

/* Header */
.modal-header {
	padding: 1.5rem 1.5rem 0 1.5rem;
	border-bottom: 1px solid #e5e7eb;
}

@media (prefers-color-scheme: dark) {
	.modal-header {
		border-bottom-color: #374151;
	}
}

.header-content {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-bottom: 1.5rem;
}

.header-icon-container {
	width: 3rem;
	height: 3rem;
	border-radius: 0.75rem;
	background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.header-icon {
	font-size: 1.5rem;
	color: white;
}

.modal-title {
	font-size: 1.875rem;
	font-weight: 800;
	color: #111827;
	margin: 0 0 0.25rem 0;
	line-height: 1.2;
}

@media (prefers-color-scheme: dark) {
	.modal-title {
		color: #f9fafb;
	}
}

.modal-subtitle {
	font-size: 0.875rem;
	color: #6b7280;
	margin: 0;
	user-select: none;
}

@media (prefers-color-scheme: dark) {
	.modal-subtitle {
		color: #d1d5db;
	}
}

.close-button {
	position: absolute;
	top: 1.5rem;
	right: 1.5rem;
	width: 2rem;
	height: 2rem;
	border-radius: 0.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6b7280;
	background: transparent;
	border: none;
	cursor: pointer;
	transition: all 0.2s ease;
}

.close-button:hover {
	color: #374151;
	background: #FFEDD5;
}

.close-button i {
	font-size: 1.25rem;
}

@media (prefers-color-scheme: dark) {
	.close-button {
		color: #9ca3af;
	}
	
	.close-button:hover {
		color: #f3f4f6;
		background: #374151;
	}
}

/* Modal Body */
.modal-body {
	padding: 1.5rem;
	max-height: calc(90vh - 200px);
	overflow-y: auto;
}

.modal-form {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

/* Form Grid */
.form-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 1.5rem;
}

@media (min-width: 768px) {
	.form-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

/* Form Group */
.form-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.form-label {
	font-size: 0.875rem;
	font-weight: 500;
	color: #374151;
}

@media (prefers-color-scheme: dark) {
	.form-label {
		color: #e5e7eb;
	}
}

.required-indicator {
	color: #ef4444;
	margin-left: 0.125rem;
}

/* Form Inputs */
.form-input,
.form-textarea,
.form-select,
.allergens-select {
	width: 100%;
	padding: 0.625rem 1rem;
	background: var(--color-card);
	border: 1px solid #d1d5db;
	border-radius: 0.75rem;
	color: #111827;
	font-size: 0.875rem;
	transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus,
.allergens-select:focus {
	outline: none;
	border-color: #8b5cf6;
	box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
	color: #9ca3af;
}

@media (prefers-color-scheme: dark) {
	.form-input,
	.form-textarea,
	.form-select,
	.allergens-select {
		background: #374151;
		border-color: #4b5563;
		color: #f3f4f6;
	}
	
	.form-input:focus,
	.form-textarea:focus,
	.form-select:focus,
	.allergens-select:focus {
		border-color: #a855f7;
		box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
	}
	
	.form-input::placeholder,
	.form-textarea::placeholder {
		color: #9ca3af;
	}
}

/* Textarea */
.form-textarea {
	resize: vertical;
	min-height: 5rem;
}

/* Select Container */
.select-container {
	position: relative;
}

.select-icon {
	position: absolute;
	right: 1rem;
	top: 50%;
	transform: translateY(-50%);
	color: #6b7280;
	pointer-events: none;
}

/* Input with prefix/suffix */
.input-with-prefix,
.input-with-suffix {
	position: relative;
}

.input-prefix {
	position: absolute;
	left: 1rem;
	top: 50%;
	transform: translateY(-50%);
	color: #6b7280;
	font-weight: 500;
}

.input-with-prefix .form-input {
	padding-left: 2.5rem;
}

.input-suffix {
	position: absolute;
	right: 1rem;
	top: 50%;
	transform: translateY(-50%);
	color: #6b7280;
	font-weight: 500;
}

.input-with-suffix .form-input {
	padding-right: 3.5rem;
}

/* Tags */
.tags-container {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.tags-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.tag-item {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.375rem 0.75rem;
	background: rgba(139, 92, 246, 0.1);
	color: #7c3aed;
	border-radius: 0.5rem;
	font-size: 0.75rem;
	font-weight: 500;
}

.tag-remove-button {
	background: none;
	border: none;
	color: #7c3aed;
	cursor: pointer;
	padding: 0.125rem;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: color 0.2s ease;
}

.tag-remove-button:hover {
	color: #5b21b6;
}

.tag-remove-button i {
	font-size: 0.75rem;
}

.tag-input-container {
	display: flex;
	gap: 0.5rem;
}

.tag-input {
	flex: 1;
}

.tag-add-button {
	padding: 0.625rem 1rem;
	background: #8b5cf6;
	color: white;
	border: none;
	border-radius: 0.75rem;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
}

.tag-add-button:hover {
	background: #7c3aed;
	transform: translateY(-1px);
}

@media (prefers-color-scheme: dark) {
	.tag-item {
		background: rgba(168, 85, 247, 0.2);
		color: #c084fc;
	}
	
	.tag-remove-button {
		color: #c084fc;
	}
	
	.tag-remove-button:hover {
		color: #d8b4fe;
	}
	
	.tag-add-button {
		background: #a855f7;
	}
	
	.tag-add-button:hover {
		background: #9333ea;
	}
}

/* Image Upload */
.image-upload-area {
	border: 2px dashed #d1d5db;
	border-radius: 0.75rem;
	padding: 2rem;
	text-align: center;
	cursor: pointer;
	transition: all 0.2s ease;
}

.image-upload-area:hover {
	border-color: #8b5cf6;
}

.image-upload-area.dragging {
	border-color: #8b5cf6;
	background: rgba(139, 92, 246, 0.05);
}

.upload-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
}

.upload-icon {
	width: 3rem;
	height: 3rem;
	border-radius: 50%;
	background: #FFEDD5;
	display: flex;
	align-items: center;
	justify-content: center;
}

.upload-icon i {
	font-size: 1.5rem;
	color: #9ca3af;
}

.upload-text {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.upload-title {
	font-weight: 500;
	color: #374151;
	margin: 0;
}

.upload-subtitle {
	color: #6b7280;
	font-size: 0.875rem;
	margin: 0;
}

.upload-hint {
	color: #9ca3af;
	font-size: 0.75rem;
	margin: 0;
}

.image-preview {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
}

.preview-image {
	width: 8rem;
	height: 8rem;
	object-fit: cover;
	border-radius: 0.75rem;
}

.remove-image-button {
	padding: 0.5rem 1rem;
	background: #fef2f2;
	color: #dc2626;
	border: 1px solid #fca5a5;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
}

.remove-image-button:hover {
	background: #fee2e2;
	border-color: #f87171;
}

.file-input {
	display: none;
}

@media (prefers-color-scheme: dark) {
	.image-upload-area {
		border-color: #4b5563;
	}
	
	.image-upload-area.dragging {
		border-color: #a855f7;
		background: rgba(168, 85, 247, 0.1);
	}
	
	.upload-icon {
		background: #374151;
	}
	
	.upload-title {
		color: #e5e7eb;
	}
	
	.upload-subtitle {
		color: #d1d5db;
	}
	
	.remove-image-button {
		background: rgba(220, 38, 38, 0.1);
		color: #f87171;
		border-color: #dc2626;
	}
	
	.remove-image-button:hover {
		background: rgba(220, 38, 38, 0.2);
		border-color: #ef4444;
	}
}

/* Toggle Groups */
.toggle-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.toggle-label {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	cursor: pointer;
}

.toggle-input {
	position: absolute;
	opacity: 0;
	width: 0;
	height: 0;
}

.toggle-slider {
	position: relative;
	display: inline-block;
	width: 2.75rem;
	height: 1.5rem;
	background: #d1d5db;
	border-radius: 9999px;
	transition: background 0.2s ease;
}

.toggle-slider::before {
	content: '';
	position: absolute;
	top: 0.125rem;
	left: 0.125rem;
	width: 1.25rem;
	height: 1.25rem;
	background: var(--color-card);
	border-radius: 50%;
	transition: transform 0.2s ease;
}

.toggle-input:checked + .toggle-slider {
	background: #8b5cf6;
}

.toggle-input:checked + .toggle-slider::before {
	transform: translateX(1.25rem);
}

.toggle-text {
	font-size: 0.875rem;
	font-weight: 500;
	color: #374151;
}

.toggle-description {
	font-size: 0.75rem;
	color: #6b7280;
	margin: 0;
	padding-left: 3.5rem;
}

@media (prefers-color-scheme: dark) {
	.toggle-slider {
		background: #4b5563;
	}
	
	.toggle-text {
		color: #e5e7eb;
	}
	
	.toggle-description {
		color: #9ca3af;
	}
}

/* Allergens Select */
.allergens-select {
	height: 8rem;
}

/* Footer */
.modal-footer {
	padding: 1.5rem;
	background: var(--color-app-bg);
	border-top: 1px solid #e5e7eb;
}

@media (prefers-color-scheme: dark) {
	.modal-footer {
		background: #111827;
		border-top-color: #374151;
	}
}

.footer-actions {
	display: flex;
	justify-content: flex-end;
	gap: 0.75rem;
}

.cancel-button {
	padding: 0.625rem 1.5rem;
	background: var(--color-card);
	border: 1px solid #d1d5db;
	color: #374151;
	border-radius: 0.75rem;
	font-weight: 500;
	font-size: 0.875rem;
	cursor: pointer;
	transition: all 0.2s ease;
}

.cancel-button:hover {
	background: #FFEDD5;
	border-color: #9ca3af;
}

.save-button {
	padding: 0.625rem 1.5rem;
	background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
	color: white;
	border: none;
	border-radius: 0.75rem;
	font-weight: 500;
	font-size: 0.875rem;
	cursor: pointer;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 8rem;
}

.save-button:hover:not(:disabled) {
	transform: translateY(-1px);
	box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.save-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.save-button.saving {
	cursor: wait;
}

.button-loading {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.button-loading i {
	animation: spin 1s linear infinite;
}

.button-content {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

@media (prefers-color-scheme: dark) {
	.cancel-button {
		background: #374151;
		border-color: #4b5563;
		color: #d1d5db;
	}
	
	.cancel-button:hover {
		background: #4b5563;
		border-color: #6b7280;
	}
	
	.save-button {
		background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%);
	}
	
	.save-button:hover:not(:disabled) {
		box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
	}
}

/* Modal transitions */
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

/* Custom scrollbar */
.modal-body::-webkit-scrollbar {
	width: 6px;
}

.modal-body::-webkit-scrollbar-track {
	background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
	background: #d1d5db;
	border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
	background: #9ca3af;
}

@media (prefers-color-scheme: dark) {
	.modal-body::-webkit-scrollbar-thumb {
		background: #4b5563;
	}
	
	.modal-body::-webkit-scrollbar-thumb:hover {
		background: #6b7280;
	}
}

.allergens-select::-webkit-scrollbar {
	width: 6px;
}

.allergens-select::-webkit-scrollbar-track {
    background: transparent;
}

.allergens-select::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
}

.allergens-select::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

@media (prefers-color-scheme: dark) {
    .allergens-select::-webkit-scrollbar-thumb {
        background: #4b5563;
    }
    
    .allergens-select::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
    }
}

/* Enhanced Responsive Styles */
@media (max-width: 640px) {
    .menu-item-modal {
        padding: 0.5rem;
    }
    
    .modal-container {
        max-height: calc(100vh - 1rem);
    }
    
    .modal-header {
        padding: 1rem 1rem 0 1rem;
    }
    
    .modal-body {
        padding: 1rem;
        max-height: calc(90vh - 150px);
    }
    
    .modal-footer {
        padding: 1rem;
    }
    
    .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .modal-title {
        font-size: 1.5rem;
    }
    
    .close-button {
        top: 1rem;
        right: 1rem;
    }
    
    .footer-actions {
        flex-direction: column-reverse;
        width: 100%;
    }
    
    .cancel-button,
    .save-button {
        width: 100%;
        justify-content: center;
    }
    
    .image-upload-area {
        padding: 1.5rem;
    }
    
    .upload-text {
        text-align: center;
    }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
    .form-input,
    .form-select,
    .form-textarea,
    .allergens-select {
        font-size: 16px; /* Prevents iOS zoom */
        min-height: 44px; /* Better touch target */
    }
    
    button,
    .tag-item,
    .tag-add-button,
    .close-button {
        min-height: 44px;
        min-width: 44px;
    }
    
    .toggle-slider {
        width: 3rem;
        height: 1.75rem;
    }
    
    .toggle-slider::before {
        width: 1.5rem;
        height: 1.5rem;
    }
}

/* RTL (Right-to-Left) support */
[dir="rtl"] .header-content {
    text-align: right;
}

[dir="rtl"] .input-prefix {
    left: auto;
    right: 1rem;
}

[dir="rtl"] .input-suffix {
    right: auto;
    left: 1rem;
}

[dir="rtl"] .select-icon {
    right: auto;
    left: 1rem;
}

[dir="rtl"] .close-button {
    right: auto;
    left: 1.5rem;
}

[dir="rtl"] .button-content i,
[dir="rtl"] .button-loading i {
    order: 1;
    margin-left: 0;
    margin-right: 0.5rem;
}

/* Loading states */
.save-button:disabled {
    position: relative;
}

.save-button:disabled::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 0.75rem;
    cursor: not-allowed;
}

/* Form validation styles */
.form-input:invalid,
.form-select:invalid {
    border-color: #ef4444;
}

.form-input:invalid:focus,
.form-select:invalid:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

@media (prefers-color-scheme: dark) {
    .form-input:invalid,
    .form-select:invalid {
        border-color: #f87171;
    }
    
    .form-input:invalid:focus,
    .form-select:invalid:focus {
        box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.2);
    }
}

/* Print styles */
@media print {
    .menu-item-modal {
        position: static;
        padding: 0;
    }
    
    .modal-backdrop,
    .close-button,
    .cancel-button,
    .tag-add-button,
    .remove-image-button,
    .tag-remove-button {
        display: none;
    }
    
    .modal-container {
        max-width: none;
        max-height: none;
    }
    
    .modal-content {
        box-shadow: none;
        border: 1px solid #000;
    }
}


</style>