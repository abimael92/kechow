<template>
	<div class="general-settings">
		<!-- Restaurant info first -->
		<div class="content-card info-card">
			<div class="card-header">
				<h2>
					<i class="ri-store-2-line"></i>
					Información del restaurante
				</h2>
			</div>
			<div class="settings-grid">
				<div class="input-group">
					<label for="restaurantName">Nombre del restaurante</label>
					<input
						id="restaurantName"
						v-model="restaurantName"
						type="text"
						placeholder="Ej: Mario's Kitchen"
						@input="onChange"
					/>
				</div>
				<div class="input-group">
					<label for="restaurantPhone">Teléfono</label>
					<input
						id="restaurantPhone"
						v-model="restaurantPhone"
						type="tel"
						placeholder="+52 555 123 4567"
						@input="onChange"
					/>
				</div>
				<div class="input-group full-width">
					<label for="restaurantAddress">Dirección</label>
					<input
						id="restaurantAddress"
						v-model="restaurantAddress"
						type="text"
						placeholder="Calle, número, colonia, ciudad"
						@input="onChange"
					/>
				</div>
				<div class="input-group full-width">
					<label for="restaurantDescription">Descripción</label>
					<textarea
						id="restaurantDescription"
						v-model="restaurantDescription"
						rows="4"
						placeholder="Describe tu restaurante, especialidades, ambiente..."
						@input="onChange"
					></textarea>
				</div>
				<div class="input-group full-width">
					<div class="toggle-row">
						<div class="toggle-info">
							<label for="isOpen">Restaurante activo</label>
							<span class="toggle-hint">Los clientes podrán hacer pedidos cuando esté activo</span>
						</div>
						<label class="switch">
							<input id="isOpen" v-model="isOpen" type="checkbox" @change="onChange" />
							<span class="slider"></span>
						</label>
					</div>
				</div>
			</div>
		</div>

		<!-- Schedule and availability -->
		<div class="content-card schedule-card">
			<div class="card-header">
				<h2>
					<i class="ri-calendar-schedule-line"></i>
					Horario y disponibilidad
				</h2>
				<p class="card-subtitle">Configura los días y horas en que atiendes. Los clientes verán esta información.</p>
			</div>

			<!-- Manual override: closed today -->
			<div class="override-section">
				<div class="toggle-row">
					<div class="toggle-info">
						<label for="overrideClosed">Cerrar hoy (excepción manual)</label>
						<span class="toggle-hint">Marca esto para mostrarte como cerrado hoy aunque tu horario diga lo contrario</span>
					</div>
					<label class="switch">
						<input
							id="overrideClosed"
							v-model="overrideClosed"
							type="checkbox"
							@change="onChange"
						/>
						<span class="slider"></span>
					</label>
				</div>
			</div>

			<!-- Schedule mode toggle -->
			<div class="schedule-mode-section">
				<div class="toggle-row schedule-mode-toggle">
					<div class="toggle-info">
						<label for="weekdayMode">Mismo horario Lunes a Viernes</label>
						<span class="toggle-hint">Activa para usar un solo horario entre semana. Sábado y Domingo quedan cerrados. Desactiva para configurar cada día por separado.</span>
					</div>
					<label class="switch">
						<input
							id="weekdayMode"
							v-model="weekdayMode"
							type="checkbox"
							@change="onWeekdayModeChange"
						/>
						<span class="slider"></span>
					</label>
				</div>
			</div>

			<!-- Weekday schedule: single input for Mon-Fri -->
			<div v-if="weekdayMode" class="schedule-section schedule-weekday">
				<h3><i class="ri-time-line"></i> Lunes a Viernes</h3>
				<p class="section-hint">Este horario aplica de Lunes a Viernes. Sábado y Domingo estarán cerrados.</p>
				<div class="weekday-block">
				<div class="weekday-single-row">
					<div class="weekday-label">
						<span class="day-name">Lun – Vie</span>
					</div>
					<div class="time-fields">
						<input
							v-model="weekdayTemplate.openTime"
							type="time"
							class="time-input"
							@change="applyWeekdayToAll"
						/>
						<span class="time-sep">a</span>
						<input
							v-model="weekdayTemplate.closeTime"
							type="time"
							class="time-input"
							@change="applyWeekdayToAll"
						/>
					</div>
					<button
						type="button"
						class="break-btn"
						:class="{ active: weekdayTemplate.breakEnabled }"
						@click="weekdayTemplate.breakEnabled = !weekdayTemplate.breakEnabled; applyWeekdayToAll()"
					>
						<i class="ri-time-line"></i>
						Descanso
					</button>
				</div>
				<div v-if="weekdayTemplate.breakEnabled" class="break-row">
					<span class="break-label">Horario de descanso</span>
					<input
						v-model="weekdayTemplate.breakStart"
						type="time"
						class="time-input"
						@change="applyWeekdayToAll"
					/>
					<span class="time-sep">a</span>
					<input
						v-model="weekdayTemplate.breakEnd"
						type="time"
						class="time-input"
						@change="applyWeekdayToAll"
					/>
				</div>
				</div>
				<div class="weekend-note">
					<i class="ri-information-line"></i>
					<span>Sábado y Domingo: Cerrado</span>
				</div>
			</div>

			<!-- Per-day schedule: when toggle OFF -->
			<div v-else class="schedule-section schedule-per-day">
				<h3><i class="ri-time-line"></i> Horario por día</h3>
				<p class="section-hint">Marca los días que trabajas y define el horario. Si el día está desmarcado, no atiendes.</p>
				<div class="hours-grid">
					<div
						v-for="day in operatingDays"
						:key="day.id"
						class="day-card"
						:class="{ 'day-closed': !day.enabled }"
					>
						<div class="day-row">
							<button
								type="button"
								class="day-btn"
								:class="{ active: day.enabled }"
								@click="day.enabled = !day.enabled; onChange()"
							>
								<span class="day-name">{{ day.name }}</span>
								<span class="day-status">{{ day.enabled ? 'Abierto' : 'Cerrado' }}</span>
							</button>
							<template v-if="day.enabled">
								<div class="time-fields">
									<input
										v-model="day.openTime"
										type="time"
										class="time-input"
										@change="onChange"
									/>
									<span class="time-sep">a</span>
									<input
										v-model="day.closeTime"
										type="time"
										class="time-input"
										@change="onChange"
									/>
								</div>
								<button
									type="button"
									class="break-btn"
									:class="{ active: day.breakEnabled }"
									@click="day.breakEnabled = !day.breakEnabled; onChange()"
								>
									<i class="ri-time-line"></i>
									Descanso
								</button>
							</template>
						</div>
						<div v-if="day.enabled && day.breakEnabled" class="break-row">
							<span class="break-label">Horario de descanso</span>
							<input
								v-model="day.breakStart"
								type="time"
								class="time-input"
								@change="onChange"
							/>
							<span class="time-sep">a</span>
							<input
								v-model="day.breakEnd"
								type="time"
								class="time-input"
								@change="onChange"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Holiday / closed dates -->
			<div class="holidays-section">
				<h3><i class="ri-calendar-close-line"></i> Días festivos o cerrados</h3>
				<p class="section-hint">Añade fechas en las que el restaurante permanecerá cerrado (Navidad, Año Nuevo, etc.)</p>
				<div class="holiday-input-row">
					<input
						v-model="newClosedDate"
						type="date"
						class="date-input"
						@keydown.enter="addClosedDate"
					/>
					<button type="button" class="btn-add" @click="addClosedDate">
						<i class="ri-add-line"></i>
						Añadir fecha
					</button>
				</div>
				<ul v-if="closedDates.length > 0" class="closed-dates-list">
					<li v-for="(d, idx) in closedDates" :key="d" class="closed-date-item">
						<span>{{ formatDate(d) }}</span>
						<button type="button" class="btn-remove" @click="removeClosedDate(idx)" aria-label="Eliminar">
							<i class="ri-close-line"></i>
						</button>
					</li>
				</ul>
				<p v-else class="no-dates">No hay fechas cerradas configuradas</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getRestaurantSettings, updateRestaurantSettings } from '@/features/business-owner/services/businessOwner.service';

