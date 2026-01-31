<template>

	<!-- Header Section -->
		<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-3 sm:gap-4">
			<div class="flex items-center gap-2 sm:gap-3 md:gap-4">
				<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
					<i class="ri-star-line text-white text-lg sm:text-xl md:text-2xl"></i>
				</div>
				<div class="flex-1 min-w-0">
					<h1 class="text-bubble text-3xl sm:text-4xl md:text-5xl lg:text-6xl shadow-primary-500 leading-tight sm:leading-snug">
					   {{ t('settings') }}
					</h1>
					<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none truncate">
				     {{ t('manageTrackOrders') }}
						<span class="ml-1 sm:ml-2 text-tertiary-800 dark:text-tertiary-400 font-medium whitespace-nowrap">
					     {{ t('manageRestaurantSettings') }}
						</span>
					</p>
				</div>
			</div>
		</div>
			
	<div class="delivery-settings-mobile-optimized">
		<!-- Simplified Header for Mobile -->
		<div class="mobile-header">
			<div class="header-top">
		
				<h1 class="mobile-title">
					<i class="ri-truck-line"></i>
					{{ t('deliverySettings') }}
				</h1>
				<div class="header-actions-mobile">
					<button
						@click="saveChanges"
						class="save-button-mobile"
						:disabled="saving || !hasChanges"
						:aria-label="t('saveChanges')"
					>
						<i class="ri-check-line"></i>
					</button>
				</div>
			</div>
			<p class="mobile-description">
				{{ t('deliverySettingsDescription') }}
			</p>
		</div>

		<!-- Main Content - Vertical Layout for Mobile -->
		<div class="main-content-mobile">
			<!-- Mobile Navigation Tabs -->
			<div class="mobile-tabs">
				<button
					v-for="tab in mobileTabs"
					:key="tab.id"
					@click="activeMobileTab = tab.id"
					:class="['mobile-tab', activeMobileTab === tab.id ? 'active' : '']"
					:aria-label="tab.label"
				>
					<i :class="tab.icon"></i>
					<span>{{ t(tab.label) }}</span>
				</button>
			</div>

			<!-- Tab Content -->
			<div class="tab-content">
				<!-- Zones Tab -->
				<div v-if="activeMobileTab === 'zones'" class="tab-pane">
					<section class="mobile-section">
						<div class="section-header-mobile">
							<h2 class="section-title-mobile">
								<i class="ri-map-pin-2-line"></i>
								{{ t('deliveryZones') }}
							</h2>
							<button
								@click="openZoneManager"
								class="add-button-mobile"
								:aria-label="$t('addZone')"
							>
								<i class="ri-add-line"></i>
							</button>
						</div>
						
						<!-- Zone Preview -->
						<div class="zone-preview-mobile">
							<div class="map-placeholder-mobile">
								<i class="ri-map-2-line"></i>
								<p>{{ t('zoneMapPreview') }}</p>
							</div>
							<div class="zone-stats-mobile">
								<div class="zone-stat-mobile">
									<i class="ri-pin-distance-line"></i>
									<div>
										<strong>{{ deliveryRadius }} km</strong>
										<span>{{ t('deliveryRadius') }}</span>
									</div>
								</div>
								<div class="zone-stat-mobile">
									<i class="ri-money-dollar-circle-line"></i>
									<div>
										<strong>{{ currencySymbol }}{{ deliveryFee }}</strong>
										<span>{{ t('deliveryFee') }}</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Zone Controls -->
						<div class="form-group-mobile">
							<label class="form-label-mobile">
								{{ t('deliveryRadius') }}
							</label>
							<div class="slider-container">
								<input
									v-model="deliveryRadius"
									type="range"
									min="1"
									max="100"
									step="1"
									class="range-slider"
									@input="validateDeliveryRadius"
								/>
								<div class="slider-values">
									<span>1km</span>
									<span class="current-value">{{ deliveryRadius }}km</span>
									<span>100km</span>
								</div>
							</div>
						</div>
					</section>
				</div>

				<!-- Pricing Tab -->
				<div v-if="activeMobileTab === 'pricing'" class="tab-pane">
					<section class="mobile-section">
						<div class="section-header-mobile">
							<h2 class="section-title-mobile">
								<i class="ri-money-dollar-circle-line"></i>
								{{ t('pricingAndFees') }}
							</h2>
							<select v-model="selectedCurrency" class="currency-select-mobile">
								<option value="USD">USD</option>
								<option value="EUR">EUR</option>
								<option value="GBP">GBP</option>
								<option value="MXN">MXN</option>
							</select>
						</div>

						<!-- Fee Inputs -->
						<div class="fee-inputs-mobile">
							<div class="fee-input-mobile">
								<label>{{ t('deliveryFee') }}</label>
								<div class="input-with-icon-mobile">
									<span class="input-icon">{{ currencySymbol }}</span>
									<input
										v-model="deliveryFee"
										type="number"
										min="0"
										step="0.01"
										class="input-field-mobile"
										@input="validateDeliveryFee"
									/>
								</div>
							</div>

							<div class="fee-input-mobile">
								<label>{{ t('minimumOrder') }}</label>
								<div class="input-with-icon-mobile">
									<span class="input-icon">{{ currencySymbol }}</span>
									<input
										v-model="minimumOrder"
										type="number"
										min="0"
										step="0.01"
										class="input-field-mobile"
										@input="validateMinimumOrder"
									/>
								</div>
							</div>

							<div class="fee-input-mobile">
								<label>{{ t('serviceFee') }}</label>
								<div class="input-with-icon-mobile">
									<span class="input-icon">{{ currencySymbol }}</span>
									<input
										v-model="serviceFee"
										type="number"
										min="0"
										step="0.01"
										class="input-field-mobile"
									/>
								</div>
							</div>
						</div>

						<!-- Calculator Preview -->
						<div class="calculator-mobile">
							<h4>{{ t('feeCalculator') }}</h4>
							<div class="calculator-items-mobile">
								<div class="calculator-item-mobile">
									<span>{{ t('orderSubtotal') }}</span>
									<strong>{{ currencySymbol }}{{ orderSubtotal }}</strong>
								</div>
								<div class="calculator-item-mobile">
									<span>{{ t('deliveryFee') }}</span>
									<strong>{{ currencySymbol }}{{ deliveryFee }}</strong>
								</div>
								<div class="calculator-item-mobile total">
									<span>{{ t('total') }}</span>
									<strong>{{ currencySymbol }}{{ calculatedTotal }}</strong>
								</div>
							</div>
						</div>
					</section>
				</div>

				<!-- Options Tab -->
				<div v-if="activeMobileTab === 'options'" class="tab-pane">
					<section class="mobile-section">
						<div class="section-header-mobile">
							<h2 class="section-title-mobile">
								<i class="ri-list-settings-line"></i>
								{{ t('deliveryOptions') }}
							</h2>
						</div>

						<!-- Toggle Options -->
						<div class="options-list-mobile">
							<div
								v-for="option in deliveryOptions"
								:key="option.id"
								class="option-item-mobile"
							>
								<div class="option-header-mobile">
									<div class="option-icon-title">
										<i :class="option.icon" class="option-icon-mobile"></i>
										<div>
											<h4>{{ option.title }}</h4>
											<p>{{ option.description }}</p>
										</div>
									</div>
									<label class="toggle-switch-mobile">
										<input
											v-model="option.enabled"
											type="checkbox"
											:disabled="option.disabled"
										/>
										<span class="toggle-slider-mobile"></span>
									</label>
								</div>
							</div>
						</div>
					</section>
				</div>

				<!-- Times Tab -->
				<div v-if="activeMobileTab === 'times'" class="tab-pane">
					<section class="mobile-section">
						<div class="section-header-mobile">
							<h2 class="section-title-mobile">
								<i class="ri-time-line"></i>
								{{ t('deliveryTimes') }}
							</h2>
						</div>

						<!-- Average Time -->
						<div class="time-input-mobile">
							<label>{{ t('averageDeliveryTime') }}</label>
							<div class="input-with-unit-mobile">
								<input
									v-model="averageDeliveryTime"
									type="number"
									min="5"
									max="180"
									step="5"
									@input="validateDeliveryTime"
								/>
								<span class="unit">{{ t('minutes') }}</span>
							</div>
						</div>

						<!-- Delivery Hours -->
						<div class="hours-section-mobile">
							<h4>{{ t('deliveryHours') }}</h4>
							<div class="days-list-mobile">
								<div
									v-for="day in deliveryDays"
									:key="day.id"
									class="day-item-mobile"
								>
									<div class="day-header-mobile">
										<label class="day-checkbox-mobile">
											<input
												v-model="day.enabled"
												type="checkbox"
											/>
											<span class="checkbox-custom-mobile"></span>
											<span class="day-name-mobile">{{ day.name }}</span>
										</label>
										<div v-if="day.enabled" class="time-range-mobile">
											<input v-model="day.startTime" type="time" />
											<span>to</span>
											<input v-model="day.endTime" type="time" />
										</div>
										<span v-else class="closed-label">Closed</span>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>

		<!-- Mobile Action Bar -->
		<div class="mobile-action-bar">
			<button
				@click="resetToDefaults"
				class="action-button-mobile secondary"
				:disabled="saving"
			>
				<i class="ri-restart-line"></i>
				{{ t('reset') }}
			</button>
			<button
				@click="saveChanges"
				class="action-button-mobile primary"
				:disabled="saving || !hasChanges"
				:class="{ loading: saving }"
			>
				<template v-if="saving">
					<i class="ri-loader-4-line spin"></i>
					{{ t('saving') }}
				</template>
				<template v-else>
					<i class="ri-check-line"></i>
					{{ t('saveChanges') }}
				</template>
			</button>
		</div>

		<!-- Quick Actions Modal/Sheet -->
		<div v-if="showQuickActions" class="quick-actions-modal">
			<div class="modal-backdrop" @click="showQuickActions = false"></div>
			<div class="modal-content">
				<div class="modal-header">
					<h3>{{ t('quickActions') }}</h3>
					<button @click="showQuickActions = false" class="modal-close">
						<i class="ri-close-line"></i>
					</button>
				</div>
				<div class="modal-actions">
					<button @click="testDeliveryCalculator" class="modal-action">
						<i class="ri-calculator-line"></i>
						<span>{{ t('testCalculator') }}</span>
					</button>
					<button @click="viewDeliveryAnalytics" class="modal-action">
						<i class="ri-bar-chart-2-line"></i>
						<span>{{ t('viewAnalytics') }}</span>
					</button>
					<button @click="exportSettings" class="modal-action">
						<i class="ri-download-line"></i>
						<span>{{ t('exportSettings') }}</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// State
