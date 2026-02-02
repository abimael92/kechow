<template>
	<div class="delivery-settings-container">
		<!-- Page Header -->
		<div class="page-header">
			<div class="header-content">
				<h1 class="page-title">
					<i class="ri-truck-line"></i>
					Configuración de entrega
				</h1>
				<p class="page-description">
					Configura zonas, tarifas y horarios de entrega
				</p>
			</div>
			<div class="header-actions">
				<button
					@click="resetToDefaults"
					class="action-button secondary"
					aria-label="Restablecer valores por defecto"
				>
					<i class="ri-restart-line"></i>
					Restablecer
				</button>
				<button
					@click="saveAsTemplate"
					class="action-button secondary"
					aria-label="Guardar como plantilla"
				>
					<i class="ri-save-line"></i>
					Guardar plantilla
				</button>
			</div>
		</div>

		<div class="content-layout">
			<!-- Main Content -->
			<div class="main-content">
				<!-- Breadcrumb -->
				<nav class="breadcrumb" aria-label="Breadcrumb">
					<ol class="breadcrumb-list">
						<li class="breadcrumb-item">
							<router-link to="/settings" class="breadcrumb-link">
								<i class="ri-settings-line"></i>
								Configuración
							</router-link>
						</li>
						<li class="breadcrumb-item">
							<i class="ri-arrow-right-s-line"></i>
						</li>
						<li class="breadcrumb-item active">
							Entrega
						</li>
					</ol>
				</nav>

				<!-- Settings Sections -->
				<div class="settings-sections">
					<!-- Delivery Zones Section -->
					<section class="settings-section">
						<div class="section-header">
							<h2 class="section-title">
								<i class="ri-map-pin-2-line"></i>
								Zonas de entrega
							</h2>
							<button
								@click="openZoneManager"
								class="section-action-button"
								aria-label="Gestionar zonas de entrega"
							>
								<i class="ri-add-line"></i>
								Agregar zona
							</button>
						</div>
						<div class="section-content">
							<!-- Zone Map Preview -->
							<div v-if="showZoneMap" class="zone-map-preview">
								<div class="map-placeholder">
									<i class="ri-map-2-line"></i>
									<p class="map-placeholder-text">Vista previa del mapa</p>
								</div>
								<div class="zone-summary">
									<div class="zone-stat">
										<i class="ri-pin-distance-line zone-stat-icon"></i>
										<div>
											<span class="stat-value">{{ deliveryRadius }} km</span>
											<span class="stat-label">Radio de entrega</span>
										</div>
									</div>
									<div class="zone-stat">
										<i class="ri-money-dollar-circle-line zone-stat-icon"></i>
										<div>
											<span class="stat-value">${{ deliveryFee }}</span>
											<span class="stat-label">Tarifa de entrega</span>
										</div>
									</div>
								</div>
							</div>

							<!-- Zone Radius Control -->
							<div class="form-group">
								<label class="form-label">
									Radio de entrega
									<span class="required-indicator">*</span>
								</label>
								<div class="input-with-unit">
									<input
										v-model.number="deliveryRadius"
										class="form-input"
										type="number"
										min="1"
										max="10"
										step="1"
										required
										aria-label="Radio de entrega en km"
										@input="validateDeliveryRadius"
									/>
									<span class="input-unit">km</span>
								</div>
								<div class="input-info">
									<span class="info-text">
										Radio máximo de entrega en kilómetros (1-10 km).
									</span>
								</div>
							</div>
						</div>
					</section>

					<!-- Pricing & Fees Section -->
					<section class="settings-section">
						<div class="section-header">
							<h2 class="section-title">
								<i class="ri-money-dollar-circle-line"></i>
								Precios y tarifas
							</h2>
							<div class="currency-selector">
								<label class="currency-label">Moneda:</label>
								<select v-model="selectedCurrency" class="currency-select">
									<option value="USD">USD ($)</option>
									<option value="EUR">EUR (€)</option>
									<option value="GBP">GBP (£)</option>
									<option value="MXN">MXN ($)</option>
								</select>
							</div>
						</div>
						<div class="section-content">
							<div class="grid-layout">
								<!-- Delivery Fee -->
								<div class="form-group">
									<label class="form-label">
										Tarifa de entrega
										<span class="required-indicator">*</span>
									</label>
									<div class="input-with-unit">
										<span class="currency-symbol">{{ currencySymbol }}</span>
										<input
											v-model="deliveryFee"
											class="form-input"
											type="number"
											min="0"
											step="0.01"
											required
											aria-label="Tarifa de entrega"
											@input="validateDeliveryFee"
										/>
									</div>
									<div class="input-info">
										<span class="info-text">
											Coste fijo por entrega.
										</span>
									</div>
								</div>

								<!-- Minimum Order -->
								<div class="form-group">
									<label class="form-label">
										Pedido mínimo
										<span class="required-indicator">*</span>
									</label>
									<div class="input-with-unit">
										<span class="currency-symbol">{{ currencySymbol }}</span>
										<input
											v-model="minimumOrder"
											class="form-input"
											type="number"
											min="0"
											step="0.01"
											required
											aria-label="Pedido mínimo"
											@input="validateMinimumOrder"
										/>
									</div>
									<div class="input-info">
										<span class="info-text">
											Importe mínimo del pedido para solicitar entrega.
										</span>
									</div>
								</div>

								<!-- Service Fee -->
								<div class="form-group">
									<label class="form-label">
										Tarifa de servicio
									</label>
									<div class="input-with-unit">
										<span class="currency-symbol">{{ currencySymbol }}</span>
										<input
											v-model="serviceFee"
											class="form-input"
											type="number"
											min="0"
											step="0.01"
											aria-label="Tarifa de servicio"
										/>
									</div>
									<div class="input-info">
										<span class="info-text">
											Porcentaje o fijo por pedido.
										</span>
									</div>
								</div>

								<!-- Tax Rate -->
								<div class="form-group">
									<label class="form-label">
										IVA / Tipo impositivo
									</label>
									<div class="input-with-unit">
										<input
											v-model="taxRate"
											class="form-input"
											type="number"
											min="0"
											max="100"
											step="0.1"
											aria-label="Tipo impositivo"
										/>
										<span class="input-unit">%</span>
									</div>
									<div class="input-info">
										<span class="info-text">
											Porcentaje de impuestos aplicado.
										</span>
									</div>
								</div>
							</div>

							<!-- Fee Calculator Preview -->
							<div v-if="showFeeCalculator" class="fee-calculator">
								<h4 class="calculator-title">Calculadora de total</h4>
								<div class="calculator-grid">
									<div class="calculator-item">
										<span class="calculator-label">Subtotal del pedido</span>
										<span class="calculator-value">{{ currencySymbol }}{{ orderSubtotal }}</span>
									</div>
									<div class="calculator-item">
										<span class="calculator-label">Tarifa de entrega</span>
										<span class="calculator-value">{{ currencySymbol }}{{ deliveryFee }}</span>
									</div>
									<div class="calculator-item">
										<span class="calculator-label">Tarifa de servicio</span>
										<span class="calculator-value">{{ currencySymbol }}{{ serviceFee }}</span>
									</div>
									<div class="calculator-item">
										<span class="calculator-label">Impuestos</span>
										<span class="calculator-value">{{ currencySymbol }}{{ calculatedTax }}</span>
									</div>
									<div class="calculator-item total">
										<span class="calculator-label">Total</span>
										<span class="calculator-value">{{ currencySymbol }}{{ calculatedTotal }}</span>
									</div>
								</div>
							</div>
						</div>
					</section>

					<!-- Delivery Options Section -->
					<section class="settings-section">
						<div class="section-header">
							<h2 class="section-title">
								<i class="ri-list-settings-line"></i>
								Opciones de entrega
							</h2>
						</div>
						<div class="section-content">
							<!-- Toggle Options -->
							<div class="toggle-grid">
								<div
									v-for="option in deliveryOptions"
									:key="option.id"
									class="toggle-item"
									:class="{ 'disabled': option.disabled }"
								>
									<div class="toggle-content">
										<div class="toggle-header">
											<i :class="option.icon" class="toggle-icon"></i>
											<div>
												<h4 class="toggle-title">{{ option.title }}</h4>
												<p class="toggle-description">{{ option.description }}</p>
											</div>
										</div>
										<label class="toggle-switch">
											<input
												v-model="option.enabled"
												type="checkbox"
												class="toggle-input"
												:disabled="option.disabled"
												:aria-label="option.ariaLabel"
												@change="toggleOption(option.id)"
											/>
											<span class="toggle-slider"></span>
										</label>
									</div>
									
									<!-- Additional settings for enabled options -->
									<div v-if="option.enabled && option.settings" class="toggle-settings">
										<div
											v-for="setting in option.settings"
											:key="setting.id"
											class="additional-setting"
										>
											<label class="setting-label">{{ setting.label }}</label>
											<input
												v-model="setting.value"
												class="setting-input"
												:type="setting.type"
												:min="setting.min"
												:max="setting.max"
												:step="setting.step"
												:aria-label="setting.ariaLabel"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					<!-- Delivery Times Section -->
					<section class="settings-section">
						<div class="section-header">
							<h2 class="section-title">
								<i class="ri-time-line"></i>
								Horarios de entrega
							</h2>
							<div class="time-presets">
								<button
									v-for="preset in timePresets"
									:key="preset.id"
									@click="applyTimePreset(preset)"
									class="preset-button"
									:class="{ 'active': preset.active }"
								>
									{{ preset.label }}
								</button>
							</div>
						</div>
						<div class="section-content">
							<div class="form-group">
								<label class="form-label">
									Tiempo medio de entrega
									<span class="required-indicator">*</span>
								</label>
								<div class="input-with-unit">
									<input
										v-model="averageDeliveryTime"
										class="form-input"
										type="number"
										min="5"
										max="180"
										step="5"
										required
										aria-label="Tiempo medio de entrega"
										@input="validateDeliveryTime"
									/>
									<span class="input-unit">minutos</span>
								</div>
								<div class="input-info">
									<span class="info-text">
										Tiempo estimado en minutos.
									</span>
								</div>
							</div>

							<!-- Delivery Hours -->
							<div class="delivery-hours">
								<h4 class="hours-title">Horario de entrega</h4>
								<div class="hours-grid">
									<div
										v-for="day in deliveryDays"
										:key="day.id"
										class="day-schedule"
									>
										<label class="day-label">
											<input
												v-model="day.enabled"
												type="checkbox"
												class="day-checkbox"
												:aria-label="'Activar entrega para ' + day.name"
											/>
											<span class="day-name">{{ day.name }}</span>
										</label>
										<div v-if="day.enabled" class="time-inputs">
											<div class="time-range">
												<input
													v-model="day.startTime"
													class="time-input"
													type="time"
													:aria-label="'Hora de inicio ' + day.name"
												/>
												<span class="time-separator">a</span>
												<input
													v-model="day.endTime"
													class="time-input"
													type="time"
													:aria-label="'Hora de cierre ' + day.name"
												/>
											</div>
											<button
												@click="copyToAllDays(day)"
												class="copy-button"
												aria-label="Copiar horario a todos los días"
											>
												<i class="ri-file-copy-line"></i>
											</button>
										</div>
										<div v-else class="day-closed">
											Cerrado
										</div>
									</div>
								</div>
							</div>

							<!-- Peak Hours -->
							<div v-if="showPeakHours" class="peak-hours">
								<h4 class="peak-title">
									<i class="ri-flashlight-line"></i>
									Horas punta
								</h4>
								<div class="peak-settings">
									<div class="peak-time">
										<label class="peak-label">Hora punta</label>
										<input
											v-model="peakStartTime"
											class="time-input"
											type="time"
											aria-label="Inicio hora punta"
										/>
										<span class="time-separator">a</span>
										<input
											v-model="peakEndTime"
											class="time-input"
											type="time"
											aria-label="Fin hora punta"
										/>
									</div>
									<div class="peak-fee">
										<label class="peak-label">Tarifa hora punta</label>
										<div class="input-with-unit">
											<span class="currency-symbol">{{ currencySymbol }}</span>
											<input
												v-model="peakHourFee"
												class="form-input"
												type="number"
												min="0"
												step="0.01"
												aria-label="Tarifa hora punta"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					<!-- Advanced Settings -->
					<section class="settings-section">
						<div class="section-header">
							<h2 class="section-title">
								<i class="ri-settings-3-line"></i>
								Configuración avanzada
							</h2>
							<button
								@click="toggleAdvancedSettings"
								class="toggle-advanced-button"
								:aria-expanded="showAdvancedSettings"
							>
								<i :class="showAdvancedSettings ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
								{{ showAdvancedSettings ? 'Ocultar avanzado' : 'Mostrar avanzado' }}
							</button>
						</div>
						<Transition name="slide-down">
							<div v-if="showAdvancedSettings" class="section-content">
								<div class="grid-layout">
									<!-- Max Deliveries Per Hour -->
									<div class="form-group">
										<label class="form-label">Máximo de entregas por hora</label>
										<input
											v-model="maxDeliveriesPerHour"
											class="form-input"
											type="number"
											min="1"
											max="50"
											aria-label="Máximo de entregas por hora"
										/>
									</div>

									<!-- Preparation Time -->
									<div class="form-group">
										<label class="form-label">Tiempo de preparación</label>
										<div class="input-with-unit">
											<input
												v-model="preparationTime"
												class="form-input"
												type="number"
												min="5"
												max="120"
												step="5"
												aria-label="Tiempo de preparación"
											/>
											<span class="input-unit">minutos</span>
										</div>
									</div>

									<!-- Driver Commission -->
									<div class="form-group">
										<label class="form-label">Comisión del repartidor</label>
										<div class="input-with-unit">
											<input
												v-model="driverCommission"
												class="form-input"
												type="number"
												min="0"
												max="100"
												step="0.1"
												aria-label="Comisión del repartidor"
											/>
											<span class="input-unit">%</span>
										</div>
									</div>

									<!-- Auto-assign Drivers -->
									<div class="form-group">
										<label class="form-label">Asignación automática de repartidores</label>
										<label class="checkbox-label">
											<input
												v-model="autoAssignDrivers"
												type="checkbox"
												class="checkbox-input"
												aria-label="Asignación automática"
											/>
											<span class="checkbox-custom"></span>
											<span class="checkbox-text">Activar asignación automática</span>
										</label>
									</div>
								</div>
							</div>
						</Transition>
					</section>
				</div>

				<!-- Action Buttons -->
				<div class="action-buttons">
					<button
						@click="cancelChanges"
						class="action-button secondary large"
						aria-label="Descartar cambios"
						:disabled="saving"
					>
						<i class="ri-close-line"></i>
						Cancelar
					</button>
					<button
						@click="saveChanges"
						class="action-button primary large"
						aria-label="Guardar configuración de entrega"
						:disabled="saving || !hasChanges"
						:class="{ 'loading': saving }"
					>
						<span v-if="saving" class="button-loading">
							<i class="ri-loader-4-line spin"></i>
							Guardando…
						</span>
						<span v-else class="button-content">
							<i class="ri-check-line"></i>
							Guardar cambios
						</span>
					</button>
				</div>
			</div>

			<!-- Sidebar -->
			<aside class="sidebar">
				<!-- Settings Summary -->
				<div class="sidebar-section summary-section">
					<h3 class="sidebar-title">Resumen de configuración</h3>
					<div class="summary-items">
						<div class="summary-item">
							<i class="ri-pin-distance-line summary-icon"></i>
							<div>
								<span class="summary-label">Radio de entrega</span>
								<span class="summary-value">{{ deliveryRadius }} km</span>
							</div>
						</div>
						<div class="summary-item">
							<i class="ri-money-dollar-circle-line summary-icon"></i>
							<div>
								<span class="summary-label">Tarifa de entrega</span>
								<span class="summary-value">{{ currencySymbol }}{{ deliveryFee }}</span>
							</div>
						</div>
						<div class="summary-item">
							<i class="ri-shopping-bag-line summary-icon"></i>
							<div>
								<span class="summary-label">Pedido mínimo</span>
								<span class="summary-value">{{ currencySymbol }}{{ minimumOrder }}</span>
							</div>
						</div>
						<div class="summary-item">
							<i class="ri-time-line summary-icon"></i>
							<div>
								<span class="summary-label">Tiempo de entrega</span>
								<span class="summary-value">{{ averageDeliveryTime }} minutos</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Status Indicators -->
				<div class="sidebar-section status-section">
					<h3 class="sidebar-title">Estado del servicio</h3>
					<div class="status-indicators">
						<div
							v-for="status in serviceStatuses"
							:key="status.id"
							class="status-item"
							:class="{ 'active': status.active }"
						>
							<div class="status-indicator" :class="status.color"></div>
							<span class="status-label">{{ status.label }}</span>
							<label class="status-switch">
								<input
									v-model="status.active"
									type="checkbox"
									class="status-input"
									@change="updateServiceStatus(status.id, status.active)"
								/>
								<span class="status-slider"></span>
							</label>
						</div>
					</div>
				</div>

				<!-- Quick Actions -->
				<div class="sidebar-section actions-section">
					<h3 class="sidebar-title">Acciones rápidas</h3>
					<div class="quick-actions">
						<button
							@click="testDeliveryCalculator"
							class="quick-action-button"
							aria-label="Probar calculadora de entrega"
						>
							<i class="ri-calculator-line quick-action-icon"></i>
							Probar calculadora
						</button>
						<button
							@click="viewDeliveryAnalytics"
							class="quick-action-button"
							aria-label="Ver analíticas de entrega"
						>
							<i class="ri-bar-chart-2-line quick-action-icon"></i>
							Ver analíticas
						</button>
						<button
							@click="exportSettings"
							class="quick-action-button"
							aria-label="Exportar configuración de entrega"
						>
							<i class="ri-download-line quick-action-icon"></i>
							Exportar configuración
						</button>
						<button
							@click="copySettingsLink"
							class="quick-action-button"
							aria-label="Copiar enlace de configuración"
						>
							<i class="ri-link-m quick-action-icon"></i>
							Copiar enlace
						</button>
					</div>
				</div>

				<!-- Recent Changes -->
				<div v-if="recentChanges.length > 0" class="sidebar-section changes-section">
					<h3 class="sidebar-title">Cambios recientes</h3>
					<div class="changes-list">
						<div
							v-for="change in recentChanges"
							:key="change.id"
							class="change-item"
						>
							<div class="change-icon" :class="change.type">
								<i :class="change.icon"></i>
							</div>
							<div class="change-details">
								<span class="change-description">{{ change.description }}</span>
								<span class="change-time">{{ change.time }}</span>
							</div>
						</div>
					</div>
				</div>
			</aside>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue';

