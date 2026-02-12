<!-- src/components/MobileFilters.vue -->
<template>
	<div class="space-y-6">
		<!-- Categories Section -->
		<div>
			<h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
				<i class="ri-price-tag-3-line text-emerald-600"></i>
				Categorías
			</h4>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="category in categories"
					:key="category.id"
					@click="selectCategory(category.name)"
					:class="[
						'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2',
						selectedCategory === category.name
							? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
							: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
					]"
				>
					<i :class="category.icon" class="text-lg"></i>
					{{ category.name }}
					<span v-if="category.count" class="ml-1 text-xs opacity-80">({{ category.count }})</span>
				</button>
			</div>
		</div>

		<!-- Price Range -->
		<div>
			<h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
				<i class="ri-money-dollar-circle-line text-emerald-600"></i>
				Rango de precios
			</h4>
			<div class="grid grid-cols-4 gap-2">
				<button
					v-for="price in priceOptions"
					:key="price.value"
					@click="updatePriceRange(price.value)"
					:class="[
						'px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200',
						priceRange === price.value
							? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
							: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
					]"
				>
					<div class="flex flex-col items-center">
						<span class="text-lg">{{ price.symbol }}</span>
						<span class="text-xs mt-1">{{ price.label }}</span>
					</div>
				</button>
			</div>
		</div>

		<!-- Delivery Time -->
		<div>
			<h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
				<i class="ri-timer-line text-emerald-600"></i>
				Tiempo de entrega
			</h4>
			<div class="space-y-2">
				<label
					v-for="time in deliveryOptions"
					:key="time.value"
					class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl cursor-pointer transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700"
					:class="{ 'ring-2 ring-emerald-600 bg-emerald-50 dark:bg-emerald-900/20': deliveryTime === time.value }"
				>
					<div class="flex items-center gap-3">
						<div :class="[
							'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
							deliveryTime === time.value
								? 'border-emerald-600 bg-emerald-600'
								: 'border-slate-400'
						]">
							<div v-if="deliveryTime === time.value" class="w-2 h-2 bg-white rounded-full"></div>
						</div>
						<span class="font-medium text-slate-900 dark:text-white">{{ time.label }}</span>
					</div>
					<span class="text-sm text-slate-500 dark:text-slate-400">{{ time.range }}</span>
					<input 
						type="radio" 
						:value="time.value" 
						v-model="deliveryTimeModel" 
						class="hidden"
					>
				</label>
			</div>
		</div>

		<!-- Dietary Preferences -->
		<div>
			<h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
				<i class="ri-heart-pulse-line text-emerald-600"></i>
				Preferencias
			</h4>
			<div class="grid grid-cols-2 gap-3">
				<button
					v-for="pref in dietaryPreferences"
					:key="pref.value"
					@click="toggleDietary(pref.value)"
					:class="[
						'px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2',
						dietarySelected.includes(pref.value)
							? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
							: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
					]"
				>
					<i :class="pref.icon"></i>
					{{ pref.label }}
				</button>
			</div>
		</div>

		<!-- Rating Filter -->
		<div>
			<h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
				<i class="ri-star-line text-emerald-600"></i>
				Calificación mínima
			</h4>
			<div class="flex items-center gap-2">
				<button
					v-for="rating in [1, 2, 3, 4, 5]"
					:key="rating"
					@click="minRating = rating === minRating ? 0 : rating"
					:class="[
						'w-12 h-12 rounded-xl text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center',
						minRating >= rating
							? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
							: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
					]"
				>
					<i class="ri-star-fill text-lg"></i>
					<span class="text-xs">{{ rating }}+</span>
				</button>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
			<button
				@click="resetAllFilters"
				class="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 font-medium flex items-center justify-center gap-2"
			>
				<i class="ri-refresh-line"></i>
				Limpiar
			</button>
			<button
				@click="applyFilters"
				class="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg"
			>
				<i class="ri-check-line"></i>
				Aplicar
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

interface Category {
	id: string;
	name: string;
	icon: string;
	count?: number;
}

interface PriceOption {
	value: string;
	label: string;
	symbol: string;
}

interface DeliveryOption {
	value: string;
	label: string;
	range: string;
}

interface DietaryPreference {
	value: string;
	label: string;
	icon: string;
}

