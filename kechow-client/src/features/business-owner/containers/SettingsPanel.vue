<template>
  <div class="delivery-settings-responsive">
    <!-- Enhanced Header -->
    <header class="settings-header">
      <div class="header-content">
        <div class="header-icon-title">
          <div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
            <i :class="[activeTab === 'general' ? 'ri-store-2-line' : 'ri-calendar-schedule-line', 'text-white text-lg sm:text-xl md:text-2xl']"></i>
          </div>
          <div class="header-text flex-1 min-w-0">
            <h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-2xl sm:text-3xl md:text-4xl leading-tight sm:leading-snug m-0 mb-1">
              {{ activeTab === 'general' ? 'Configuración general' : activeTab === 'times' ? 'Horarios' : 'Configuración de entrega' }}
            </h1>
            <p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base m-0">
              {{ activeTab === 'general' ? 'Información del restaurante' : activeTab === 'times' ? 'Horario y disponibilidad del restaurante' : 'Gestiona zonas, tarifas y horarios de entrega' }}
            </p>
          </div>
        </div>
        
        <div class="header-actions">
          <button
            @click="saveChanges"
            class="save-button"
            :disabled="saving || !hasChanges"
            :class="{ 'has-changes': hasChanges }"
          >
            <i class="ri-check-line"></i>
            <span class="button-text">{{ saving ? 'Guardando...' : 'Guardar' }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Responsive Navigation -->
    <nav class="settings-nav">
      <div class="nav-scroll-container">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['nav-tab', { active: activeTab === tab.id }]"
          :aria-label="tab.label"
        >
          <i :class="tab.icon"></i>
          <span class="tab-label">{{ tab.label }}</span>
          <div class="tab-indicator"></div>
        </button>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="settings-main">
      <!-- General + Horarios tabs share one GeneralSettings instance (info vs schedule) -->
      <transition name="fade-slide">
        <section
          v-if="activeTab === 'general' || activeTab === 'times'"
          class="tab-content"
          :class="activeTab === 'general' ? 'general-tab' : 'times-tab'"
        >
          <GeneralSettings
            ref="generalSettingsRef"
            :display-mode="activeTab === 'general' ? 'info' : 'schedule'"
            @change="hasChanges = true"
          />
        </section>
      </transition>

      <!-- Zones Tab (commented out) -->
      <!--
      <transition name="fade-slide">
        <section v-if="activeTab === 'zones'" class="tab-content zones-tab">
          <div class="content-card">
            <div class="card-header">
              <h2>
                <i class="ri-map-pin-2-line"></i>
                Zonas de entrega
              </h2>
              <button
                @click="openZoneManager"
                class="card-action-button"
              >
                <i class="ri-add-line"></i>
                <span>Agregar zona</span>
              </button>
            </div>

            <div class="zone-visualization">
              <div class="map-container">
                <div class="map-placeholder">
                  <div class="map-icon">
                    <i class="ri-map-2-line"></i>
                  </div>
                  <div class="map-info">
                    <h3>Radio de entrega configurado</h3>
                    <p>Los clientes dentro de esta área pueden recibir entregas</p>
                  </div>
                  <div class="radius-indicator">
                    <div class="radius-value">
                      {{ deliveryRadiusSlider }} km
                    </div>
                    <div class="radius-label">Radio actual</div>
                  </div>
                </div>
              </div>

              <div class="zone-controls">
                <div class="control-group">
                  <div class="control-header">
                    <label for="deliveryRadius">Radio de entrega</label>
                    <span class="current-value">{{ deliveryRadiusSlider }} km</span>
                  </div>
                  <div class="slider-wrapper">
                    <input
                      id="deliveryRadius"
                      v-model="deliveryRadiusSlider"
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      class="styled-slider"
                      @input="onDeliveryRadiusInput"
                    />
                    <div class="slider-marks">
                      <span>1km</span>
                      <span>10km</span>
                      <span>20km</span>
                    </div>
                  </div>
                </div>

                <div class="zone-stats-grid">
                  <div class="stat-card">
                    <div class="stat-icon">
                      <i class="ri-pin-distance-line"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">{{ deliveryRadiusSlider }} km</div>
                      <div class="stat-label">Radio máximo</div>
                    </div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-icon">
                      <i class="ri-money-dollar-circle-line"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">{{ formatCurrency(deliveryFee) }}</div>
                      <div class="stat-label">Tarifa base</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </transition>
      -->

      <!-- Pricing Tab (commented out) -->
      <!--
      <transition name="fade-slide">
        <section v-if="activeTab === 'pricing'" class="tab-content pricing-tab">
          <div class="content-card">
            <div class="card-header">
              <h2>
                <i class="ri-money-dollar-circle-line"></i>
                Precios y tarifas
              </h2>
              <div class="currency-selector">
                <label for="currency">Moneda:</label>
                <select
                  id="currency"
                  v-model="selectedCurrency"
                  class="styled-select"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="MXN">MXN ($)</option>
                </select>
              </div>
            </div>

            <div class="pricing-grid">
              <div class="pricing-controls">
                <div class="input-group">
                  <label for="deliveryFee">Tarifa de entrega</label>
                  <div class="input-with-prefix">
                    <span class="input-prefix">{{ currencySymbol }}</span>
                    <input
                      id="deliveryFee"
                      v-model.number="deliveryFee"
                      type="number"
                      min="0"
                      step="0.01"
                      @input="validateDeliveryFee"
                    />
                  </div>
                </div>

                <div class="input-group">
                  <label for="minimumOrder">Pedido mínimo</label>
                  <div class="input-with-prefix">
                    <span class="input-prefix">{{ currencySymbol }}</span>
                    <input
                      id="minimumOrder"
                      v-model.number="minimumOrder"
                      type="number"
                      min="0"
                      step="0.01"
                      @input="validateMinimumOrder"
                    />
                  </div>
                </div>

                <div class="input-group">
                  <label for="serviceFee">Tarifa de servicio</label>
                  <div class="input-with-prefix">
                    <span class="input-prefix">{{ currencySymbol }}</span>
                    <input
                      id="serviceFee"
                      v-model.number="serviceFee"
                      type="number"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div class="calculator-card">
                <h3>Calculadora de total</h3>
                <div class="calculator-list">
                  <div class="calculator-row">
                    <span>Subtotal del pedido</span>
                    <span>{{ formatCurrency(minimumOrder) }}</span>
                  </div>
                  <div class="calculator-row">
                    <span>Tarifa de entrega</span>
                    <span>{{ formatCurrency(deliveryFee) }}</span>
                  </div>
                  <div class="calculator-row">
                    <span>Tarifa de servicio</span>
                    <span>{{ formatCurrency(serviceFee) }}</span>
                  </div>
                  <div class="calculator-row">
                    <span>Impuestos ({{ taxRate }}%)</span>
                    <span>{{ formatCurrency(minimumOrder * (taxRate / 100)) }}</span>
                  </div>
                  <div class="calculator-row total">
                    <span>Total estimado</span>
                    <span>{{ formatCurrency(calculatedTotal) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </transition>
      -->

      <!-- Options Tab -->
      <transition name="fade-slide">
        <section v-if="activeTab === 'options'" class="tab-content options-tab">
          <div class="content-card">
            <div class="card-header">
              <h2>
                <i class="ri-list-settings-line"></i>
                Opciones de entrega
              </h2>
            </div>

            <div class="options-list">
              <div
                v-for="option in deliveryOptions"
                :key="option.id"
                class="option-item"
              >
                <div class="option-content">
                  <div class="option-icon">
                    <i :class="option.icon"></i>
                  </div>
                  <div class="option-details">
                    <h3>{{ option.title }}</h3>
                    <p>{{ option.description }}</p>
                  </div>
                </div>
                <label class="switch">
                  <input
                    v-model="option.enabled"
                    type="checkbox"
                    :disabled="option.disabled"
                  />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </section>
      </transition>

    </main>

    <!-- Floating Action Button (Mobile) -->
    <button
      v-if="hasChanges"
      @click="saveChanges"
      class="fab-mobile"
      :disabled="saving"
    >
      <i v-if="saving" class="ri-loader-4-line spin"></i>
      <i v-else class="ri-check-line"></i>
    </button>

    <!-- Global Actions -->
    <!-- <footer class="settings-footer">
      <button
        @click="resetToDefaults"
        class="footer-button secondary"
        :disabled="saving"
      >
        <i class="ri-restart-line"></i>
        Restablecer valores
      </button>
      <button
        @click="showQuickActions = true"
        class="footer-button primary"
      >
        <i class="ri-flashlight-line"></i>
        Acciones rápidas
      </button>
    </footer> -->

    <!-- Quick Actions Modal -->
    <!-- <transition name="modal">
      <div v-if="showQuickActions" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Acciones rápidas</h3>
            <button @click="showQuickActions = false" class="modal-close">
              <i class="ri-close-line"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="actions-grid">
              <button @click="testDeliveryCalculator" class="action-card">
                <div class="action-icon">
                  <i class="ri-calculator-line"></i>
                </div>
                <div class="action-content">
                  <h4>Probar calculadora</h4>
                  <p>Verifica los cálculos con valores actuales</p>
                </div>
              </button>
              <button @click="viewDeliveryAnalytics" class="action-card">
                <div class="action-icon">
                  <i class="ri-bar-chart-2-line"></i>
                </div>
                <div class="action-content">
                  <h4>Ver analíticas</h4>
                  <p>Métricas de entregas recientes</p>
                </div>
              </button>
              <button @click="exportSettings" class="action-card">
                <div class="action-icon">
                  <i class="ri-download-line"></i>
                </div>
                <div class="action-content">
                  <h4>Exportar</h4>
                  <p>Guardar configuración actual</p>
                </div>
              </button>
              <button @click="copySettings" class="action-card">
                <div class="action-icon">
                  <i class="ri-file-copy-line"></i>
                </div>
                <div class="action-content">
                  <h4>Copiar valores</h4>
                  <p>Copiar al portapapeles</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import GeneralSettings from '@/features/business-owner/components/settings/GeneralSettings.vue';

const toast = useToast();

// Refs
const generalSettingsRef = ref<InstanceType<typeof GeneralSettings> | null>(null);

// State
const deliveryRadius = ref(5);
const deliveryRadiusSlider = ref(5);
const deliveryFee = ref(3.99);
const minimumOrder = ref(15.00);
const serviceFee = ref(0.99);
const taxRate = ref(8.5);
const averageDeliveryTime = ref(30);
const selectedCurrency = ref('USD');
const saving = ref(false);
const hasChanges = ref(false);
const activeTab = ref('general');
const showQuickActions = ref(false);

// Tabs configuration
const tabs = [
  { id: 'general', label: 'General', icon: 'ri-store-2-line' },
  // { id: 'zones', label: 'Zonas', icon: 'ri-map-pin-2-line' },
  // { id: 'pricing', label: 'Tarifas', icon: 'ri-money-dollar-circle-line' },
  { id: 'times', label: 'Horarios', icon: 'ri-time-line' },
  { id: 'options', label: 'Opciones', icon: 'ri-list-settings-line' },
];

// Data
const deliveryDays = ref([
  { id: 0, name: 'Lunes', enabled: true, startTime: '10:00', endTime: '22:00' },
  { id: 1, name: 'Martes', enabled: true, startTime: '10:00', endTime: '22:00' },
  { id: 2, name: 'Miércoles', enabled: true, startTime: '10:00', endTime: '22:00' },
  { id: 3, name: 'Jueves', enabled: true, startTime: '10:00', endTime: '22:00' },
  { id: 4, name: 'Viernes', enabled: true, startTime: '10:00', endTime: '23:00' },
  { id: 5, name: 'Sábado', enabled: true, startTime: '11:00', endTime: '23:00' },
  { id: 6, name: 'Domingo', enabled: true, startTime: '12:00', endTime: '21:00' },
]);

const deliveryOptions = ref([
  {
    id: 'pickup',
    title: 'Recoger en local',
    description: 'Permitir que los clientes recojan su pedido',
    icon: 'ri-store-2-line',
    enabled: true,
    disabled: false,
  },
  {
    id: 'delivery',
    title: 'Entrega a domicilio',
    description: 'Ofrecer servicio de entrega a domicilio',
    icon: 'ri-truck-line',
    enabled: true,
    disabled: false,
  },
  {
    id: 'express',
    title: 'Entrega express',
    description: 'Entrega prioritaria con tiempo reducido',
    icon: 'ri-flashlight-line',
    enabled: false,
    disabled: false,
  },
  {
    id: 'schedule',
    title: 'Entrega programada',
    description: 'Permitir programar entregas futuras',
    icon: 'ri-calendar-line',
    enabled: true,
    disabled: false,
  },
]);

// Computed
const currencySymbol = computed(() => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    MXN: '$',
  };
  return symbols[selectedCurrency.value] || '$';
});

const calculatedTotal = computed(() => {
  const subtotal = parseFloat(minimumOrder.value.toString());
  const fee = parseFloat(deliveryFee.value.toString());
  const service = parseFloat(serviceFee.value.toString());
  const tax = subtotal * (taxRate.value / 100);
  return subtotal + fee + service + tax;
});

// Methods
const formatCurrency = (value: number) => {
  return `${currencySymbol.value}${value.toFixed(2)}`;
};

const onDeliveryRadiusInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const val = parseInt(input.value);
  deliveryRadiusSlider.value = val;
  deliveryRadius.value = val;
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

const openZoneManager = () => {
  alert('Funcionalidad de gestión de zonas - Próximamente');
};

const resetToDefaults = () => {
  if (confirm('¿Restablecer todos los valores a los predeterminados?')) {
    deliveryRadius.value = 5;
    deliveryRadiusSlider.value = 5;
    deliveryFee.value = 3.99;
    minimumOrder.value = 15.00;
    serviceFee.value = 0.99;
    averageDeliveryTime.value = 30;
    selectedCurrency.value = 'USD';
    hasChanges.value = false;
  }
};

const saveChanges = async () => {
  saving.value = true;
  try {
    if ((activeTab.value === 'general' || activeTab.value === 'times') && generalSettingsRef.value) {
      await generalSettingsRef.value.save();
    } else {
      await new Promise(resolve => setTimeout(resolve, 1200));
    }
    hasChanges.value = false;
    toast.success('Configuración guardada correctamente');
    const saveBtn = document.querySelector('.save-button');
    if (saveBtn) {
      saveBtn.classList.add('save-success');
      setTimeout(() => saveBtn.classList.remove('save-success'), 2000);
    }
  } catch (error) {
    console.error('Error saving:', error);
    const msg = (err: unknown) => {
      const e = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } }; message?: string };
      if (e?.response?.data?.message) return e.response.data.message;
      const errs = e?.response?.data?.errors;
      if (errs && typeof errs === 'object') {
        const first = Object.values(errs).flat()[0];
        if (first) return first;
      }
      return e?.message || 'Error al guardar. Intenta de nuevo.';
    };
    toast.error(msg(error));
  } finally {
    saving.value = false;
  }
};