// State
const deliveryRadius = ref(10);
const deliveryFee = ref(3.99);
const minimumOrder = ref(15.00);
const serviceFee = ref(0.99);
const taxRate = ref(8.5);
const averageDeliveryTime = ref(30);
const selectedCurrency = ref('USD');
const showAdvancedSettings = ref(false);
const showZoneMap = ref(true);
const showFeeCalculator = ref(true);
const showPeakHours = ref(true);
const saving = ref(false);
const hasChanges = ref(false);

// Advanced settings
const maxDeliveriesPerHour = ref(20);
const preparationTime = ref(15);
const driverCommission = ref(15);
const autoAssignDrivers = ref(true);

// Peak hours
const peakStartTime = ref('18:00');
const peakEndTime = ref('20:00');
const peakHourFee = ref(2.99);

// Delivery days
const deliveryDays = ref([
	{ id: 0, name: 'Lunes', enabled: true, startTime: '10:00', endTime: '22:00' },
	{ id: 1, name: 'Martes', enabled: true, startTime: '10:00', endTime: '22:00' },
	{ id: 2, name: 'Miércoles', enabled: true, startTime: '10:00', endTime: '22:00' },
	{ id: 3, name: 'Jueves', enabled: true, startTime: '10:00', endTime: '22:00' },
	{ id: 4, name: 'Viernes', enabled: true, startTime: '10:00', endTime: '23:00' },
	{ id: 5, name: 'Sábado', enabled: true, startTime: '11:00', endTime: '23:00' },
	{ id: 6, name: 'Domingo', enabled: true, startTime: '12:00', endTime: '21:00' },
]);

