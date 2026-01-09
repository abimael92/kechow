<template>
    <div class="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-4 lg:p-8 space-y-8">
        <!-- Header -->
        <div class="space-y-2">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <i class="ri-settings-3-line text-white text-lg"></i>
                </div>
                <div>
                    <h1 class="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
                        {{ $t('settings') }}
                    </h1>
                    <p class="text-neutral-500 dark:text-neutral-400 font-normal text-lg">
                        {{ $t('manageRestaurantSettings') }}
                    </p>
                </div>
            </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Sidebar Navigation -->
            <div class="lg:w-1/4">
                <div class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg rounded-2xl shadow-soft border border-white/30 dark:border-neutral-700/30 p-1">
                    <nav class="space-y-1">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                            :class="[
                                'group relative w-full flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer',
                                activeTab === tab.id
                                    ? 'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-800/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 shadow-sm'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-white/50 dark:hover:bg-neutral-800/50 hover:shadow-sm',
                            ]">
                            <!-- Active indicator -->
                            <div v-if="activeTab === tab.id" class="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full"></div>
                            
                            <i :class="[tab.icon, 'mr-3 w-5 h-5 flex items-center justify-center transition-transform group-hover:scale-110', 
                                activeTab === tab.id ? 'text-orange-500' : 'text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300']"></i>
                            
                            <span class="font-medium">{{ $t(tab.label) }}</span>
                            
                            <!-- Hover arrow -->
                            <i v-if="activeTab !== tab.id" class="ri-arrow-right-s-line ml-auto text-neutral-300 dark:text-neutral-600 group-hover:text-orange-400 transition-colors"></i>
                        </button>
                    </nav>
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="lg:w-3/4">
                <div class="space-y-8">
                    <!-- Content Card -->
                    <div class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg rounded-2xl shadow-soft border border-white/30 dark:border-neutral-700/30 p-6 lg:p-8">
                        <component :is="activeComponent" />
                    </div>

                    <!-- Action Buttons -->
                    <div class="sticky bottom-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg rounded-2xl shadow-strong border border-white/30 dark:border-neutral-700/30 p-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center">
                                    <i class="ri-save-line text-white text-sm"></i>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-neutral-700 dark:text-neutral-300">Save your changes</p>
                                    <p class="text-xs text-neutral-500 dark:text-neutral-400">All modifications will be applied immediately</p>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-4">
                                <button @click="cancelChanges" 
                                    class="px-6 py-2.5 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200 hover:shadow-sm cursor-pointer">
                                    {{ $t('cancel') }}
                                </button>
                                <button @click="saveChanges" 
                                    class="relative group px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium shadow-button hover:shadow-button-hover transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                                    <i class="ri-save-line mr-2"></i>
                                    {{ $t('saveChanges') }}
                                    <!-- Animated effect on hover -->
                                    <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
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