const emit = defineEmits<{
	(e: 'change'): void;
}>();

const restaurantName = ref('');
const restaurantPhone = ref('');
const restaurantAddress = ref('');
const restaurantDescription = ref('');
const isOpen = ref(true);
const overrideClosed = ref(false);
const closedDates = ref<string[]>([]);
const newClosedDate = ref('');

const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/** When true: single schedule for Mon–Fri, Sat/Sun closed. When false: per-day config. */
const weekdayMode = ref(true);

/** Template used when weekdayMode is on (drives Mon–Fri). */
const weekdayTemplate = ref({
	openTime: '10:00',
	closeTime: '22:00',
	breakEnabled: false,
	breakStart: '14:00',
	breakEnd: '16:00',
});

const operatingDays = ref(
	dayNames.map((name, i) => ({
		id: i,
		name,
		enabled: i < 5,
		openTime: '10:00',
		closeTime: '22:00',
		breakEnabled: false,
		breakStart: '14:00',
		breakEnd: '16:00',
	}))
);

const onChange = () => {
	emit('change');
};

function onWeekdayModeChange() {
	if (weekdayMode.value) {
		operatingDays.value.forEach((d, i) => {
			d.enabled = i < 5;
			d.openTime = weekdayTemplate.value.openTime;
			d.closeTime = weekdayTemplate.value.closeTime;
			d.breakEnabled = weekdayTemplate.value.breakEnabled;
			d.breakStart = weekdayTemplate.value.breakStart;
			d.breakEnd = weekdayTemplate.value.breakEnd;
		});
	}
	onChange();
}