// Delivery options
const deliveryOptions = ref([
	{
		id: 'pickup',
		title: 'Recoger en local',
		description: 'Permitir que los clientes recojan su pedido',
		icon: 'ri-store-2-line',
		enabled: true,
		disabled: false,
		ariaLabel: 'Activar/desactivar recogida',
		settings: [
			{
				id: 'pickup-preparation',
				label: 'Tiempo de preparación para recogida',
				type: 'number',
				value: 15,
				min: 5,
				max: 120,
				step: 5,
				ariaLabel: 'Tiempo de preparación (minutos)'
			}
		]
	},
	{
		id: 'delivery',
		title: 'Entrega a domicilio',
		description: 'Ofrecer servicio de entrega',
		icon: 'ri-truck-line',
		enabled: true,
		disabled: false,
		ariaLabel: 'Activar/desactivar entrega',
		settings: [
			{
				id: 'delivery-buffer',
				label: 'Tiempo de margen para entrega',
				type: 'number',
				value: 10,
				min: 0,
				max: 60,
				step: 5,
				ariaLabel: 'Tiempo de margen (minutos)'
			}
		]
	},
	{
		id: 'express',
		title: 'Entrega express',
		description: 'Ofrecer entrega express',
		icon: 'ri-flashlight-line',
		enabled: false,
		disabled: false,
		ariaLabel: 'Activar/desactivar entrega express',
		settings: [
			{
				id: 'express-fee',
				label: 'Tarifa express',
				type: 'number',
				value: 5.99,
				min: 0,
				step: 0.01,
				ariaLabel: 'Tarifa express'
			},
			{
				id: 'express-time',
				label: 'Tiempo express',
				type: 'number',
				value: 15,
				min: 5,
				max: 30,
				step: 5,
				ariaLabel: 'Tiempo express (minutos)'
			}
		]
	},
	{
		id: 'scheduled',
		title: 'Entrega programada',
		description: 'Permitir entrega programada',
		icon: 'ri-calendar-line',
		enabled: true,
		disabled: false,
		ariaLabel: 'Activar/desactivar entrega programada',
		settings: [
			{
				id: 'advance-hours',
				label: 'Horas de antelación para reserva',
				type: 'number',
				value: 48,
				min: 1,
				max: 168,
				step: 1,
				ariaLabel: 'Horas de antelación'
			}
		]
	}
]);