const testDeliveryCalculator = () => {
  alert(`Calculadora de prueba:\n\nSubtotal: ${formatCurrency(minimumOrder.value)}\nEntrega: ${formatCurrency(deliveryFee.value)}\nServicio: ${formatCurrency(serviceFee.value)}\nImpuestos: ${formatCurrency(minimumOrder.value * (taxRate.value / 100))}\n\nTotal: ${formatCurrency(calculatedTotal.value)}`);
  showQuickActions.value = false;
};

const viewDeliveryAnalytics = () => {
  alert('Redirigiendo a analíticas...');
  showQuickActions.value = false;
};

const exportSettings = () => {
  const settings = {
    deliveryRadius: deliveryRadius.value,
    deliveryFee: deliveryFee.value,
    minimumOrder: minimumOrder.value,
    serviceFee: serviceFee.value,
    currency: selectedCurrency.value,
    averageDeliveryTime: averageDeliveryTime.value,
  };
  console.log('Exporting settings:', settings);
  alert('Configuración exportada (ver consola)');
  showQuickActions.value = false;
};

const copySettings = () => {
  const settingsText = `
Configuración de Entrega:
• Radio: ${deliveryRadius.value}km
• Tarifa entrega: ${formatCurrency(deliveryFee.value)}
• Pedido mínimo: ${formatCurrency(minimumOrder.value)}
• Moneda: ${selectedCurrency.value}
  `.trim();
  
  navigator.clipboard.writeText(settingsText);
  alert('Configuración copiada al portapapeles');
  showQuickActions.value = false;
};