const props = defineProps<{
	priceRange: string;
	deliveryTime: string;
	selectedCategory: string;
	categories: Category[];
	priceOptions: PriceOption[];
}>();

const emit = defineEmits<{
	(e: 'update:priceRange', value: string): void;
	(e: 'update:deliveryTime', value: string): void;
	(e: 'update:selectedCategory', value: string): void;
	(e: 'close'): void;
}>();

// Local state
const localPriceRange = ref(props.priceRange);
const localDeliveryTime = ref(props.deliveryTime);
const localSelectedCategory = ref(props.selectedCategory);
const minRating = ref(0);
const dietarySelected = ref<string[]>([]);

// Computed for v-model
const priceRangeModel = computed({
	get: () => localPriceRange.value,
	set: (value: string) => {
		localPriceRange.value = value;
		emit('update:priceRange', value);
	}
});

const deliveryTimeModel = computed({
	get: () => localDeliveryTime.value,
	set: (value: string) => {
		localDeliveryTime.value = value;
		emit('update:deliveryTime', value);
	}
});

// Constants
const deliveryOptions: DeliveryOption[] = [
	{ value: 'all', label: 'Todos', range: 'Cualquier tiempo' },
	{ value: 'fast', label: 'Rápido', range: '< 30 min' },
	{ value: 'medium', label: 'Normal', range: '30-45 min' },
	{ value: 'slow', label: 'Express', range: '< 60 min' }
];

const dietaryPreferences: DietaryPreference[] = [
	{ value: 'vegetarian', label: 'Vegetariano', icon: 'ri-plant-line' },
	{ value: 'vegan', label: 'Vegano', icon: 'ri-leaf-line' },
	{ value: 'gluten-free', label: 'Sin Gluten', icon: 'ri-wheat-line' },
	{ value: 'spicy', label: 'Picante', icon: 'ri-fire-line' }
];

// Methods
function selectCategory(category: string) {
	localSelectedCategory.value = localSelectedCategory.value === category ? '' : category;
	emit('update:selectedCategory', localSelectedCategory.value);
}

function updatePriceRange(value: string) {
	localPriceRange.value = value;
	emit('update:priceRange', value);
}

function toggleDietary(value: string) {
	if (dietarySelected.value.includes(value)) {
		dietarySelected.value = dietarySelected.value.filter(v => v !== value);
	} else {
		dietarySelected.value = [...dietarySelected.value, value];
	}
}

function resetAllFilters() {
	localPriceRange.value = 'all';
	localDeliveryTime.value = 'all';
	localSelectedCategory.value = '';
	minRating.value = 0;
	dietarySelected.value = [];
	
	emit('update:priceRange', 'all');
	emit('update:deliveryTime', 'all');
	emit('update:selectedCategory', '');
}

function applyFilters() {
	emit('close');
}

// Watch props changes
watch(() => props.priceRange, (newVal) => {
	localPriceRange.value = newVal;
});

watch(() => props.deliveryTime, (newVal) => {
	localDeliveryTime.value = newVal;
});

watch(() => props.selectedCategory, (newVal) => {
	localSelectedCategory.value = newVal;
});
</script>

<style scoped>
/* Smooth transitions */
* {
	transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-duration: 150ms;
}

/* Custom scrollbar for mobile */
.space-y-6 {
	max-height: calc(100vh - 200px);
	overflow-y: auto;
	padding-right: 4px;
}

.space-y-6::-webkit-scrollbar {
	width: 4px;
}

.space-y-6::-webkit-scrollbar-track {
	background: transparent;
}

.space-y-6::-webkit-scrollbar-thumb {
	background: rgba(156, 163, 175, 0.3);
	border-radius: 20px;
}

.dark .space-y-6::-webkit-scrollbar-thumb {
	background: rgba(75, 85, 99, 0.3);
}

/* Touch-friendly tap targets */
button, label {
	min-height: 44px;
}

/* Active state feedback */
button:active {
	transform: scale(0.97);
}

/* Responsive adjustments */
@media (max-width: 380px) {
	.grid-cols-4 {
		grid-template-columns: repeat(2, 1fr);
	}
	
	.grid-cols-2 {
		grid-template-columns: 1fr;
	}
}
</style>