// Time presets
const timePresets = ref([
	{ id: 'fast', label: 'Entrega rápida', value: 15, active: false },
	{ id: 'standard', label: 'Entrega estándar', value: 30, active: true },
	{ id: 'relaxed', label: 'Entrega relajada', value: 45, active: false }
]);

// Service statuses
const serviceStatuses = ref([
	{ id: 'pickup', label: 'Recogida', active: true, color: 'green' },
	{ id: 'delivery', label: 'Entrega', active: true, color: 'blue' },
	{ id: 'express', label: 'Express', active: false, color: 'orange' }
]);

// Recent changes
const recentChanges = ref([
	{ id: 1, description: 'Tarifa de entrega actualizada', time: 'Hace 2 horas', type: 'update', icon: 'ri-money-dollar-circle-line' },
	{ id: 2, description: 'Horario de entrega ampliado', time: 'Hace 1 día', type: 'add', icon: 'ri-time-line' },
	{ id: 3, description: 'Recogida activada', time: 'Hace 3 días', type: 'enable', icon: 'ri-store-2-line' }
]);

// Computed properties
const currencySymbol = computed(() => {
	const symbols: { [key: string]: string } = {
		USD: '$',
		EUR: '€',
		GBP: '£',
		MXN: '$'
	};
	return symbols[selectedCurrency.value] || '$';
});

const calculatedTax = computed(() => {
	return ((minimumOrder.value + deliveryFee.value + serviceFee.value) * (taxRate.value / 100)).toFixed(2);
});

const calculatedTotal = computed(() => {
	const subtotal = parseFloat(minimumOrder.value.toString());
	const fee = parseFloat(deliveryFee.value.toString());
	const service = parseFloat(serviceFee.value.toString());
	const tax = parseFloat(calculatedTax.value);
	return (subtotal + fee + service + tax).toFixed(2);
});