function applyWeekdayToAll() {
	if (!weekdayMode.value) return;
	operatingDays.value.forEach((d, i) => {
		if (i < 5) {
			d.openTime = weekdayTemplate.value.openTime;
			d.closeTime = weekdayTemplate.value.closeTime;
			d.breakEnabled = weekdayTemplate.value.breakEnabled;
			d.breakStart = weekdayTemplate.value.breakStart;
			d.breakEnd = weekdayTemplate.value.breakEnd;
		}
	});
	onChange();
}

function formatDate(d: string): string {
	try {
		const [y, m, day] = d.split('-');
		const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
		return `${parseInt(day, 10)} ${months[parseInt(m || '1', 10) - 1]} ${y}`;
	} catch {
		return d;
	}
}

function addClosedDate() {
	const d = newClosedDate.value.trim();
	if (!d) return;
	if (closedDates.value.includes(d)) return;
	closedDates.value = [...closedDates.value, d].sort();
	newClosedDate.value = '';
	onChange();
}

function removeClosedDate(idx: number) {
	closedDates.value = closedDates.value.filter((_, i) => i !== idx);
	onChange();
}


const loadSettings = async () => {
	try {
		const { useOwnerRestaurantStore } = await import('@/features/business-owner/store/ownerRestaurant.store');
		const store = useOwnerRestaurantStore();
		await store.ensureMyRestaurant();
		const data = await getRestaurantSettings();
		restaurantName.value = data.name || '';
		restaurantPhone.value = data.phone || '';
		restaurantAddress.value = data.address || '';
		restaurantDescription.value = data.description || '';
		isOpen.value = data.isOpen ?? true;
		overrideClosed.value = data.overrideClosed ?? false;
		closedDates.value = Array.isArray(data.closedDates) ? [...data.closedDates] : [];
		if (data.operatingHours?.length) {
			const loaded = data.operatingHours.slice(0, 7).map(
				(
					oh: {
						day?: string;
						openTime?: string;
						closeTime?: string;
						closed?: boolean;
						breakEnabled?: boolean;
						breakStart?: string;
						breakEnd?: string;
					},
					i: number
				) => ({
					id: i,
					name: dayNames[i] ?? oh.day ?? '',
					enabled: !oh.closed,
					openTime: oh.openTime ?? '10:00',
					closeTime: oh.closeTime ?? '22:00',
					breakEnabled: oh.breakEnabled ?? false,
					breakStart: oh.breakStart ?? '14:00',
					breakEnd: oh.breakEnd ?? '16:00',
				})
			);
			operatingDays.value = loaded;
			const monFriSame =
				loaded[0]?.enabled &&
				loaded[1]?.enabled &&
				loaded[2]?.enabled &&
				loaded[3]?.enabled &&
				loaded[4]?.enabled &&
				!loaded[5]?.enabled &&
				!loaded[6]?.enabled;
			const sameHours =
				monFriSame &&
				loaded.every(
					(d, i) =>
						i >= 5 ||
						(d.openTime === loaded[0].openTime &&
							d.closeTime === loaded[0].closeTime &&
							d.breakEnabled === loaded[0].breakEnabled &&
							d.breakStart === loaded[0].breakStart &&
							d.breakEnd === loaded[0].breakEnd)
				);
			if (sameHours && loaded[0]) {
				weekdayMode.value = true;
				weekdayTemplate.value = {
					openTime: loaded[0].openTime,
					closeTime: loaded[0].closeTime,
					breakEnabled: loaded[0].breakEnabled,
					breakStart: loaded[0].breakStart,
					breakEnd: loaded[0].breakEnd,
				};
			} else {
				weekdayMode.value = false;
			}
		}
	} catch {
		// Use defaults
	}
};