// Watch for changes
watch([deliveryRadius, deliveryFee, minimumOrder, serviceFee, averageDeliveryTime], () => {
  hasChanges.value = true;
}, { deep: true });

onMounted(() => {
  // Load any saved settings here
});
</script>

<style scoped>
/* Reset and Base Styles */
.delivery-settings-responsive {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.settings-header {
  background: var(--color-card);
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.header-icon-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.header-text {
  flex: 1;
}

.text-bubble {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
}

/* Save Button */
.save-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.save-button.has-changes:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
}

.save-button.save-success {
  background: linear-gradient(135deg, #059669, #047857);
  animation: pulse 1.5s ease;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Navigation */
.settings-nav {
  background: var(--color-card);
  border: 1px solid #fe7f24;
  position: sticky;
  top: 88px;
  z-index: 90;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  margin: 2rem 0 2rem 0;
  border-radius: 12px;
}

.settings-nav::-webkit-scrollbar {
  display: none;
}

.nav-scroll-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  gap: 0.5rem;
}

.nav-tab {
  flex: 1;
  min-width: 100px;
  padding: 1rem 0;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-tab:hover {
  color: #3b82f6;
}

.nav-tab.active {
  color: #3b82f6;
}

.nav-tab.active .tab-indicator {
  opacity: 1;
  transform: scaleX(1);
}

.tab-indicator {
  position: absolute;
  bottom: -1px;
  left: 8px;
  right: 8px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 3px 3px 0 0;
  opacity: 0;
  transform: scaleX(0.8);
  transition: all 0.3s ease;
}

.nav-tab i {
  font-size: 1.25rem;
}

/* Main Content */
.settings-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
}

/* Content Card */
.content-card {
  background: var(--color-card);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #f3f4f6;
  margin-bottom: 1.5rem;
  animation: cardAppear 0.4s ease;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-action-button {
  padding: 0.5rem 1rem;
  background: #FFEDD5;
  color: #374151;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.card-action-button:hover {
  background: #e5e7eb;
}

/* Zones Tab */
.zone-visualization {
  display: grid;
  gap: 2rem;
}

.map-container {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border-radius: 16px;
  padding: 2rem;
  border: 2px dashed #bae6fd;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.map-icon {
  width: 80px;
  height: 80px;
  background: var(--color-card);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.map-icon i {
  font-size: 2.5rem;
  color: #3b82f6;
}

.map-info h3 {
  margin: 0.5rem 0;
  color: #1e40af;
}

.map-info p {
  color: #6b7280;
  margin: 0;
}

.radius-indicator {
  margin-top: 1rem;
}

.radius-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1d4ed8;
  line-height: 1;
}

.radius-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Slider Styles */
.control-group {
  background: var(--color-app-bg);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.control-header label {
  font-weight: 600;
  color: #374151;
}

.current-value {
  font-weight: 700;
  color: #3b82f6;
  font-size: 1.125rem;
}

.slider-wrapper {
  position: relative;
  padding: 0.5rem 0;
}

.styled-slider {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(to right, #dbeafe, #93c5fd, #3b82f6);
  border-radius: 4px;
  outline: none;
}

.styled-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-card);
  border: 3px solid #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
  transition: all 0.2s ease;
}

.styled-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
}

.slider-marks {
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
}

/* Zone Stats */
.zone-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat-card {
  background: var(--color-card);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f0f9ff, #dbeafe);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 1.25rem;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Pricing Tab */
.pricing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.pricing-controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.currency-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.styled-select {
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: var(--color-card);
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.input-with-prefix {
  display: flex;
  align-items: center;
  background: var(--color-card);
  border: 1px solid #d1d5db;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.input-with-prefix:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-prefix {
  padding: 0.75rem;
  background: var(--color-app-bg);
  color: #6b7280;
  font-weight: 500;
  border-right: 1px solid #e5e7eb;
}

.input-with-prefix input {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  color: #1f2937;
  font-size: 1rem;
  outline: none;
  width: 100%;
}

.input-with-prefix input::-webkit-inner-spin-button,
.input-with-prefix input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Calculator */
.calculator-card {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border: 1px solid #dbeafe;
  border-radius: 16px;
  padding: 1.5rem;
}

.calculator-card h3 {
  margin: 0 0 1rem 0;
  color: #1e40af;
  font-size: 1rem;
}

.calculator-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.calculator-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(219, 234, 254, 0.5);
}

.calculator-row.total {
  padding-top: 0.75rem;
  border-top: 2px solid #dbeafe;
  border-bottom: none;
  font-weight: 700;
  color: #1e40af;
  font-size: 1.125rem;
}

/* Options Tab */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--color-app-bg);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.option-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.option-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f0f9ff, #dbeafe);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 1.125rem;
}

.option-details h3 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.option-details p {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
}

/* Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
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
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background: linear-gradient(135deg, #10b981, #059669);
}

input:checked + .slider:before {
  transform: translateX(24px);
}

/* Times Tab */
.time-controls {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.average-time-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.time-input-wrapper {
  display: flex;
  align-items: center;
  background: var(--color-card);
  border: 1px solid #d1d5db;
  border-radius: 12px;
  overflow: hidden;
  max-width: 200px;
}

.time-input-wrapper input {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  color: #1f2937;
  font-size: 1rem;
  outline: none;
}

.time-unit {
  padding: 0.75rem;
  background: var(--color-app-bg);
  color: #6b7280;
  font-weight: 500;
  border-left: 1px solid #e5e7eb;
}

/* Delivery Hours */
.delivery-hours h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1rem;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.day-card {
  background: var(--color-app-bg);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.day-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.day-card.disabled {
  opacity: 0.6;
}

.day-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.day-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.day-toggle input {
  display: none;
}

.day-name {
  font-weight: 600;
  color: #374151;
  position: relative;
}

.day-toggle input:checked + .day-name::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 2px;
  background: #10b981;
  border-radius: 1px;
}

.day-times {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.5rem;
  align-items: end;
}

.time-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.time-input-group label {
  font-size: 0.75rem;
  color: #6b7280;
}

.time-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: var(--color-card);
  color: #1f2937;
  font-size: 0.875rem;
  width: 100%;
}

.time-separator {
  display: flex;
  align-items: center;
  padding-bottom: 0.5rem;
  color: #6b7280;
}

.day-closed {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fef2f2;
  border-radius: 8px;
  color: #dc2626;
}

.day-closed i {
  font-size: 1.125rem;
}

/* Footer */
.settings-footer {
  max-width: 1200px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.footer-button {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.footer-button.primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.footer-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
}

.footer-button.secondary {
  background: var(--color-card);
  border-color: #d1d5db;
  color: #374151;
}

.footer-button.secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

/* FAB Mobile */
.fab-mobile {
  display: none;
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.fab-mobile:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(16, 185, 129, 0.6);
}

.fab-mobile:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: var(--color-card);
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
}

.modal-close {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  background: var(--color-card);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #FFEDD5;
  border-color: #d1d5db;
}

.modal-body {
  padding: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-card {
  padding: 1rem;
  background: var(--color-app-bg);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  border: none;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background: var(--color-card);
}

.action-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f0f9ff, #dbeafe);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  color: #3b82f6;
  font-size: 1.25rem;
}

.action-content h4 {
  margin: 0 0 0.25rem 0;
  color: #1f2937;
  font-size: 0.875rem;
}

.action-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.75rem;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .settings-header {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .header-icon-title {
    gap: 0.75rem;
  }
  
  .header-icon-wrapper {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
  
  .main-title {
    font-size: 1.5rem;
  }
  
  .nav-scroll-container {
    padding: 0 1rem;
    gap: 0.25rem;
  }
  
  .nav-tab {
    min-width: 80px;
    padding: 0.75rem 0;
    font-size: 0.75rem;
  }
  
  .nav-tab i {
    font-size: 1rem;
  }
  
  .settings-main {
    padding: 1rem;
  }
  
  .content-card {
    padding: 1rem;
    border-radius: 16px;
  }
  
  .zone-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .days-grid {
    grid-template-columns: 1fr;
  }
  
  .settings-footer {
    flex-direction: column;
    padding: 0 1rem;
  }
  
  .fab-mobile {
    display: flex;
  }
  
  .map-container {
    padding: 1rem;
  }
  
  .map-icon {
    width: 60px;
    height: 60px;
  }
  
  .map-icon i {
    font-size: 2rem;
  }
  
  .radius-value {
    font-size: 1.5rem;
  }
  
  .stat-card {
    padding: 0.75rem;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .currency-selector {
    justify-content: space-between;
  }
  
  .time-input-wrapper {
    max-width: 100%;
  }
  
  .day-times {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .time-separator {
    display: none;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  
  .settings-header,
  .content-card,
  .modal-container {
    border-color: #334155;
  }
  
  .main-title {
    color: #f1f5f9;
  }
  
  .subtitle {
    color: #94a3b8;
  }
  
  .header-icon-wrapper {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
  }
  
  .card-header h2 {
    color: #f8fafc;
  }
  
  .card-action-button {
    background: #334155;
    color: #cbd5e1;
  }
  
  .card-action-button:hover {
    background: #475569;
  }
  
  .map-container {
    background: linear-gradient(135deg, #1e3a8a, #1e40af);
    border-color: #3b82f6;
  }
  
  .map-info h3 {
    color: #dbeafe;
  }
  
  .map-info p {
    color: #93c5fd;
  }
  
  .control-group {
    background: #1e293b;
    border-color: #334155;
  }
  
  .control-header label {
    color: #e2e8f0;
  }
  
  .stat-card {
    background: #1e293b;
    border-color: #334155;
  }
  
  .stat-value {
    color: #f1f5f9;
  }
  
  .stat-icon {
    background: linear-gradient(135deg, #1e3a8a, #1e40af);
    color: #93c5fd;
  }
  
  .input-with-prefix {
    background: #1e293b;
    border-color: #475569;
  }
  
  .input-prefix {
    background: #334155;
    color: #94a3b8;
    border-color: #475569;
  }
  
  .input-with-prefix input {
    color: #f1f5f9;
  }
  
  .calculator-card {
    background: linear-gradient(135deg, #1e3a8a, #1e40af);
    border-color: #3b82f6;
  }
  
  .calculator-card h3 {
    color: #dbeafe;
  }
  
  .calculator-row.total {
    color: #dbeafe;
    border-color: rgba(219, 234, 254, 0.3);
  }
  
  .option-item {
    background: #1e293b;
    border-color: #334155;
  }
  
  .option-icon {
    background: linear-gradient(135deg, #1e3a8a, #1e40af);
    color: #93c5fd;
  }
  
  .option-details h3 {
    color: #f1f5f9;
  }
  
  .day-card {
    background: #1e293b;
    border-color: #334155;
  }
  
  .day-name {
    color: #e2e8f0;
  }
  
  .time-input {
    background: #1e293b;
    border-color: #475569;
    color: #f1f5f9;
  }
  
  .day-closed {
    background: rgba(220, 38, 38, 0.1);
    color: #fca5a5;
  }
  
  .modal-header h3 {
    color: #f8fafc;
  }
  
  .modal-close {
    background: #334155;
    border-color: #475569;
    color: #cbd5e1;
  }
  
  .action-card {
    background: #1e293b;
    border-color: #334155;
  }
  
  .action-card:hover {
    background: #334155;
  }
  
  .action-icon {
    background: linear-gradient(135deg, #1e3a8a, #1e40af);
    color: #93c5fd;
  }
  
  .action-content h4 {
    color: #f1f5f9;
  }
  
  .footer-button.secondary {
    background: #334155;
    border-color: #475569;
    color: #cbd5e1;
  }
  
  .footer-button.secondary:hover {
    background: #475569;
  }
}
</style>