const orderSubtotal = computed(() => {
	return minimumOrder.value.toFixed(2);
});

// Methods
const validateDeliveryRadius = () => {
	const num = Number(deliveryRadius.value);
	if (num < 1) deliveryRadius.value = 1;
	else if (num > 10) deliveryRadius.value = 10;
	else deliveryRadius.value = num;
	hasChanges.value = true;
};

const validateDeliveryFee = () => {
	if (deliveryFee.value < 0) deliveryFee.value = 0;
	hasChanges.value = true;
};

const validateMinimumOrder = () => {
	if (minimumOrder.value < 0) minimumOrder.value = 0;
	hasChanges.value = true;
};

const validateDeliveryTime = () => {
	if (averageDeliveryTime.value < 5) averageDeliveryTime.value = 5;
	if (averageDeliveryTime.value > 180) averageDeliveryTime.value = 180;
	hasChanges.value = true;
};

const toggleOption = (optionId: string) => {
	const option = deliveryOptions.value.find(o => o.id === optionId);
	if (option) {
		hasChanges.value = true;
	}
};

const applyTimePreset = (preset: any) => {
	timePresets.value.forEach(p => p.active = false);
	preset.active = true;
	averageDeliveryTime.value = preset.value;
	hasChanges.value = true;
};

const copyToAllDays = (day: any) => {
	deliveryDays.value.forEach(d => {
		if (d.enabled) {
			d.startTime = day.startTime;
			d.endTime = day.endTime;
		}
	});
	hasChanges.value = true;
};

const toggleAdvancedSettings = () => {
	showAdvancedSettings.value = !showAdvancedSettings.value;
};

const openZoneManager = () => {
	// Open zone manager modal or page
	console.log('Opening zone manager');
};

const resetToDefaults = () => {
	if (confirm('¿Restablecer la configuración a los valores por defecto?')) {
		deliveryRadius.value = 10;
		deliveryFee.value = 3.99;
		minimumOrder.value = 15.00;
		averageDeliveryTime.value = 30;
		hasChanges.value = false;
	}
};

const saveAsTemplate = () => {
	// Save current settings as a template
	console.log('Saving as template');
};

const cancelChanges = () => {
	if (hasChanges.value) {
		if (confirm('¿Descartar los cambios sin guardar?')) {
			// Reset to original values
			hasChanges.value = false;
			window.history.back();
		}
	} else {
		window.history.back();
	}
};

const saveChanges = async () => {
	saving.value = true;
	
	try {
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1500));
		
		// Save changes
		console.log('Saving delivery settings:', {
			deliveryRadius: deliveryRadius.value,
			deliveryFee: deliveryFee.value,
			minimumOrder: minimumOrder.value,
			averageDeliveryTime: averageDeliveryTime.value
		});
		
		hasChanges.value = false;
		alert('Configuración guardada correctamente.');
	} catch (error) {
		console.error('Error saving settings:', error);
		alert('Error al guardar. Inténtalo de nuevo.');
	} finally {
		saving.value = false;
	}
};

const updateServiceStatus = (serviceId: string, active: boolean) => {
	const service = serviceStatuses.value.find(s => s.id === serviceId);
	if (service) {
		service.active = active;
		hasChanges.value = true;
	}
};

const testDeliveryCalculator = () => {
	alert('Calculadora de prueba: usa los valores actuales para ver el total.');
};

const viewDeliveryAnalytics = () => {
	// Navigate to analytics page
	console.log('Viewing delivery analytics');
};

const exportSettings = () => {
	// Export settings as JSON or CSV
	console.log('Exporting settings');
};

const copySettingsLink = () => {
	// Copy link to current settings
	navigator.clipboard.writeText(window.location.href);
	alert('Enlace copiado al portapapeles.');
};

// Watch for changes
watch([
	deliveryRadius,
	deliveryFee,
	minimumOrder,
	averageDeliveryTime,
	deliveryDays,
	deliveryOptions
], () => {
	hasChanges.value = true;
}, { deep: true });

// Initialize
onMounted(() => {
	// Load saved settings from localStorage or API
	const savedSettings = localStorage.getItem('deliverySettings');
	if (savedSettings) {
		const settings = JSON.parse(savedSettings);
		// Apply saved settings
	}
});
</script>

<style scoped>
/* Container */
.delivery-settings-container {
	min-height: 100vh;
	background-color: #f9fafb;
	padding: 1.5rem;
}

/* Page Header */
.page-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 2rem;
	flex-wrap: wrap;
	gap: 1rem;
}

.header-content {
	flex: 1;
	min-width: 300px;
}

.page-title {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	font-size: 1.875rem;
	font-weight: 700;
	font-family: 'Chewy', cursive;
	color: #FF6B00;
	margin: 0 0 0.5rem 0;
}

.dark .page-title {
	color: #FB923C;
}

.page-title i {
	color: #FF6B00;
	font-size: 2rem;
}

.dark .page-title i {
	color: #FB923C;
}

.page-description {
	color: #6b7280;
	font-size: 1rem;
	margin: 0;
	max-width: 600px;
}

.header-actions {
	display: flex;
	gap: 0.75rem;
	flex-wrap: wrap;
}

.action-button {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.625rem 1rem;
	border-radius: 0.75rem;
	font-weight: 500;
	font-size: 0.875rem;
	cursor: pointer;
	transition: all 0.2s;
	border: 1px solid;
}

.action-button.secondary {
	background: var(--color-card);
	border-color: #d1d5db;
	color: #374151;
}

.action-button.secondary:hover {
	background: var(--color-app-bg);
	border-color: #9ca3af;
}

.action-button i {
	font-size: 1rem;
}

/* Content Layout */
.content-layout {
	display: flex;
	gap: 2rem;
	flex-direction: column;
}

@media (min-width: 1024px) {
	.content-layout {
		flex-direction: row;
	}
}

.main-content {
	flex: 1;
	min-width: 0; /* Prevent overflow */
}

.sidebar {
	width: 100%;
}

@media (min-width: 1024px) {
	.sidebar {
		width: 320px;
		min-width: 320px;
	}
}

/* Breadcrumb */
.breadcrumb {
	margin-bottom: 1.5rem;
}