const saveSettings = async () => {
	await updateRestaurantSettings({
		name: restaurantName.value,
		phone: restaurantPhone.value,
		address: restaurantAddress.value,
		description: restaurantDescription.value,
		isOpen: isOpen.value,
		overrideClosed: overrideClosed.value,
		closedDates: closedDates.value,
		operatingHours: operatingDays.value.map((d) => ({
			id: `day-${d.id}`,
			day: d.name,
			openTime: d.openTime,
			closeTime: d.closeTime,
			closed: !d.enabled,
			breakEnabled: d.breakEnabled,
			breakStart: d.breakStart,
			breakEnd: d.breakEnd,
		})),
	});
};

onMounted(loadSettings);

defineExpose({
	save: saveSettings,
});
</script>

<style scoped>
.general-settings {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.content-card {
	background: var(--color-card);
	border-radius: 1rem;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
	border: 1px solid rgba(229, 231, 235, 0.8);
	overflow: hidden;
}

.dark .content-card {
	border-color: rgba(55, 65, 81, 0.6);
}


.card-header {
	padding: 1.25rem 1.5rem;
	border-bottom: 1px solid rgba(229, 231, 235, 0.9);
}

.dark .card-header {
	border-color: rgba(55, 65, 81, 0.5);
}

.card-header h2 {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	font-size: 1.25rem;
	font-weight: 600;
	font-family: 'Chewy', cursive;
	color: #FF6B00;
	margin: 0;
}

.card-header h2 i {
	font-size: 1.25rem;
	opacity: 0.9;
}

.card-subtitle {
	margin: 0.5rem 0 0 0;
	font-size: 0.875rem;
	color: #6b7280;
	line-height: 1.4;
}

.override-section {
	padding: 1rem 1.5rem;
	background: rgba(254, 243, 199, 0.6);
	border-bottom: 1px solid rgba(253, 230, 138, 0.8);
}

.dark .override-section {
	background: rgba(120, 53, 15, 0.2);
	border-color: rgba(120, 53, 15, 0.3);
}

.schedule-mode-section {
	padding: 1rem 1.5rem;
	border-bottom: 1px solid rgba(229, 231, 235, 0.8);
}

.dark .schedule-mode-section {
	border-color: rgba(55, 65, 81, 0.5);
}

.schedule-mode-toggle {
	background: transparent !important;
	border: none !important;
}

.schedule-section,
.holidays-section {
	padding: 1.25rem 1.5rem;
	border-top: 1px solid rgba(229, 231, 235, 0.8);
}

.dark .schedule-section,
.dark .holidays-section {
	border-color: rgba(55, 65, 81, 0.5);
}

.schedule-section h3,
.holidays-section h3 {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 1rem;
	font-weight: 600;
	color: #111827;
	margin: 0 0 0.5rem 0;
}

.dark .schedule-section h3,
.dark .holidays-section h3 {
	color: #f3f4f6;
}

.section-hint {
	font-size: 0.8125rem;
	color: #6b7280;
	margin: 0 0 1rem 0;
	line-height: 1.4;
}

.dark .section-hint {
	color: #9ca3af;
}

/* Weekday block (row + optional break row) */
.weekday-block {
	display: flex;
	flex-direction: column;
	gap: 0;
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
	overflow: hidden;
}

.dark .weekday-block {
	border-color: rgba(75, 85, 99, 0.6);
}

.weekday-single-row {
	display: grid;
	grid-template-columns: minmax(90px, 120px) 1fr auto;
	align-items: center;
	gap: 0.75rem 1rem;
	padding: 1rem 1.25rem;
	background: #f9fafb;
}

.dark .weekday-single-row {
	background: rgba(31, 41, 55, 0.5);
}

.weekday-label .day-name {
	font-weight: 600;
	font-size: 0.9375rem;
}

/* Break row - second line, collapsed/expanded */
.break-row {
	display: flex;
	align-items: center;
	gap: 0.5rem 1rem;
	padding: 0.75rem 1.25rem 1rem;
	background: #f3f4f6;
	border-top: 1px solid #e5e7eb;
	flex-wrap: wrap;
}

.dark .break-row {
	background: rgba(55, 65, 81, 0.4);
	border-color: rgba(75, 85, 99, 0.5);
}

.break-label {
	font-size: 0.8125rem;
	color: #6b7280;
	font-weight: 500;
	min-width: 120px;
}

.dark .break-label {
	color: #9ca3af;
}

/* Break button */
.break-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	padding: 0.4rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	background: #fff;
	color: #6b7280;
	font-size: 0.8125rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

.break-btn:hover {
	background: #f9fafb;
	border-color: #9ca3af;
	color: #374151;
}

.break-btn.active {
	background: #FF6B00;
	border-color: #FF6B00;
	color: white;
}

.break-btn.active:hover {
	background: #E65F00;
	border-color: #E65F00;
}

.dark .break-btn {
	background: #374151;
	border-color: #4b5563;
	color: #9ca3af;
}

.dark .break-btn:hover {
	background: #4b5563;
	color: #e5e7eb;
}

.dark .break-btn.active {
	background: #FF6B00;
	border-color: #FF6B00;
	color: white;
}

.weekend-note {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: 1rem;
	padding: 0.75rem 1rem;
	background: rgba(229, 231, 235, 0.5);
	border-radius: 0.5rem;
	font-size: 0.875rem;
	color: #6b7280;
}

.dark .weekend-note {
	background: rgba(55, 65, 81, 0.4);
	color: #9ca3af;
}

.weekend-note i {
	font-size: 1rem;
	opacity: 0.8;
}

/* Hours grid */
.hours-grid {
	display: flex;
	flex-direction: column;
	gap: 0.625rem;
}

/* Day card: contains day row + optional break row */
.day-card {
	display: flex;
	flex-direction: column;
	gap: 0;
	border: 1px solid #e5e7eb;
	border-radius: 0.625rem;
	overflow: hidden;
	transition: opacity 0.2s;
}

.day-card.day-closed {
	opacity: 0.85;
}

.day-card.day-closed .day-row {
	grid-template-columns: 1fr;
}

.dark .day-card {
	border-color: rgba(75, 85, 99, 0.5);
}

.day-row {
	display: grid;
	grid-template-columns: minmax(100px, 130px) 1fr auto;
	align-items: center;
	gap: 0.75rem 1rem;
	padding: 0.875rem 1.25rem;
	background: #f9fafb;
	transition: background 0.2s;
}

.day-card:not(.day-closed) .day-row:hover {
	background: #f3f4f6;
}

.dark .day-row {
	background: rgba(31, 41, 55, 0.5);
}

.dark .day-card:not(.day-closed) .day-row:hover {
	background: rgba(55, 65, 81, 0.4);
}

.day-row .time-fields {
	min-width: 0;
}

/* Day button (open/closed toggle) */
.day-btn {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.125rem;
	padding: 0.5rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	background: #e5e7eb;
	color: #6b7280;
	font-size: 0.9375rem;
	font-weight: 500;
	text-align: left;
	cursor: pointer;
	transition: all 0.2s;
}

.day-btn:hover {
	background: #d1d5db;
	color: #374151;
}

.day-btn.active {
	background: #dcfce7;
	border-color: #22c55e;
	color: #166534;
}

.day-btn.active:hover {
	background: #bbf7d0;
}

.dark .day-btn {
	background: #4b5563;
	border-color: #6b7280;
	color: #9ca3af;
}

.dark .day-btn:hover {
	background: #6b7280;
	color: #e5e7eb;
}

.dark .day-btn.active {
	background: rgba(34, 197, 94, 0.2);
	border-color: #22c55e;
	color: #86efac;
}

.day-status {
	font-size: 0.75rem;
	opacity: 0.9;
}

/* Per-day break row */
.day-card .break-row {
	padding: 0.625rem 1.25rem 0.875rem;
}

.day-name {
	font-weight: 500;
	font-size: 0.9375rem;
	color: #374151;
}

.dark .day-name {
	color: #e5e7eb;
}

.time-fields {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.time-input {
	padding: 0.5rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	font-size: 0.9375rem;
	background: #fff;
	color: #111827;
	min-width: 100px;
}

.dark .time-input {
	background: #374151;
	border-color: #4b5563;
	color: #f9fafb;
}

.time-input:focus {
	outline: none;
	border-color: #FF6B00;
	box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.2);
}

.time-input-sm {
	min-width: 85px;
}

.time-sep {
	color: #6b7280;
	font-size: 0.875rem;
	font-weight: 500;
}

.closed-badge {
	font-size: 0.875rem;
	color: #6b7280;
	font-style: italic;
}

.dark .closed-badge {
	color: #9ca3af;
}

/* Holidays */
.holiday-input-row {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 1rem;
	flex-wrap: wrap;
	align-items: center;
}

.date-input {
	padding: 0.5rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	font-size: 0.9375rem;
	background: #fff;
	color: #111827;
	min-width: 155px;
}

.dark .date-input {
	background: #374151;
	border-color: #4b5563;
	color: #f9fafb;
}

.btn-add {
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	padding: 0.5rem 1rem;
	background: #FF6B00;
	color: white;
	border: none;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	transition: background 0.2s, transform 0.1s;
}

.btn-add:hover {
	background: #E65F00;
}

.btn-add:active {
	transform: scale(0.98);
}

.closed-dates-list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.closed-date-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.625rem 1rem;
	background: #f9fafb;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	font-size: 0.9375rem;
}

