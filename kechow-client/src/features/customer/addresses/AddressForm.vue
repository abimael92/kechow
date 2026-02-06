<template>
	<form @submit.prevent="submit" class="space-y-4">
		<!-- Etiqueta -->
		<div>
			<label for="address-label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
				Etiqueta
			</label>
			<input
				id="address-label"
				v-model="form.label"
				type="text"
				placeholder="Ej. Casa, Trabajo"
				maxlength="100"
				class="w-full px-4 py-2.5 border border-secondary-300 dark:border-gray-600 rounded-input bg-card text-secondary-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 min-h-[44px]"
				:aria-invalid="!!errors.label"
				aria-describedby="address-label-error"
			/>
			<p v-if="errors.label" id="address-label-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
				{{ errors.label }}
			</p>
		</div>

		<!-- Buscar dirección (Google Places) -->
		<div v-if="placesAvailable">
			<label for="address-search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
				Buscar dirección
			</label>
			<input
				ref="placesInputRef"
				id="address-search"
				type="text"
				placeholder="Escribe una dirección para autocompletar..."
				autocomplete="off"
				class="w-full px-4 py-2.5 border border-secondary-300 dark:border-gray-600 rounded-input bg-card text-secondary-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 min-h-[44px]"
			/>
			<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
				Selecciona una sugerencia para rellenar calle, ciudad, estado y código postal.
			</p>
		</div>

		<!-- Calle y número -->
		<div>
			<label for="address-street" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
				Calle y número <span class="text-red-500">*</span>
			</label>
			<input
				id="address-street"
				v-model="form.street"
				type="text"
				placeholder="Av. Principal 123"
				maxlength="500"
				class="w-full px-4 py-2.5 border border-secondary-300 dark:border-gray-600 rounded-input bg-card text-secondary-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 min-h-[44px]"
				:aria-invalid="!!errors.street"
				aria-describedby="address-street-error"
			/>
			<p v-if="errors.street" id="address-street-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
				{{ errors.street }}
			</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<!-- Ciudad -->
			<div>
				<label for="address-city" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
					Ciudad
				</label>
				<input
					id="address-city"
					v-model="form.city"
					type="text"
					placeholder="Ciudad"
					maxlength="120"
					class="w-full px-4 py-2.5 border border-secondary-300 dark:border-gray-600 rounded-input bg-card text-secondary-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 min-h-[44px]"
				/>
			</div>
			<!-- Estado -->
			<div>
				<label for="address-state" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
					Estado
				</label>
				<input
					id="address-state"
					v-model="form.state"
					type="text"
					placeholder="Estado"
					maxlength="120"
					class="w-full px-4 py-2.5 border border-secondary-300 dark:border-gray-600 rounded-input bg-card text-secondary-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 min-h-[44px]"
				/>
			</div>
		</div>

		<!-- Código postal -->
		<div>
			<label for="address-zip" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
				Código postal
			</label>
			<input
				id="address-zip"
				v-model="form.zipCode"
				type="text"
				placeholder="00000"
				maxlength="20"
				class="w-full px-4 py-2.5 border border-secondary-300 dark:border-gray-600 rounded-input bg-card text-secondary-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 min-h-[44px] max-w-[12rem]"
			/>
		</div>

		<!-- Predeterminada -->
		<label class="flex items-center gap-3 cursor-pointer min-h-[44px]">
			<input
				v-model="form.isDefault"
				type="checkbox"
				class="w-5 h-5 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
			/>
			<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
				Predeterminada (usar como dirección de entrega por defecto)
			</span>
		</label>

		<!-- Botones -->
		<div class="flex flex-col-reverse sm:flex-row gap-3 pt-2">
			<button
				type="button"
				@click="$emit('cancel')"
				class="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-button font-medium border border-secondary-300 dark:border-gray-600 text-secondary-800 dark:text-gray-200 bg-card hover:bg-panel transition-colors"
			>
				Cancelar
			</button>
			<button
				type="submit"
				:disabled="saving"
				class="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-button font-semibold bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				{{ saving ? 'Guardando...' : 'Guardar' }}
			</button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import type { Address } from '@/features/customer/services/customer.service';
import { useGooglePlaces, type ParsedPlace } from './useGooglePlaces';

const props = defineProps<{
	modelValue?: Partial<Omit<Address, 'id'>> | null;
	saving?: boolean;
}>();

const emit = defineEmits<{
	submit: [payload: Omit<Address, 'id'>];
	cancel: [];
}>();

const { isAvailable: placesAvailable, attachAutocomplete } = useGooglePlaces();
const placesInputRef = ref<HTMLInputElement | null>(null);

const form = reactive({
	label: '',
	street: '',
	city: '',
	state: '',
	zipCode: '',
	isDefault: false,
});

const errors = reactive<Record<string, string>>({
	label: '',
	street: '',
});

const saving = ref(false);
watch(() => props.saving, (v) => { saving.value = !!v; }, { immediate: true });

watch(
	() => props.modelValue,
	(val) => {
		if (val) {
			form.label = val.label ?? '';
			form.street = val.street ?? '';
			form.city = val.city ?? '';
			form.state = val.state ?? '';
			form.zipCode = val.zipCode ?? '';
			form.isDefault = val.isDefault ?? false;
		} else {
			form.label = '';
			form.street = '';
			form.city = '';
			form.state = '';
			form.zipCode = '';
			form.isDefault = false;
		}
		errors.label = '';
		errors.street = '';
	},
	{ immediate: true }
);

onMounted(async () => {
	if (placesAvailable && placesInputRef.value) {
		await attachAutocomplete(placesInputRef.value, (parsed: ParsedPlace) => {
			form.street = parsed.street || form.street;
			form.city = parsed.city || form.city;
			form.state = parsed.state || form.state;
			form.zipCode = parsed.zipCode || form.zipCode;
		});
	}
});

function validate(): boolean {
	errors.label = '';
	errors.street = '';
	const label = form.label.trim();
	const street = form.street.trim();
	if (!label) errors.label = 'La etiqueta es obligatoria.';
	if (!street) errors.street = 'La calle y número son obligatorios.';
	return !errors.label && !errors.street;
}

function submit() {
	if (!validate()) return;
	emit('submit', {
		label: form.label.trim(),
		street: form.street.trim(),
		city: form.city.trim(),
		state: form.state.trim(),
		zipCode: form.zipCode.trim(),
		isDefault: form.isDefault,
	});
}
</script>
