<template>
	<!-- Change the container to use dim purple background -->
	<div class="space-y-8 bg-background-dim-purple dark:bg-background-dim-purple-dark min-h-screen p-4 md:p-6">
		<!-- Restaurant Information Card -->
		<div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-800 p-6 lg:p-8">
			<div class="flex items-center justify-between mb-8">
				<div>
					<h3 class="text-2xl font-bold text-neutral-900 dark:text-white">
						{{ t('restaurant.information.title') }}
					</h3>
					<p class="text-neutral-500 dark:text-neutral-400">{{ t('restaurant.information.subtitle') }}</p>
				</div>
				
				<!-- Updated button with white text for good contrast on purple -->
				<button 
					@click="toggleEditingInfo" 
					class="px-4 py-2 rounded-lg font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors shadow-button hover:shadow-button-hover"
				>
					{{ editingInfo ? t('common.cancel') : t('restaurant.information.edit') }}
				</button>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<!-- Your form fields remain the same -->
				<div>
					<label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
						{{ t('restaurant.information.name') }}
					</label>
					<input 
						v-model="restaurantInfo.name"
						:readonly="!editingInfo"
						class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
					>
				</div>

				<div>
					<label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
						{{ t('restaurant.information.phone') }}
					</label>
					<input 
						v-model="restaurantInfo.phone"
						:readonly="!editingInfo"
						type="tel"
						class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
					>
				</div>

				<div>
					<label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
						{{ t('restaurant.information.email') }}
					</label>
					<input 
						v-model="restaurantInfo.email"
						:readonly="!editingInfo"
						type="email"
						class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
					>
				</div>

				<div>
					<label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
						{{ t('restaurant.information.website') }}
					</label>
					<input 
						v-model="restaurantInfo.website"
						:readonly="!editingInfo"
						type="url"
						class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
					>
				</div>

				<div class="lg:col-span-2">
					<label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
						{{ t('restaurant.information.address') }}
					</label>
					<input 
						v-model="restaurantInfo.address"
						:readonly="!editingInfo"
						class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
					>
				</div>

				<div class="lg:col-span-2">
					<label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
						{{ t('restaurant.information.description') }}
					</label>
					<textarea 
						v-model="restaurantInfo.description"
						:readonly="!editingInfo"
						rows="3"
						class="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
					></textarea>
				</div>

				<div v-if="editingInfo" class="lg:col-span-2 flex justify-end space-x-4">
					<!-- Updated save button -->
					<button 
						@click="saveRestaurantInfo"
						class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-button hover:shadow-button-hover transition-all"
					>
						{{ t('common.save') }}
					</button>
				</div>
			</div>
		</div>

		<!-- Weekly Schedule Card -->
		<div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-800 p-6 lg:p-8">
			<div class="flex items-center justify-between mb-8">
				<div>
					<h3 class="text-2xl font-bold text-neutral-900 dark:text-white">
						{{ t('restaurant.schedule.title') }}
					</h3>
					<p class="text-neutral-500 dark:text-neutral-400">{{ t('restaurant.schedule.subtitle') }}</p>
				</div>
				
				<!-- Updated button with white text -->
				<button 
					@click="toggleEditingHours" 
					class="px-4 py-2 rounded-lg font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors shadow-button hover:shadow-button-hover"
				>
					{{ editingHours ? t('common.cancel') : t('restaurant.schedule.edit') }}
				</button>
			</div>

			<!-- Week Schedule Table -->
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-neutral-200 dark:border-neutral-700">
							<th class="text-left py-3 px-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
								{{ t('restaurant.schedule.day') }}
							</th>
							<th class="text-left py-3 px-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
								{{ t('restaurant.schedule.status') }}
							</th>
							<th class="text-left py-3 px-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
								{{ t('restaurant.schedule.openingTime') }}
							</th>
							<th class="text-left py-3 px-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
								{{ t('restaurant.schedule.closingTime') }}
							</th>
							<th v-if="editingHours" class="text-left py-3 px-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
								{{ t('restaurant.schedule.actions') }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="day in operatingHours" :key="day.id" class="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800">
							<td class="py-4 px-4">
								<span class="font-medium text-neutral-900 dark:text-white">
									{{ t(`days.${day.id}`) }}
								</span>
							</td>
							<td class="py-4 px-4">
								<span v-if="editingHours" class="flex items-center gap-2">
									<button 
										@click="toggleDayStatus(day.id)"
										:class="[
											'w-10 h-6 rounded-full transition-colors',
											day.closed ? 'bg-neutral-300 dark:bg-neutral-700' : 'bg-primary-600'
										]"
									>
										<span :class="[
											'block w-4 h-4 rounded-full bg-white transition-transform',
											day.closed ? 'translate-x-1' : 'translate-x-5'
										]"></span>
									</button>
									<span :class="[
										'font-medium',
										day.closed ? 'text-neutral-500' : 'text-primary-600 dark:text-primary-400'
									]">
										{{ day.closed ? t('common.closed') : t('common.open') }}
									</span>
								</span>
								<span v-else :class="[
									'font-medium',
									day.closed ? 'text-neutral-500' : 'text-primary-600 dark:text-primary-400'
								]">
									{{ day.closed ? t('common.closed') : t('common.open') }}
								</span>
							</td>
							<td class="py-4 px-4">
								<input 
									v-if="editingHours && !day.closed"
									v-model="day.openTime"
									type="time"
									class="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
								>
								<span v-else class="text-neutral-700 dark:text-neutral-300">
									{{ day.closed ? '—' : formatTime(day.openTime) }}
								</span>
							</td>
							<td class="py-4 px-4">
								<input 
									v-if="editingHours && !day.closed"
									v-model="day.closeTime"
									type="time"
									class="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
								>
								<span v-else class="text-neutral-700 dark:text-neutral-300">
									{{ day.closed ? '—' : formatTime(day.closeTime) }}
								</span>
							</td>
							<td v-if="editingHours" class="py-4 px-4">
								<button 
									v-if="!day.closed"
									@click="copyToAllDays(day)"
									class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
								>
									{{ t('restaurant.schedule.copyToAll') }}
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Special Days Section -->
			<div class="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
				<h4 class="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
					{{ t('restaurant.schedule.specialDays') }}
				</h4>
				<div class="space-y-4">
					<div v-for="specialDay in specialDays" :key="specialDay.id" class="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
						<div>
							<h5 class="font-medium text-neutral-900 dark:text-white">{{ specialDay.date }} - {{ specialDay.name }}</h5>
							<p class="text-sm text-neutral-500 dark:text-neutral-400">
								{{ specialDay.closed ? t('common.closed') : `${specialDay.openTime} - ${specialDay.closeTime}` }}
							</p>
						</div>
						<div class="flex items-center gap-3">
							<button 
								v-if="editingHours"
								@click="removeSpecialDay(specialDay.id)"
								class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
							>
								{{ t('common.remove') }}
							</button>
							<button 
								v-if="editingHours && !specialDay.closed"
								@click="toggleSpecialDayStatus(specialDay.id)"
								class="text-sm px-3 py-1 bg-neutral-200 dark:bg-neutral-700 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors font-medium"
							>
								{{ t('restaurant.schedule.closeDay') }}
							</button>
						</div>
					</div>

					<button 
						v-if="editingHours"
						@click="addSpecialDay"
						class="w-full py-3 border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-lg text-primary-600 dark:text-primary-400 hover:border-primary-500 hover:text-primary-700 dark:hover:border-primary-400 dark:hover:text-primary-300 transition-colors font-medium"
					>
						{{ t('restaurant.schedule.addSpecialDay') }}
					</button>
				</div>
			</div>

			<!-- Save Button -->
			<div v-if="editingHours" class="mt-8 flex justify-end">
				<button 
					@click="saveOperatingHours"
					class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-button hover:shadow-button-hover transition-all"
				>
					{{ t('restaurant.schedule.save') }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import type { OperatingHours, SpecialDay } from '../../types';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const editingInfo = ref(false);
const editingHours = ref(false);

const restaurantInfo = reactive({
	name: "Mario's Kitchen",
	phone: '+52 123 456 7890',
	email: 'contacto@marioskitchen.com',
	website: 'https://marioskitchen.com',
	address: 'Av. Principal 123, Ciudad Gourmet, MX 54321',
	description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes.',
});

const originalInfo = reactive({ ...restaurantInfo });

const operatingHours = reactive<OperatingHours[]>([
	{ id: 'monday', day: t('days.monday'), openTime: '10:00', closeTime: '22:00', closed: false },
	{ id: 'tuesday', day: t('days.tuesday'), openTime: '10:00', closeTime: '22:00', closed: false },
	{ id: 'wednesday', day: t('days.wednesday'), openTime: '10:00', closeTime: '22:00', closed: false },
	{ id: 'thursday', day: t('days.thursday'), openTime: '10:00', closeTime: '22:00', closed: false },
	{ id: 'friday', day: t('days.friday'), openTime: '10:00', closeTime: '22:00', closed: false },
	{ id: 'saturday', day: t('days.saturday'), openTime: '10:00', closeTime: '22:00', closed: false },
	{ id: 'sunday', day: t('days.sunday'), openTime: '10:00', closeTime: '22:00', closed: false },
]);

const specialDays = reactive<SpecialDay[]>([
	{ id: '1', name: t('restaurant.schedule.holidays.christmas'), date: '2024-12-25', openTime: '', closeTime: '', closed: true, isHoliday: true, recurringYearly: true, affectsAllDays: false, overrideType: 'closed', notes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
	{ id: '2', name: t('restaurant.schedule.holidays.newYear'), date: '2025-01-01', openTime: '12:00', closeTime: '20:00', closed: false, isHoliday: true, recurringYearly: true, affectsAllDays: false, overrideType: 'special_hours', notes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]);

function toggleEditingInfo() {
	if (editingInfo.value) Object.assign(restaurantInfo, originalInfo);
	editingInfo.value = !editingInfo.value;
}

function saveRestaurantInfo() {
	Object.assign(originalInfo, restaurantInfo);
	editingInfo.value = false;
	console.log('Restaurant information saved:', restaurantInfo);
}

function toggleEditingHours() {
	editingHours.value = !editingHours.value;
}

function toggleDayStatus(dayId: string) {
	const day = operatingHours.find(d => d.id === dayId);
	if (day) {
		day.closed = !day.closed;
	}
}

function copyToAllDays(sourceDay: OperatingHours) {
	operatingHours.forEach(day => {
		if (!day.closed) {
			day.openTime = sourceDay.openTime;
			day.closeTime = sourceDay.closeTime;
		}
	});
}

function addSpecialDay() {
	const newSpecialDay: SpecialDay = {
		id: Date.now().toString(),
		name: t('restaurant.schedule.newSpecialDay'),
		date: new Date().toISOString().split('T')[0],
		openTime: '10:00',
		closeTime: '22:00',
		closed: false,
		isHoliday: false,
		recurringYearly: false,
		affectsAllDays: false,
		overrideType: 'special_hours',
		notes: '',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};
	specialDays.push(newSpecialDay);
}

function removeSpecialDay(dayId: string) {
	const index = specialDays.findIndex(day => day.id === dayId);
	if (index !== -1) {
		specialDays.splice(index, 1);
	}
}

function toggleSpecialDayStatus(dayId: string) {
	const day = specialDays.find(d => d.id === dayId);
	if (day) {
		day.closed = !day.closed;
	}
}

function saveOperatingHours() {
	editingHours.value = false;
	console.log('Operating hours saved:', operatingHours);
	console.log('Special days saved:', specialDays);
}

function formatTime(time: string): string {
	const [hours, minutes] = time.split(':');
	const hour = parseInt(hours);
	const ampm = hour >= 12 ? 'PM' : 'AM';
	const formattedHour = hour % 12 || 12;
	return `${formattedHour}:${minutes} ${ampm}`;
}
</script>