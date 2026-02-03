<template>
	<div class="general-settings">
		<div class="content-card">
			<div class="card-header">
				<h2>
					<i class="ri-store-2-line"></i>
					Información del restaurante
				</h2>
			</div>

			<div class="settings-grid">
				<!-- Business Name -->
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

				<!-- Phone -->
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

				<!-- Address -->
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

				<!-- Description -->
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

				<!-- Is Open Toggle -->
				<div class="input-group full-width">
					<div class="toggle-row">
						<div class="toggle-info">
							<label for="isOpen">Restaurante abierto</label>
							<span class="toggle-hint">Los clientes podrán hacer pedidos cuando esté activo</span>
						</div>
						<label class="switch">
							<input
								id="isOpen"
								v-model="isOpen"
								type="checkbox"
								@change="onChange"
							/>
							<span class="slider"></span>
						</label>
					</div>
				</div>
			</div>

			<!-- Operating Hours -->
			<div class="operating-hours-section">
				<h3>
					<i class="ri-time-line"></i>
					Horario de apertura
				</h3>
				<div class="hours-grid">
					<div
						v-for="day in operatingDays"
						:key="day.id"
						class="day-row"
						:class="{ disabled: !day.enabled }"
					>
						<label class="day-label">
							<input
								v-model="day.enabled"
								type="checkbox"
								@change="onChange"
							/>
							<span class="day-name">{{ day.name }}</span>
						</label>
						<div v-if="day.enabled" class="time-fields">
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
						<span v-else class="closed-badge">Cerrado</span>
					</div>
				</div>
				<button type="button" class="copy-schedule-btn" @click="copyScheduleToAll">
					<i class="ri-file-copy-line"></i>
					Copiar horario a todos los días
				</button>
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

const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const operatingDays = ref(
	dayNames.map((name, i) => ({
		id: i,
		name,
		enabled: true,
		openTime: '10:00',
		closeTime: '22:00',
	}))
);

const onChange = () => {
	emit('change');
};

const copyScheduleToAll = () => {
	const first = operatingDays.value.find(d => d.enabled);
	if (first) {
		operatingDays.value.forEach(d => {
			if (d.enabled) {
				d.openTime = first.openTime;
				d.closeTime = first.closeTime;
			}
		});
		onChange();
	}
};

const loadSettings = async () => {
	try {
		const data = await getRestaurantSettings();
		restaurantName.value = data.name || '';
		restaurantPhone.value = data.phone || '';
		restaurantAddress.value = data.address || '';
		restaurantDescription.value = data.description || '';
		isOpen.value = data.isOpen ?? true;
		if (data.operatingHours?.length) {
			operatingDays.value = data.operatingHours.slice(0, 7).map((oh: { day?: string; openTime?: string; closeTime?: string; closed?: boolean }, i: number) => ({
				id: i,
				name: dayNames[i] ?? oh.day ?? '',
				enabled: !oh.closed,
				openTime: oh.openTime ?? '10:00',
				closeTime: oh.closeTime ?? '22:00',
			}));
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
		operatingHours: operatingDays.value.map(d => ({
			id: `day-${d.id}`,
			day: d.name,
			openTime: d.openTime,
			closeTime: d.closeTime,
			closed: !d.enabled,
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
}

.content-card {
	background: var(--color-card);
	border-radius: 1rem;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	border: 1px solid #e5e7eb;
	overflow: hidden;
}

.card-header {
	padding: 1.5rem;
	border-bottom: 1px solid #e5e7eb;
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
}

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

.input-group input,
.input-group textarea {
	padding: 0.75rem 1rem;
	border: 1px solid #d1d5db;
	border-radius: 0.75rem;
	font-size: 1rem;
	background: var(--color-card);
	color: #111827;
}

.input-group input:focus,
.input-group textarea:focus {
	outline: none;
	border-color: #f59e0b;
	box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
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
	padding: 1rem;
	background: #f9fafb;
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
}

.toggle-info {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.toggle-hint {
	font-size: 0.75rem;
	color: #6b7280;
}

/* Switch */
.switch {
	position: relative;
	display: inline-block;
	width: 3rem;
	height: 1.75rem;
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

/* Operating Hours */
.operating-hours-section {
	padding: 1.5rem;
	border-top: 1px solid #e5e7eb;
}

.operating-hours-section h3 {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 1rem;
	font-weight: 600;
	color: #111827;
	margin: 0 0 1rem 0;
}

.hours-grid {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.day-row {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0.75rem 1rem;
	background: #f9fafb;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
}

.day-row.disabled {
	opacity: 0.7;
}

.day-label {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	min-width: 120px;
	cursor: pointer;
}

.day-name {
	font-weight: 500;
	color: #374151;
}

.time-fields {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex: 1;
}

.time-input {
	padding: 0.5rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	background: var(--color-card);
}

.time-sep {
	color: #6b7280;
	font-size: 0.875rem;
}

.closed-badge {
	font-size: 0.875rem;
	color: #6b7280;
	font-style: italic;
}

.copy-schedule-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: 1rem;
	padding: 0.5rem 1rem;
	background: transparent;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	color: #6b7280;
	font-size: 0.875rem;
	cursor: pointer;
	transition: all 0.2s;
}

.copy-schedule-btn:hover {
	background: #f3f4f6;
	color: #374151;
	border-color: #9ca3af;
}

@media (max-width: 640px) {
	.settings-grid {
		grid-template-columns: 1fr;
	}
}
</style>
