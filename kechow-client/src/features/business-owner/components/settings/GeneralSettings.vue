<template>
	<div class="space-y-6">
		<!-- Información del restaurante -->
		<div
			class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
		>
			<div class="flex justify-between items-center">
				<h3 class="text-lg font-bold text-gray-900">
					Información del restaurante
				</h3>
				<button
					v-if="editingInfoChanged"
					@click="saveRestaurantInfo"
					class="font-medium"
				>
					Guardar
				</button>
				<button v-else @click="toggleEditingInfo" class="font-medium">
					{{ editingInfo ? 'Cancelar' : 'Editar' }}
				</button>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
				<!-- Nombre -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Nombre</label
					>
					<p
						class="px-4 py-3 bg-gray-100 rounded-lg text-gray-800 cursor-not-allowed"
					>
						{{ restaurantInfo.name }}
					</p>
				</div>

				<!-- Teléfono -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Teléfono</label
					>
					<component
						:is="editingInfo ? 'input' : 'p'"
						v-model="restaurantInfo.phone"
						type="tel"
						placeholder="Ej. +52 123 456 7890"
						class="w-full px-4 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
					>
						<template #default>{{ restaurantInfo.phone }}</template>
					</component>
				</div>

				<!-- Correo -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Correo</label
					>
					<component
						:is="editingInfo ? 'input' : 'p'"
						v-model="restaurantInfo.email"
						type="email"
						placeholder="Ej. contacto@restaurante.com"
						class="w-full px-4 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
					>
						<template #default>{{ restaurantInfo.email }}</template>
					</component>
				</div>

				<!-- Sitio web -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Sitio web</label
					>
					<component
						:is="editingInfo ? 'input' : 'p'"
						v-model="restaurantInfo.website"
						type="url"
						placeholder="Ej. https://mi-restaurante.com"
						class="w-full px-4 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
					>
						<template #default>{{ restaurantInfo.website }}</template>
					</component>
				</div>

				<!-- Dirección -->
				<div class="md:col-span-2">
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Dirección</label
					>
					<component
						:is="editingInfo ? 'input' : 'p'"
						v-model="restaurantInfo.address"
						placeholder="Calle, Ciudad, Estado, CP"
						class="w-full px-4 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
					>
						<template #default>{{ restaurantInfo.address }}</template>
					</component>
				</div>

				<!-- Descripción -->
				<div class="md:col-span-2">
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Descripción</label
					>
					<component
						:is="editingInfo ? 'textarea' : 'p'"
						v-model="restaurantInfo.description"
						rows="4"
						placeholder="Describe tu restaurante, especialidades o platos populares"
						class="w-full px-4 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
					>
						<template #default>{{ restaurantInfo.description }}</template>
					</component>
				</div>
			</div>
		</div>

		<!-- Horarios de operación -->
		<div
			class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4"
		>
			<div class="flex justify-between items-center">
				<h3 class="text-lg font-bold text-gray-900">Horarios de operación</h3>
				<button @click="toggleEditingHours" class="font-medium">
					{{ editingHours ? 'Guardar' : 'Editar' }}
				</button>
			</div>
			<div class="space-y-4">
				<OperatingHoursDay />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import OperatingHoursDay from './OperatingHoursDay.vue';
import type { OperatingHours } from '../../types';

const editingInfo = ref(false);
const editingHours = ref(false);

const restaurantInfo = reactive({
	name: "Mario's Kitchen",
	phone: '+52 123 456 7890',
	email: 'contacto@marioskitchen.com',
	website: 'https://marioskitchen.com',
	address: 'Av. Principal 123, Ciudad Gourmet, MX 54321',
	description:
		'Cocina italiana auténtica con ingredientes frescos y recetas tradicionales.',
});

const originalInfo = reactive({ ...restaurantInfo });

const editingInfoChanged = computed(() => {
	return (
		editingInfo.value &&
		(restaurantInfo.phone !== originalInfo.phone ||
			restaurantInfo.email !== originalInfo.email ||
			restaurantInfo.website !== originalInfo.website ||
			restaurantInfo.address !== originalInfo.address ||
			restaurantInfo.description !== originalInfo.description)
	);
});

function toggleEditingInfo() {
	if (editingInfo.value) Object.assign(restaurantInfo, originalInfo);
	editingInfo.value = !editingInfo.value;
}

function saveRestaurantInfo() {
	Object.assign(originalInfo, restaurantInfo);
	editingInfo.value = false;
	console.log('Información del restaurante guardada:', restaurantInfo);
}

const operatingHours = reactive<OperatingHours[]>([
	{
		id: 'monday',
		day: 'Lunes',
		openTime: '10:00',
		closeTime: '22:00',
		closed: false,
	},
	{
		id: 'tuesday',
		day: 'Martes',
		openTime: '10:00',
		closeTime: '22:00',
		closed: false,
	},
	{
		id: 'wednesday',
		day: 'Miércoles',
		openTime: '10:00',
		closeTime: '22:00',
		closed: false,
	},
	{
		id: 'thursday',
		day: 'Jueves',
		openTime: '10:00',
		closeTime: '22:00',
		closed: false,
	},
	{
		id: 'friday',
		day: 'Viernes',
		openTime: '10:00',
		closeTime: '22:00',
		closed: false,
	},
	{
		id: 'saturday',
		day: 'Sábado',
		openTime: '10:00',
		closeTime: '22:00',
		closed: false,
	},
	{
		id: 'sunday',
		day: 'Domingo',
		openTime: '10:00',
		closeTime: '22:00',
		closed: false,
	},
]);

function toggleEditingHours() {
	editingHours.value = !editingHours.value;
	if (!editingHours.value) console.log('Horarios guardados:', operatingHours);
}

function updateOperatingHours(updatedDay: OperatingHours) {
	const index = operatingHours.findIndex((day) => day.id === updatedDay.id);
	if (index !== -1) operatingHours[index] = updatedDay;
}
</script>