.dark .closed-date-item {
	background: rgba(31, 41, 55, 0.5);
	border-color: rgba(75, 85, 99, 0.5);
}

.btn-remove {
	padding: 0.35rem;
	background: transparent;
	border: none;
	color: #6b7280;
	cursor: pointer;
	border-radius: 0.375rem;
	transition: background 0.2s, color 0.2s;
}

.btn-remove:hover {
	background: #fee2e2;
	color: #dc2626;
}

.no-dates {
	font-size: 0.875rem;
	color: #9ca3af;
	margin: 0;
}

/* Settings grid */
.settings-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.25rem;
	padding: 1.5rem;
}

.input-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.input-group.full-width {
	grid-column: 1 / -1;
}

.input-group label {
	font-size: 0.875rem;
	font-weight: 500;
	color: #374151;
}

.dark .input-group label {
	color: #e5e7eb;
}

.input-group input,
.input-group textarea {
	padding: 0.75rem 1rem;
	border: 1px solid #d1d5db;
	border-radius: 0.75rem;
	font-size: 1rem;
	background: var(--color-card);
	color: #111827;
}

.dark .input-group input,
.dark .input-group textarea {
	border-color: #4b5563;
	color: #f9fafb;
}

.input-group input:focus,
.input-group textarea:focus {
	outline: none;
	border-color: #FF6B00;
	box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.2);
}

