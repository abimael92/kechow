<template>
    <div class="min-h-screen bg-gradient-to-br from-background-dim-purple to-background-dim-purple/80 dark:from-background-dim-purple-dark dark:to-neutral-900 p-4 lg:p-8 space-y-8">
        <!-- Header - FIXED for better contrast -->
        <div class="space-y-2">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30">
                    <i class="ri-settings-3-line text-white text-lg"></i>
                </div>
                <div>
                    <!-- FIXED: Simpler, more readable purple -->
                 <h1 class="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
    {{ $t('settings') }}
</h1>
                    <!-- FIXED: Better contrast for subtitle -->
                    <p class="text-neutral-800 dark:text-neutral-200 font-normal text-lg">
                        {{ $t('manageRestaurantSettings') }}
                    </p>
                </div>
            </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Sidebar Navigation - FIXED for better visibility -->
            <div class="lg:w-1/4">
                <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-medium border border-neutral-200 dark:border-neutral-800 p-1">
                    <nav class="space-y-1">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                            :class="[
                                'group relative w-full flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer',
                              activeTab === tab.id
							    ? 'bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-800 dark:to-primary-700 text-white dark:text-white border border-primary-500 dark:border-primary-600 shadow-sm'
							    : 'text-neutral-700 dark:text-neutral-300 hover:bg-primary-50/80 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 hover:shadow-sm',
                            ]">
                            <!-- Active indicator - FIXED for better visibility -->
                            <div v-if="activeTab === tab.id" class="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-400 rounded-full"></div>
                            
                            <i :class="[tab.icon, 'mr-3 w-5 h-5 flex items-center justify-center transition-transform group-hover:scale-110', 
                                activeTab === tab.id ? 'text-primary-600' : 'text-neutral-500 group-hover:text-primary-600 dark:group-hover:text-primary-400']"></i>
                            
                            <span class="font-medium">{{ $t(tab.label) }}</span>
                            
                            <!-- FIXED: Hover arrow color -->
                            <i v-if="activeTab !== tab.id" class="ri-arrow-right-s-line ml-auto text-neutral-400 dark:text-neutral-600 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors"></i>
                        </button>
                    </nav>
                </div>
            </div>

            <!-- Main Content Area - FIXED card backgrounds -->
            <div class="lg:w-3/4">
                <div class="space-y-8">
                    <!-- Content Card - FIXED: Less transparency for better readability -->
                    <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-800 p-6 lg:p-8">
                        <component :is="activeComponent" />
                    </div>

                    <!-- Action Buttons - FIXED for better visibility -->
                    <div class="sticky bottom-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-strong border border-neutral-200 dark:border-neutral-800 p-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-sm">
                                    <i class="ri-save-line text-white text-sm"></i>
                                </div>
                                <div>
                                    <!-- FIXED: Better contrast text -->
                                    <p class="text-sm font-medium text-neutral-800 dark:text-neutral-200">Save your changes</p>
                                    <p class="text-xs text-neutral-600 dark:text-neutral-400">All modifications will be applied immediately</p>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-4">
                                <!-- FIXED: Cancel button with better contrast -->
                                <button @click="cancelChanges" 
                                    class="px-6 py-2.5 border border-primary-400 dark:border-primary-600 text-primary-700 dark:text-primary-400 rounded-xl font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-800 dark:hover:text-primary-300 transition-all duration-200 hover:shadow-sm cursor-pointer">
                                    {{ $t('cancel') }}
                                </button>
                                
                                <!-- FIXED: Save button with pink hover -->
                                <button @click="saveChanges" 
                                    class="group px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-medium shadow-button hover:shadow-button-hover transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                                    <i class="ri-save-line mr-2"></i>
                                    {{ $t('saveChanges') }}
                                    <!-- Removed white overlay for better pink visibility -->
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

const activeTab = ref('general');

const tabs = [
	{ id: 'general', label: 'general', icon: 'ri-settings-3-line', component: 'GeneralSettings' },
	{ id: 'menu', label: 'menuSettings', icon: 'ri-restaurant-line', component: 'MenuSettings' },
	{ id: 'delivery', label: 'delivery', icon: 'ri-truck-line', component: 'DeliverySettings' },
	{ id: 'notifications', label: 'notifications', icon: 'ri-notification-3-line', component: 'NotificationSettings' },
	{ id: 'payments', label: 'payments', icon: 'ri-bank-card-line', component: 'PaymentSettings' },
	{ id: 'staff', label: 'staff', icon: 'ri-group-line', component: 'StaffSettings' },
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
}

function cancelChanges() {
	console.log('Cancelling changes...');
	// Add cancel logic here
}
</script>

<style scoped>
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.component-transition {
    animation: slideIn 0.3s ease-out;
}
</style>