const deliveryRadius = ref(10);
const deliveryFee = ref(3.99);
const minimumOrder = ref(15.00);
const serviceFee = ref(0.99);
const taxRate = ref(8.5);
const averageDeliveryTime = ref(30);
const selectedCurrency = ref('USD');
const saving = ref(false);
const hasChanges = ref(false);
const activeMobileTab = ref('zones');
const showQuickActions = ref(false);

// Mobile tabs
const mobileTabs = [
	{ id: 'zones', label: 'deliveryZones', icon: 'ri-map-pin-2-line' },
	{ id: 'pricing', label: 'pricingAndFees', icon: 'ri-money-dollar-circle-line' },
	{ id: 'options', label: 'deliveryOptions', icon: 'ri-list-settings-line' },
	{ id: 'times', label: 'deliveryTimes', icon: 'ri-time-line' },
];

// Delivery days (simplified for mobile)
const deliveryDays = ref([
	{ id: 0, name: t('monday'), enabled: true, startTime: '10:00', endTime: '22:00' },
	{ id: 1, name: t('tuesday'), enabled: true, startTime: '10:00', endTime: '22:00' },
	{ id: 2, name: t('wednesday'), enabled: true, startTime: '10:00', endTime: '22:00' },
	{ id: 3, name: t('thursday'), enabled: true, startTime: '10:00', endTime: '22:00' },
	{ id: 4, name: t('friday'), enabled: true, startTime: '10:00', endTime: '23:00' },
	{ id: 5, name: t('saturday'), enabled: true, startTime: '11:00', endTime: '23:00' },
	{ id: 6, name: t('sunday'), enabled: true, startTime: '12:00', endTime: '21:00' },
]);