.input-group textarea {
	resize: vertical;
	min-height: 100px;
}

.toggle-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 1rem 1.25rem;
	background: #f9fafb;
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
}

.dark .toggle-row {
	background: rgba(31, 41, 55, 0.5);
	border-color: rgba(75, 85, 99, 0.5);
}

.toggle-info {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.toggle-info label {
	font-weight: 500;
	color: #111827;
}

.dark .toggle-info label {
	color: #f3f4f6;
}

.toggle-hint {
	font-size: 0.75rem;
	color: #6b7280;
	line-height: 1.35;
}

.switch {
	position: relative;
	display: inline-block;
	width: 3rem;
	height: 1.75rem;
	flex-shrink: 0;
}

.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #d1d5db;
	transition: 0.3s;
	border-radius: 1.75rem;
}

.dark .slider {
	background-color: #4b5563;
}

.slider:before {
	position: absolute;
	content: "";
	height: 1.25rem;
	width: 1.25rem;
	left: 0.25rem;
	bottom: 0.25rem;
	background-color: white;
	transition: 0.3s;
	border-radius: 50%;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.switch input:checked + .slider {
	background: linear-gradient(135deg, #10b981, #059669);
}

.switch input:checked + .slider:before {
	transform: translateX(1.25rem);
}

/* Responsive */
@media (max-width: 768px) {
	.weekday-single-row {
		grid-template-columns: 1fr;
		gap: 0.75rem;
	}

	.day-row {
		grid-template-columns: 1fr;
		gap: 0.75rem;
	}

	.day-card.day-closed .day-row {
		grid-template-columns: 1fr;
	}

	.day-row .time-fields {
		grid-column: 1;
	}

	.break-row {
		flex-direction: column;
		align-items: flex-start;
	}
}

@media (max-width: 640px) {
	.card-header,
	.schedule-section,
	.holidays-section,
	.override-section,
	.schedule-mode-section {
		padding-left: 1rem;
		padding-right: 1rem;
	}

	.settings-grid {
		grid-template-columns: 1fr;
		padding: 1rem;
	}

	.toggle-row {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
	}
}
</style>
