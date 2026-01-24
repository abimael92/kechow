<template>
	<div class="settings-layout space-y-6">
        <!-- Header -->
        <div class="header-section space-y-2">
            <div class="flex items-center gap-3">
                <div class="settings-icon-container">
                    <i class="ri-settings-3-line settings-icon"></i>
                </div>
                <div>
                    <h1 class="settings-title">
                        {{ t('settings') }}
                    </h1>
                    <p class="settings-subtitle">
                        {{ t('manageTrackOrders') }}
                    </p>
                    <p class="settings-description">
                        {{ t('manageRestaurantSettings') }}
                    </p>
                </div>
            </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Sidebar Navigation -->
            <div class="lg:w-1/4">
                <div class="sidebar-container">
                    <nav class="sidebar-nav">
                        <button 
                            v-for="tab in tabs" 
                            :key="tab.id" 
                            @click="activeTab = tab.id"
                            :class="[
                                'tab-button',
                                activeTab === tab.id
                                    ? 'tab-button-active'
                                    : 'tab-button-inactive',
                            ]"
                            :aria-label="t(tab.label)"
                            :aria-selected="activeTab === tab.id"
                        >
                            <!-- Active indicator -->
                            <div 
                                v-if="activeTab === tab.id" 
                                class="tab-indicator"
                            ></div>
                            
                            <i :class="[
                                tab.icon, 
                                'tab-icon',
                                activeTab === tab.id 
                                    ? 'tab-icon-active' 
                                    : 'tab-icon-inactive'
                            ]"></i>
                            
                            <span class="tab-label">
                                {{ t(tab.label) }}
                            </span>
                            
                            <i 
                                v-if="activeTab !== tab.id" 
                                class="ri-arrow-right-s-line tab-arrow"
                            ></i>
                        </button>
                    </nav>
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="lg:w-3/4">
                <div class="main-content-area">
                    <!-- Content Card -->
                    <div class="content-card">
                        <component :is="activeComponent" />
                    </div>

                    <!-- Action Buttons -->
                    <div class="action-bar">
                        <div class="action-bar-content">
                            <div class="action-info">
                                <div class="action-icon-container">
                                    <i class="ri-save-line action-icon"></i>
                                </div>
                                <div>
                                    <p class="action-title">
                                        {{ t('businessSettings.saveChangesTitle') }}
                                    </p>
                                    <p class="action-description">
                                        {{ t('businessSettings.saveChangesDescription') }}
                                    </p>
                                </div>
                            </div>
                            
                            <div class="action-buttons">
                                <button 
                                    @click="cancelChanges" 
                                    class="cancel-button"
                                    :aria-label="t('cancel')"
                                >
                                    {{ t('cancel') }}
                                </button>
                                
                                <button 
                                    @click="saveChanges" 
                                    class="save-button"
                                    :aria-label="t('saveChanges')"
                                >
                                    <i class="ri-save-line"></i>
                                    {{ t('saveChanges') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const activeTab = ref('general');

const tabs = [
    { 
        id: 'general', 
        label: 'general', 
        icon: 'ri-settings-3-line', 
        component: 'GeneralSettings' 
    },
    { 
        id: 'menu', 
        label: 'menuSettings', 
        icon: 'ri-restaurant-line', 
        component: 'MenuSettings' 
    },
    { 
        id: 'delivery', 
        label: 'delivery', 
        icon: 'ri-truck-line', 
        component: 'DeliverySettings' 
    },
    { 
        id: 'notifications', 
        label: 'notifications', 
        icon: 'ri-notification-3-line', 
        component: 'NotificationSettings' 
    },
    { 
        id: 'payments', 
        label: 'payments', 
        icon: 'ri-bank-card-line', 
        component: 'PaymentSettings' 
    },
    { 
        id: 'staff', 
        label: 'staff', 
        icon: 'ri-group-line', 
        component: 'StaffSettings' 
    },
];

const components = {
    GeneralSettings: defineAsyncComponent(() => import('../components/settings/GeneralSettings.vue')),
    MenuSettings: defineAsyncComponent(() => import('../components/settings/MenuSettings.vue')),
    DeliverySettings: defineAsyncComponent(() => import('../components/settings/DeliverySettings.vue')),
    NotificationSettings: defineAsyncComponent(() => import('../components/settings/NotificationSettings.vue')),
    PaymentSettings: defineAsyncComponent(() => import('../components/settings/PaymentSettings.vue')),
    StaffSettings: defineAsyncComponent(() => import('../components/settings/StaffSettings.vue')),
};

const activeComponent = computed(() => {
    const tab = tabs.find(t => t.id === activeTab.value);
    return tab ? components[tab.component as keyof typeof components] : components.GeneralSettings;
});

function saveChanges() {
    console.log('Saving changes...');
    // Add save logic here
    // Emit save event if needed
}

function cancelChanges() {
    console.log('Cancelling changes...');
    // Add cancel logic here
    // Emit cancel event if needed
}
</script>

<style scoped>
/* Base styles */
.settings-layout {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 1.5rem;
}

@media (prefers-color-scheme: dark) {
    .settings-layout {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    }
}

/* Header Section */
.header-section {
    padding: 0.5rem 0;
}

.settings-icon-container {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 1rem;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.settings-icon {
    font-size: 1.5rem;
    color: white;
}

.settings-title {
    font-size: 3rem;
    font-weight: 800;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
    line-height: 1;
    text-shadow: 0 2px 4px rgba(30, 41, 59, 0.1);
}

@media (prefers-color-scheme: dark) {
    .settings-title {
        color: #f1f5f9;
        text-shadow: 0 2px 4px rgba(241, 245, 249, 0.1);
    }
}

.settings-subtitle {
    color: #475569;
    font-size: 1.25rem;
    font-weight: 400;
    margin: 0 0 0.25rem 0;
    user-select: none;
}

@media (prefers-color-scheme: dark) {
    .settings-subtitle {
        color: #cbd5e1;
    }
}

.settings-description {
    margin-left: 0.5rem;
    color: #4f46e5;
    font-weight: 500;
}

@media (prefers-color-scheme: dark) {
    .settings-description {
        color: #818cf8;
    }
}

/* Sidebar Navigation */
.sidebar-container {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    padding: 0.25rem;
}

@media (prefers-color-scheme: dark) {
    .sidebar-container {
        background: #1e293b;
        border-color: #334155;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }
}

.sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.tab-button {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.75rem;
    transition: all 0.2s ease;
    cursor: pointer;
    border: 1px solid transparent;
    text-align: left;
}

.tab-button:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

.tab-button-active {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border-color: #3b82f6;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

@media (prefers-color-scheme: dark) {
    .tab-button-active {
        background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
        border-color: #1e40af;
    }
}

.tab-button-inactive {
    color: #475569;
    background: transparent;
}

.tab-button-inactive:hover {
    background: rgba(59, 130, 246, 0.08);
    color: #3b82f6;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

@media (prefers-color-scheme: dark) {
    .tab-button-inactive {
        color: #cbd5e1;
    }
    
    .tab-button-inactive:hover {
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
    }
}

.tab-indicator {
    position: absolute;
    left: -0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0.25rem;
    height: 2rem;
    background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
    border-radius: 0.125rem;
}

.tab-icon {
    margin-right: 0.75rem;
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
}

.tab-button:hover .tab-icon {
    transform: scale(1.1);
}

.tab-icon-active {
    color: white;
}

.tab-icon-inactive {
    color: #64748b;
}

.tab-button-inactive:hover .tab-icon-inactive {
    color: #3b82f6;
}

@media (prefers-color-scheme: dark) {
    .tab-icon-inactive {
        color: #94a3b8;
    }
    
    .tab-button-inactive:hover .tab-icon-inactive {
        color: #60a5fa;
    }
}

.tab-label {
    font-weight: 500;
    flex: 1;
}

.tab-arrow {
    margin-left: auto;
    color: #94a3b8;
    transition: color 0.2s ease;
}

.tab-button-inactive:hover .tab-arrow {
    color: #3b82f6;
}

@media (prefers-color-scheme: dark) {
    .tab-arrow {
        color: #475569;
    }
    
    .tab-button-inactive:hover .tab-arrow {
        color: #60a5fa;
    }
}

/* Main Content Area */
.main-content-area {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.content-card {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    padding: 1.5rem;
}

@media (min-width: 1024px) {
    .content-card {
        padding: 2rem;
    }
}

@media (prefers-color-scheme: dark) {
    .content-card {
        background: #1e293b;
        border-color: #334155;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }
}

/* Action Bar */
.action-bar {
    position: sticky;
    bottom: 1.5rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.15);
    border: 1px solid #e2e8f0;
    padding: 1.5rem;
    margin-top: auto;
}

@media (prefers-color-scheme: dark) {
    .action-bar {
        background: #1e293b;
        border-color: #334155;
        box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.4);
    }
}

.action-bar-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

@media (min-width: 640px) {
    .action-bar-content {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
}

.action-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.action-icon-container {
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.action-icon {
    font-size: 0.875rem;
    color: white;
}

.action-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;
    margin: 0 0 0.125rem 0;
}

@media (prefers-color-scheme: dark) {
    .action-title {
        color: #f1f5f9;
    }
}

.action-description {
    font-size: 0.75rem;
    color: #64748b;
    margin: 0;
}

@media (prefers-color-scheme: dark) {
    .action-description {
        color: #94a3b8;
    }
}

.action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.cancel-button {
    padding: 0.625rem 1.5rem;
    border: 1px solid #3b82f6;
    background: transparent;
    color: #3b82f6;
    border-radius: 0.75rem;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cancel-button:hover {
    background: rgba(59, 130, 246, 0.08);
    border-color: #2563eb;
    color: #2563eb;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

@media (prefers-color-scheme: dark) {
    .cancel-button {
        border-color: #60a5fa;
        color: #60a5fa;
    }
    
    .cancel-button:hover {
        background: rgba(96, 165, 250, 0.2);
        border-color: #93c5fd;
        color: #93c5fd;
    }
}

.save-button {
    padding: 0.625rem 1.5rem;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

.save-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px -2px rgba(59, 130, 246, 0.4);
}

.save-button:active {
    transform: translateY(0);
}

.save-button i {
    font-size: 0.875rem;
}

/* Animation for tab switching */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .settings-layout {
        padding: 1rem;
    }
    
    .settings-title {
        font-size: 2.25rem;
    }
    
    .settings-subtitle {
        font-size: 1.125rem;
    }
    
    .header-section {
        flex-direction: column;
        text-align: center;
    }
    
    .settings-icon-container {
        align-self: center;
    }
    
    .action-bar-content {
        flex-direction: column;
        text-align: center;
    }
    
    .action-info {
        flex-direction: column;
        text-align: center;
    }
    
    .action-buttons {
        justify-content: center;
        width: 100%;
    }
    
    .cancel-button,
    .save-button {
        flex: 1;
        min-width: 140px;
    }
}

@media (max-width: 480px) {
    .settings-title {
        font-size: 1.875rem;
    }
    
    .settings-subtitle {
        font-size: 1rem;
    }
    
    .content-card {
        padding: 1rem;
    }
    
    .action-bar {
        padding: 1rem;
    }
    
    .action-buttons {
        flex-direction: column;
        width: 100%;
    }
    
    .cancel-button,
    .save-button {
        width: 100%;
    }
}

/* Accessibility improvements */
.tab-button:focus-visible,
.cancel-button:focus-visible,
.save-button:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

/* Loading state for async components */
.content-card :deep(*) {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Print styles */
@media print {
    .sidebar-container,
    .action-bar {
        display: none;
    }
    
    .content-card {
        box-shadow: none;
        border: 1px solid #e2e8f0;
    }
    
    .settings-layout {
        background: white;
        padding: 0;
    }
}
</style>