// Delivery options (simplified)
const deliveryOptions = ref([
	{
		id: 'pickup',
		title: t('enablePickup'),
		description: t('allowCustomersPickup'),
		icon: 'ri-store-2-line',
		enabled: true,
		disabled: false,
	},
	{
		id: 'delivery',
		title: t('enableDelivery'),
		description: t('offerDeliveryService'),
		icon: 'ri-truck-line',
		enabled: true,
		disabled: false,
	},
	{
		id: 'express',
		title: t('expressDelivery'),
		description: t('offerExpressDelivery'),
		icon: 'ri-flashlight-line',
		enabled: false,
		disabled: false,
	},
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

const calculatedTotal = computed(() => {
	const subtotal = parseFloat(minimumOrder.value.toString());
	const fee = parseFloat(deliveryFee.value.toString());
	const service = parseFloat(serviceFee.value.toString());
	const tax = subtotal * (taxRate.value / 100);
	return (subtotal + fee + service + tax).toFixed(2);
});

const orderSubtotal = computed(() => {
	return minimumOrder.value.toFixed(2);
});

// Methods
const validateDeliveryRadius = () => {
	if (deliveryRadius.value < 1) deliveryRadius.value = 1;
	if (deliveryRadius.value > 100) deliveryRadius.value = 100;
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

const goBack = () => {
	window.history.back();
};

const openZoneManager = () => {
	console.log('Opening zone manager');
};

const resetToDefaults = () => {
	if (confirm(t('confirmReset'))) {
		deliveryRadius.value = 10;
		deliveryFee.value = 3.99;
		minimumOrder.value = 15.00;
		averageDeliveryTime.value = 30;
		hasChanges.value = false;
	}
};

const saveChanges = async () => {
	saving.value = true;
	try {
		await new Promise(resolve => setTimeout(resolve, 1500));
		hasChanges.value = false;
		alert(t('settingsSaved'));
	} catch (error) {
		console.error('Error saving settings:', error);
		alert(t('saveError'));
	} finally {
		saving.value = false;
	}
};

const testDeliveryCalculator = () => {
	alert(t('calculatorTestMessage'));
	showQuickActions.value = false;
};

const viewDeliveryAnalytics = () => {
	console.log('Viewing delivery analytics');
	showQuickActions.value = false;
};

const exportSettings = () => {
	console.log('Exporting settings');
	showQuickActions.value = false;
};

onMounted(() => {
	// Load saved settings if any
});
</script>

<style scoped>
/* Mobile-first responsive design */
.delivery-settings-mobile-optimized {
	min-height: 100vh;
	background: #f9fafb;
	padding: 0;
	display: flex;
	flex-direction: column;
}

/* Mobile Header */
.mobile-header {
	background: white;
	padding: 1rem;
	border-bottom: 1px solid #e5e7eb;
	position: sticky;
	top: 0;
	z-index: 10;
}

.header-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 0.5rem;
}

.back-button {
	width: 2.5rem;
	height: 2.5rem;
	border: 1px solid #e5e7eb;
	background: white;
	border-radius: 0.75rem;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #374151;
	cursor: pointer;
	flex-shrink: 0;
}

.back-button i {
	font-size: 1.25rem;
}

.mobile-title {
	font-size: 1.25rem;
	font-weight: 600;
	color: #111827;
	margin: 0;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex: 1;
}

.mobile-title i {
	color: #f59e0b;
}

.save-button-mobile {
	width: 2.5rem;
	height: 2.5rem;
	background: #10b981;
	color: white;
	border: none;
	border-radius: 0.75rem;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	flex-shrink: 0;
}

.save-button-mobile:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.mobile-description {
	font-size: 0.875rem;
	color: #6b7280;
	margin: 0;
	line-height: 1.4;
}

/* Mobile Tabs */
.mobile-tabs {
	display: flex;
	background: #f7d9ff;
	border-bottom: 1px solid #e5e7eb;
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;
	padding: 0.5rem;
	gap: 0.25rem;
	margin: 1rem 0;
	border-radius: 0.5rem;
}

.mobile-tabs::-webkit-scrollbar {
	display: none;
}

.mobile-tab {
	flex: 1;
	min-width: 80px;
	padding: 0.75rem 0.5rem;
	border: none;
	border-bottom: 2px solid transparent;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.25rem;
	background: #057de6;
	color: #6b7280;
	font-size: 0.75rem;
	cursor: pointer;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	display: -webkit-box;
	overflow: hidden;
	text-align: center;
}

.mobile-tab.active {
	color: #3b82f6;
	border-bottom-color: #3b82f6;
}

.mobile-tab i {
	font-size: 1.25rem;
	margin-bottom: 0.25rem;
}

/* Main Content */
.main-content-mobile {
	flex: 1;
	overflow-y: auto;
	padding: 1rem;
	padding-bottom: 5rem; /* Space for action bar */
}

.tab-pane {
	animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
	from { opacity: 0; transform: translateY(10px); }
	to { opacity: 1; transform: translateY(0); }
}

/* Mobile Sections */
.mobile-section {
	background: indigo;
	border-radius: 2rem;
	padding: 1.25rem;
	margin-bottom: 1rem;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	border: 1px solid #e5e7eb;
}

.section-header-mobile {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1.25rem;
}

.section-title-mobile {
	font-size: 1.125rem;
	font-weight: 600;
	color: #111827;
	margin: 0;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.section-title-mobile i {
	color: #f59e0b;
}

.add-button-mobile {
	width: 2.5rem;
	height: 2.5rem;
	background: #3b82f6;
	color: white;
	border: none;
	border-radius: 0.75rem;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.currency-select-mobile {
	padding: 0.5rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	background: white;
	color: #374151;
	font-size: 0.875rem;
	cursor: pointer;
}

/* Zone Preview */
.zone-preview-mobile {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-bottom: 1.5rem;
}

.map-placeholder-mobile {
	background: #f3f4f6;
	border-radius: 0.75rem;
	padding: 2rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
}

.map-placeholder-mobile i {
	font-size: 3rem;
	color: #9ca3af;
	margin-bottom: 0.5rem;
}

.map-placeholder-mobile p {
	color: #6b7280;
	font-size: 0.875rem;
	margin: 0;
}

.zone-stats-mobile {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 0.75rem;
}

.zone-stat-mobile {
	background: #f9fafb;
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
	padding: 1rem;
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.zone-stat-mobile i {
	font-size: 1.5rem;
	color: #3b82f6;
}

.zone-stat-mobile div {
	display: flex;
	flex-direction: column;
}

.zone-stat-mobile strong {
	font-size: 1.125rem;
	color: #111827;
}

.zone-stat-mobile span {
	font-size: 0.75rem;
	color: #6b7280;
}

/* Form Elements */
.form-group-mobile {
	margin-top: 1.5rem;
}

.form-label-mobile {
	display: block;
	font-size: 0.875rem;
	font-weight: 500;
	color: #374151;
	margin-bottom: 0.75rem;
}

.slider-container {
	background: #f9fafb;
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
	padding: 1.25rem;
}

.range-slider {
	width: 100%;
	height: 4px;
	-webkit-appearance: none;
	appearance: none;
	background: #d1d5db;
	border-radius: 2px;
	outline: none;
}

.range-slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background: #3b82f6;
	cursor: pointer;
	border: 3px solid white;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-values {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 0.75rem;
	font-size: 0.75rem;
	color: #6b7280;
}

.current-value {
	font-weight: 600;
	color: #3b82f6;
}

/* Fee Inputs */
.fee-inputs-mobile {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.fee-input-mobile {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.fee-input-mobile label {
	font-size: 0.875rem;
	font-weight: 500;
	color: #374151;
}

.input-with-icon-mobile {
	display: flex;
	align-items: center;
	background: white;
	border: 1px solid #d1d5db;
	border-radius: 0.75rem;
	overflow: hidden;
}

.input-icon {
	padding: 0.75rem;
	background: #f9fafb;
	color: #6b7280;
	font-weight: 500;
	border-right: 1px solid #e5e7eb;
}

.input-field-mobile {
	flex: 1;
	padding: 0.75rem;
	border: none;
	background: transparent;
	color: #111827;
	font-size: 1rem;
	outline: none;
	width: 100%;
}

/* Calculator */
.calculator-mobile {
	background: #f0f9ff;
	border: 1px solid #dbeafe;
	border-radius: 0.75rem;
	padding: 1.25rem;
	margin-top: 1.5rem;
}

.calculator-mobile h4 {
	font-size: 1rem;
	font-weight: 600;
	color: #1e40af;
	margin: 0 0 1rem 0;
}

.calculator-items-mobile {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.calculator-item-mobile {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 0.75rem;
	border-bottom: 1px solid #dbeafe;
}

.calculator-item-mobile.total {
	border-bottom: none;
	padding-top: 0.75rem;
	border-top: 2px solid #dbeafe;
}

.calculator-item-mobile.total strong {
	color: #1e40af;
	font-size: 1.125rem;
}

/* Options List */
.options-list-mobile {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.option-item-mobile {
	background: #f9fafb;
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
	padding: 1rem;
}

.option-header-mobile {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;
}

.option-icon-title {
	display: flex;
	align-items: flex-start;
	gap: 0.75rem;
	flex: 1;
}

.option-icon-mobile {
	font-size: 1.5rem;
	color: #3b82f6;
	margin-top: 0.25rem;
}

.option-icon-title h4 {
	font-size: 1rem;
	font-weight: 600;
	color: #111827;
	margin: 0 0 0.25rem 0;
}

.option-icon-title p {
	font-size: 0.875rem;
	color: #6b7280;
	margin: 0;
}

/* Toggle Switch */
.toggle-switch-mobile {
	position: relative;
	display: inline-block;
	width: 3.5rem;
	height: 2rem;
	flex-shrink: 0;
}

.toggle-switch-mobile input {
	opacity: 0;
	width: 0;
	height: 0;
}

.toggle-slider-mobile {
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

.toggle-slider-mobile:before {
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

.toggle-switch-mobile input:checked + .toggle-slider-mobile {
	background-color: #10b981;
}

.toggle-switch-mobile input:checked + .toggle-slider-mobile:before {
	transform: translateX(1.5rem);
}

/* Time Inputs */
.time-input-mobile {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin-bottom: 1.5rem;
}

.time-input-mobile label {
	font-size: 0.875rem;
	font-weight: 500;
	color: #374151;
}

.input-with-unit-mobile {
	display: flex;
	align-items: center;
	background: white;
	border: 1px solid #d1d5db;
	border-radius: 0.75rem;
	overflow: hidden;
}

.input-with-unit-mobile input {
	flex: 1;
	padding: 0.75rem;
	border: none;
	background: transparent;
	color: #111827;
	font-size: 1rem;
	outline: none;
	width: 100%;
}

.unit {
	padding: 0.75rem 1rem;
	background: #f9fafb;
	color: #6b7280;
	font-weight: 500;
	border-left: 1px solid #e5e7eb;
}

/* Hours Section */
.hours-section-mobile {
	margin-top: 1.5rem;
}

.hours-section-mobile h4 {
	font-size: 1rem;
	font-weight: 600;
	color: #111827;
	margin: 0 0 1rem 0;
}

.days-list-mobile {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.day-item-mobile {
	background: #f9fafb;
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
	padding: 1rem;
}

.day-header-mobile {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

.day-checkbox-mobile {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	cursor: pointer;
	flex: 1;
}

.day-checkbox-mobile input {
	display: none;
}

.checkbox-custom-mobile {
	width: 1.25rem;
	height: 1.25rem;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
	background: white;
	position: relative;
	flex-shrink: 0;
}

.day-checkbox-mobile input:checked + .checkbox-custom-mobile {
	background: #10b981;
	border-color: #10b981;
}

.day-checkbox-mobile input:checked + .checkbox-custom-mobile::after {
	content: "✓";
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: white;
	font-size: 0.75rem;
}

.day-name-mobile {
	font-weight: 500;
	color: #374151;
}

.time-range-mobile {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.time-range-mobile input {
	padding: 0.5rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	background: white;
	color: #111827;
	font-size: 0.875rem;
}

.closed-label {
	color: #6b7280;
	font-style: italic;
	font-size: 0.875rem;
}

/* Mobile Action Bar */
.mobile-action-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: white;
	border-top: 1px solid #e5e7eb;
	padding: 1rem;
	display: flex;
	gap: 0.75rem;
	z-index: 10;
}

.action-button-mobile {
	flex: 1;
	padding: 0.875rem;
	border-radius: 0.75rem;
	font-weight: 500;
	font-size: 0.875rem;
	cursor: pointer;
	transition: all 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	border: 1px solid;
}

.action-button-mobile.primary {
	background: linear-gradient(135deg, #3b82f6, #1d4ed8);
	color: white;
	border: none;
}

.action-button-mobile.primary:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.action-button-mobile.secondary {
	background: white;
	border-color: #d1d5db;
	color: #374151;
}

.action-button-mobile.secondary:hover:not(:disabled) {
	background: #f9fafb;
	border-color: #9ca3af;
}

.action-button-mobile:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.action-button-mobile.loading {
	cursor: wait;
}

.spin {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

/* Quick Actions Modal */
.quick-actions-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 50;
}

.modal-backdrop {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
}

.modal-content {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: white;
	border-radius: 1rem 1rem 0 0;
	padding: 1.5rem;
	max-height: 80vh;
	overflow-y: auto;
	animation: slideUp 0.3s ease;
}

@keyframes slideUp {
	from { transform: translateY(100%); }
	to { transform: translateY(0); }
}

.modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1.5rem;
}

.modal-header h3 {
	font-size: 1.25rem;
	font-weight: 600;
	color: #111827;
	margin: 0;
}

.modal-close {
	width: 2.5rem;
	height: 2.5rem;
	border: 1px solid #e5e7eb;
	background: white;
	border-radius: 0.75rem;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #374151;
	cursor: pointer;
}

.modal-actions {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.modal-action {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	background: #f9fafb;
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
	color: #374151;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	width: 100%;
	text-align: left;
}

.modal-action i {
	font-size: 1.25rem;
	color: #3b82f6;
}

.modal-action span {
	flex: 1;
}

/* Desktop Responsive */
@media (min-width: 768px) {
	.delivery-settings-mobile-optimized {
		max-width: 800px;
		margin: 0 auto;
	}
	
	.mobile-tabs {
		justify-content: center;
		gap: 1rem;
		padding: 1rem 2rem;
		margin: 1rem 2rem;
	}
	
	.mobile-tab {
		min-width: 100px;
	}
	
	.mobile-action-bar {
		position: static;
		margin-top: 2rem;
		padding: 0;
		background: transparent;
		border-top: none;
	}
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
	.delivery-settings-mobile-optimized {
		background: #111827;
	}
	
	.mobile-header,
	.mobile-section,
	.modal-content {
		background: #1f2937;
		border-color: #374151;
	}
	
	.mobile-title,
	.section-title-mobile,
	.zone-stat-mobile strong,
	.option-icon-title h4,
	.modal-header h3 {
		color: #f9fafb;
	}
	
	.mobile-description,
	.map-placeholder-mobile p,
	.zone-stat-mobile span,
	.option-icon-title p,
	.form-label-mobile,
	.fee-input-mobile label,
	.time-input-mobile label {
		color: #d1d5db;
	}
	
	.back-button,
	.add-button-mobile,
	.modal-close {
		background: #374151;
		border-color: #4b5563;
		color: #d1d5db;
	}
	
	.input-with-icon-mobile,
	.input-with-unit-mobile,
	.slider-container,
	.zone-stat-mobile,
	.option-item-mobile,
	.day-item-mobile,
	.modal-action {
		background: #111827;
		border-color: #374151;
	}
	
	.input-icon,
	.unit {
		background: #374151;
		color: #d1d5db;
		border-color: #4b5563;
	}
	
	.input-field-mobile,
	.input-with-unit-mobile input,
	.time-range-mobile input {
		color: #f3f4f6;
		background: transparent;
	}
	
	.action-button-mobile.secondary {
		background: #374151;
		border-color: #4b5563;
		color: #f3f4f6;
	}
	
	.calculator-mobile {
		background: #1e3a8a;
		border-color: #3b82f6;
	}
	
	.calculator-mobile h4 {
		color: #93c5fd;
	}
	
	.range-slider {
		background: #4b5563;
	}
	
	.range-slider::-webkit-slider-thumb {
		background: #3b82f6;
		border-color: #1f2937;
	}
}
</style>