.breadcrumb-list {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	list-style: none;
	padding: 0;
	margin: 0;
	flex-wrap: wrap;
}

.breadcrumb-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.breadcrumb-link {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: #6b7280;
	text-decoration: none;
	font-size: 0.875rem;
	transition: color 0.2s;
}

.breadcrumb-link:hover {
	color: #374151;
}

.breadcrumb-item.active {
	color: #111827;
	font-weight: 500;
}

.breadcrumb-item i {
	font-size: 0.875rem;
}

/* Settings Sections */
.settings-sections {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.settings-section {
	background: var(--color-card);
	border-radius: 1rem;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	border: 1px solid #e5e7eb;
	overflow: hidden;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.5rem;
	background: var(--color-app-bg);
	border-bottom: 1px solid #e5e7eb;
	flex-wrap: wrap;
	gap: 1rem;
}

.section-title {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	font-size: 1.25rem;
	font-weight: 600;
	font-family: 'Chewy', cursive;
	color: #FF6B00;
	margin: 0;
}

.dark .section-title {
	color: #FB923C;
}

.section-title i {
	color: #FF6B00;
	font-size: 1.25rem;
}

.dark .section-title i {
	color: #FB923C;
}

.section-action-button {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	background: #3b82f6;
	color: white;
	border: none;
	border-radius: 0.75rem;
	font-weight: 500;
	font-size: 0.875rem;
	cursor: pointer;
	transition: all 0.2s;
}

.section-action-button:hover {
	background: #2563eb;
	transform: translateY(-1px);
}

.section-content {
	padding: 1.5rem;
}

/* Zone Map Preview */
.zone-map-preview {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
	.zone-map-preview {
		flex-direction: row;
	}
}

.map-placeholder {
	flex: 1;
	background: #FFEDD5;
	border-radius: 0.75rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 3rem;
	min-height: 200px;
}

.map-placeholder i {
	font-size: 3rem;
	margin-bottom: 1rem;
	color: #9ca3af;
}

.map-placeholder-text {
	color: #6b7280;
	font-size: 0.875rem;
	margin: 0;
}

.zone-summary {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	min-width: 200px;
}

@media (min-width: 768px) {
	.zone-summary {
		min-width: 250px;
	}
}

.zone-stat {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	background: var(--color-app-bg);
	border-radius: 0.75rem;
	border: 1px solid #e5e7eb;
}

.zone-stat-icon {
	font-size: 1.5rem;
	color: #3b82f6;
}

.stat-value {
	display: block;
	font-size: 1.25rem;
	font-weight: 700;
	color: #111827;
}

.stat-label {
	display: block;
	font-size: 0.875rem;
	color: #6b7280;
}

/* Form Elements */
.form-group {
	margin-bottom: 1.5rem;
}

.form-label {
	display: block;
	font-size: 0.875rem;
	font-weight: 500;
	color: #374151;
	margin-bottom: 0.5rem;
}

.required-indicator {
	color: #ef4444;
	margin-left: 0.25rem;
}

.input-with-unit {
	display: flex;
	align-items: center;
	background: var(--color-card);
	border: 1px solid #d1d5db;
	border-radius: 0.75rem;
	overflow: hidden;
	transition: all 0.2s;
}

.input-with-unit:focus-within {
	border-color: #f59e0b;
	box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.currency-symbol {
	padding: 0.75rem 0.75rem;
	background: var(--color-app-bg);
	color: #6b7280;
	font-weight: 500;
	border-right: 1px solid #e5e7eb;
}

.form-input {
	flex: 1;
	padding: 0.75rem;
	border: none;
	background: transparent;
	color: #111827;
	font-size: 1rem;
	outline: none;
	width: 100%;
}

.form-input::placeholder {
	color: #9ca3af;
}

.input-unit {
	padding: 0.75rem 1rem;
	background: var(--color-app-bg);
	color: #6b7280;
	font-weight: 500;
	border-left: 1px solid #e5e7eb;
}

.input-info {
	margin-top: 0.5rem;
}

.info-text {
	font-size: 0.75rem;
	color: #6b7280;
	margin: 0;
}

/* Grid Layout */
.grid-layout {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 1.5rem;
}

/* Toggle Grid */
.toggle-grid {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.toggle-item {
	background: var(--color-app-bg);
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
	padding: 1rem;
	transition: all 0.2s;
}

.toggle-item.disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.toggle-item:not(.disabled):hover {
	border-color: #d1d5db;
	background: var(--color-card);
}

.toggle-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
}

.toggle-header {
	display: flex;
	align-items: flex-start;
	gap: 1rem;
	flex: 1;
}

.toggle-icon {
	font-size: 1.5rem;
	color: #3b82f6;
	margin-top: 0.25rem;
}

.toggle-title {
	font-size: 1rem;
	font-weight: 600;
	color: #111827;
	margin: 0 0 0.25rem 0;
}

.toggle-description {
	font-size: 0.875rem;
	color: #6b7280;
	margin: 0;
}

/* Toggle Switch */
.toggle-switch {
	position: relative;
	display: inline-block;
	width: 3.5rem;
	height: 2rem;
}

.toggle-input {
	opacity: 0;
	width: 0;
	height: 0;
}

.toggle-slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #d1d5db;
	transition: .4s;
	border-radius: 2rem;
}

.toggle-slider:before {
	position: absolute;
	content: "";
	height: 1.5rem;
	width: 1.5rem;
	left: 0.25rem;
	bottom: 0.25rem;
	background-color: white;
	transition: .4s;
	border-radius: 50%;
}

.toggle-input:checked + .toggle-slider {
	background-color: #10b981;
}

.toggle-input:checked + .toggle-slider:before {
	transform: translateX(1.5rem);
}

.toggle-input:disabled + .toggle-slider {
	opacity: 0.6;
	cursor: not-allowed;
}

/* Toggle Settings */
.toggle-settings {
	margin-top: 1rem;
	padding-top: 1rem;
	border-top: 1px solid #e5e7eb;
}

.additional-setting {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

.setting-label {
	font-size: 0.875rem;
	color: #374151;
	font-weight: 500;
	margin-bottom: 0.25rem;
}

.setting-input {
	padding: 0.5rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	background: var(--color-card);
	color: #111827;
}

.setting-input:focus {
	outline: none;
	border-color: #f59e0b;
	box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

/* Currency Selector */
.currency-selector {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.currency-label {
	font-size: 0.875rem;
	color: #374151;
	font-weight: 500;
}

.currency-select {
	padding: 0.375rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	background: var(--color-card);
	color: #374151;
	font-size: 0.875rem;
	cursor: pointer;
}

.currency-select:focus {
	outline: none;
	border-color: #f59e0b;
	box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

/* Fee Calculator */
.fee-calculator {
	background: var(--color-app-bg);
	border: 1px solid #dbeafe;
	border-radius: 0.75rem;
	padding: 1.5rem;
	margin-top: 1.5rem;
}

.calculator-title {
	font-size: 1rem;
	font-weight: 600;
	color: #1e40af;
	margin: 0 0 1rem 0;
}

.calculator-grid {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.calculator-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 0.75rem;
	border-bottom: 1px solid #dbeafe;
}

.calculator-item.total {
	border-bottom: none;
	padding-top: 0.75rem;
	border-top: 2px solid #dbeafe;
}

.calculator-label {
	font-size: 0.875rem;
	color: #374151;
}

.calculator-value {
	font-size: 0.875rem;
	font-weight: 600;
	color: #111827;
}

.calculator-item.total .calculator-value {
	font-size: 1.125rem;
	color: #1e40af;
}

/* Time Presets */
.time-presets {
	display: flex;
	gap: 0.5rem;
}

.preset-button {
	padding: 0.5rem 1rem;
	border: 1px solid #d1d5db;
	background: var(--color-card);
	color: #6b7280;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

.preset-button:hover {
	border-color: #9ca3af;
	color: #374151;
}

.preset-button.active {
	background: #f59e0b;
	border-color: #f59e0b;
	color: white;
}

/* Delivery Hours */
.delivery-hours {
	margin-top: 2rem;
}

.hours-title {
	font-size: 1rem;
	font-weight: 600;
	color: #111827;
	margin: 0 0 1rem 0;
}

.hours-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 1rem;
}

.day-schedule {
	background: var(--color-app-bg);
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
	padding: 1rem;
}

.day-label {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-bottom: 1rem;
	cursor: pointer;
}

.day-checkbox {
	width: 1.25rem;
	height: 1.25rem;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
	cursor: pointer;
}

.day-name {
	font-weight: 500;
	color: #374151;
}

.time-inputs {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.time-range {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex: 1;
}

.time-input {
	flex: 1;
	padding: 0.5rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	background: var(--color-card);
	color: #111827;
	font-size: 0.875rem;
}

.time-input:focus {
	outline: none;
	border-color: #f59e0b;
	box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.time-separator {
	color: #6b7280;
	font-size: 0.875rem;
}

.copy-button {
	width: 2rem;
	height: 2rem;
	border: 1px solid #d1d5db;
	background: var(--color-card);
	color: #6b7280;
	border-radius: 0.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s;
}

.copy-button:hover {
	background: #FFEDD5;
	color: #374151;
	border-color: #9ca3af;
}

.copy-button i {
	font-size: 0.875rem;
}

.day-closed {
	color: #6b7280;
	font-style: italic;
	font-size: 0.875rem;
	padding: 0.5rem 0;
	margin: 0;
}

/* Peak Hours */
.peak-hours {
	margin-top: 2rem;
	padding: 1.5rem;
	background: #fffbeb;
	border: 1px solid #fcd34d;
	border-radius: 0.75rem;
}

.peak-title {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 1rem;
	font-weight: 600;
	color: #92400e;
	margin: 0 0 1rem 0;
}

.peak-title i {
	color: #f59e0b;
}

.peak-settings {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1.5rem;
}

.peak-time {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.peak-label {
	font-size: 0.875rem;
	font-weight: 500;
	color: #92400e;
	min-width: 80px;
}

.peak-fee {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

/* Advanced Settings Toggle */
.toggle-advanced-button {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	background: #FFEDD5;
	border: 1px solid #d1d5db;
	border-radius: 0.75rem;
	color: #6b7280;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

.toggle-advanced-button:hover {
	background: #e5e7eb;
	color: #374151;
}

.toggle-advanced-button i {
	font-size: 1rem;
	transition: transform 0.3s;
}

.toggle-advanced-button[aria-expanded="true"] i {
	transform: rotate(180deg);
}

/* Checkbox */
.checkbox-label {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	cursor: pointer;
}

.checkbox-input {
	display: none;
}

.checkbox-custom {
	width: 1.25rem;
	height: 1.25rem;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
	background: var(--color-card);
	position: relative;
	transition: all 0.2s;
}

.checkbox-input:checked + .checkbox-custom {
	background: #10b981;
	border-color: #10b981;
}

.checkbox-input:checked + .checkbox-custom::after {
	content: "✓";
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: white;
	font-size: 0.75rem;
}

.checkbox-text {
	font-size: 0.875rem;
	color: #374151;
}

/* Slide down animation */
.slide-down-enter-active,
.slide-down-leave-active {
	transition: all 0.3s ease;
	max-height: 1000px;
	overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
	max-height: 0;
	opacity: 0;
	padding-top: 0;
	padding-bottom: 0;
}

/* Action Buttons */
.action-buttons {
	display: flex;
	justify-content: flex-end;
	gap: 1rem;
	margin-top: 2rem;
	padding-top: 2rem;
	border-top: 1px solid #e5e7eb;
	flex-wrap: wrap;
}

.action-button.large {
	padding: 0.75rem 1.5rem;
	font-size: 1rem;
	min-width: 140px;
}

.action-button.primary {
	background: linear-gradient(135deg, #f59e0b, #ea580c);
	color: white;
	border: none;
}

.action-button.primary:hover:not(:disabled) {
	background: linear-gradient(135deg, #d97706, #c2410c);
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.action-button.primary:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.action-button.primary.loading {
	cursor: wait;
}

.button-loading {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.spin {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

.button-content {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

/* Sidebar */
.sidebar-section {
	background: var(--color-card);
	border-radius: 1rem;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	border: 1px solid #e5e7eb;
	padding: 1.5rem;
	margin-bottom: 1.5rem;
}

.sidebar-title {
	font-size: 1rem;
	font-weight: 600;
	color: #111827;
	margin: 0 0 1rem 0;
	padding-bottom: 0.75rem;
	border-bottom: 1px solid #e5e7eb;
}

/* Summary Section */
.summary-items {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.summary-item {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0.75rem;
	background: var(--color-app-bg);
	border-radius: 0.75rem;
	border: 1px solid #e5e7eb;
}

.summary-icon {
	font-size: 1.25rem;
	color: #3b82f6;
}

.summary-label {
	display: block;
	font-size: 0.75rem;
	color: #6b7280;
}

.summary-value {
	display: block;
	font-size: 0.875rem;
	font-weight: 600;
	color: #111827;
}

/* Status Indicators */
.status-indicators {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.status-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem;
	background: var(--color-app-bg);
	border-radius: 0.75rem;
	border: 1px solid #e5e7eb;
}

.status-indicator {
	width: 0.75rem;
	height: 0.75rem;
	border-radius: 50%;
}

.status-indicator.green {
	background: #10b981;
}

.status-indicator.blue {
	background: #3b82f6;
}

.status-indicator.orange {
	background: #f59e0b;
}

.status-label {
	flex: 1;
	font-size: 0.875rem;
	color: #374151;
	font-weight: 500;
}

.status-switch {
	position: relative;
	display: inline-block;
	width: 2.5rem;
	height: 1.5rem;
}

.status-input {
	opacity: 0;
	width: 0;
	height: 0;
}

.status-slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #d1d5db;
	transition: .4s;
	border-radius: 2rem;
}

.status-slider:before {
	position: absolute;
	content: "";
	height: 1rem;
	width: 1rem;
	left: 0.25rem;
	bottom: 0.25rem;
	background-color: white;
	transition: .4s;
	border-radius: 50%;
}

.status-input:checked + .status-slider {
	background-color: #10b981;
}

.status-input:checked + .status-slider:before {
	transform: translateX(1rem);
}

/* Quick Actions */
.quick-actions {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 0.75rem;
}

.quick-action-button {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	padding: 1rem;
	background: var(--color-app-bg);
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
	color: #374151;
	font-size: 0.75rem;
	cursor: pointer;
	transition: all 0.2s;
	text-align: center;
}

.quick-action-button:hover {
	background: var(--color-card);
	border-color: #d1d5db;
	transform: translateY(-2px);
}

.quick-action-icon {
	font-size: 1.25rem;
	color: #3b82f6;
}

/* Recent Changes */
.changes-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.change-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem;
	background: var(--color-app-bg);
	border-radius: 0.75rem;
	border: 1px solid #e5e7eb;
}

.change-icon {
	width: 2rem;
	height: 2rem;
	border-radius: 0.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1rem;
}

.change-icon.update {
	background: #dbeafe;
	color: #1e40af;
}

.change-icon.add {
	background: #d1fae5;
	color: #059669;
}

.change-icon.enable {
	background: #fef3c7;
	color: #d97706;
}

.change-details {
	flex: 1;
}

.change-description {
	display: block;
	font-size: 0.875rem;
	color: #374151;
	margin-bottom: 0.25rem;
}

.change-time {
	display: block;
	font-size: 0.75rem;
	color: #6b7280;
}

/* Responsive Design */
@media (max-width: 768px) {
	.delivery-settings-container {
		padding: 1rem;
	}
	
	.page-header {
		flex-direction: column;
	}
	
	.header-actions {
		width: 100%;
		justify-content: flex-start;
	}
	
	.section-header {
		flex-direction: column;
		align-items: flex-start;
	}
	
	.time-presets {
		flex-wrap: wrap;
	}
	
	.action-buttons {
		flex-direction: column;
	}
	
	.action-button.large {
		width: 100%;
	}
}

@media (max-width: 480px) {
	.grid-layout {
		grid-template-columns: 1fr;
	}
	
	.hours-grid {
		grid-template-columns: 1fr;
	}
	
	.quick-actions {
		grid-template-columns: 1fr;
	}
	
	.peak-settings {
		grid-template-columns: 1fr;
	}
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
	.delivery-settings-container {
		background: #111827;
	}
	
	.settings-section,
	.sidebar-section {
		background: #1f2937;
		border-color: #374151;
		color: #f3f4f6;
	}
	
	.page-title,
	.section-title,
	.toggle-title,
	.calculator-title,
	.hours-title,
	.peak-title,
	.sidebar-title {
		color: #f9fafb;
	}
	
	.page-description,
	.toggle-description,
	.info-text,
	.breadcrumb-link,
	.breadcrumb-item.active,
	.day-name,
	.peak-label,
	.checkbox-text,
	.summary-label,
	.change-description {
		color: #d1d5db;
	}
	
	.form-label,
	.currency-label,
	.setting-label,
	.calculator-label,
	.stat-label,
	.status-label {
		color: #e5e7eb;
	}
	
	.form-input,
	.setting-input,
	.time-input,
	.currency-select,
	.filter-select {
		background: #374151;
		border-color: #4b5563;
		color: #f3f4f6;
	}
	
	.input-with-unit,
	.zone-stat,
	.day-schedule,
	.change-item,
	.summary-item,
	.status-item,
	.toggle-item {
		background: #111827;
		border-color: #374151;
	}
	
	.currency-symbol,
	.input-unit {
		background: #374151;
		color: #d1d5db;
		border-color: #4b5563;
	}
	
	.toggle-slider,
	.status-slider {
		background-color: #4b5563;
	}
	
	.fee-calculator {
		background: #1e3a8a;
		border-color: #3b82f6;
	}
	
	.peak-hours {
		background: #451a03;
		border-color: #92400e;
	}
	
	.quick-action-button {
		background: #111827;
		border-color: #374151;
		color: #d1d5db;
	}
	
	.action-button.secondary {
		background: #374151;
		border-color: #4b5563;
		color: #f3f4f6;
	}
	
	.preset-button {
		background: #374151;
		border-color: #4b5563;
		color: #d1d5db;
	}
	
	.preset-button.active {
		background: #f59e0b;
		border-color: #f59e0b;
		color: white;
	}
}
</style>