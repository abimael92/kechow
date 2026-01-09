<template>
    <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4 lg:p-8 space-y-6">
        <div>
            <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">{{ $t('settings') }}</h1>
            <p class="text-neutral-500 dark:text-neutral-400 font-normal text-lg mt-1">
                {{ $t('manageRestaurantSettings') }}
            </p>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
            <div class="lg:w-1/4">
                <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-2">
                    <nav class="space-y-1">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                            :class="[
                                'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all cursor-pointer',
                                activeTab === tab.id
                                    ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800',
                            ]">
                            <i :class="[tab.icon, 'mr-3 w-5 h-5 flex items-center justify-center']"></i>
                            {{ $t(tab.label) }}
                        </button>
                    </nav>
                </div>
            </div>

            <div class="lg:w-3/4">
                <div class="space-y-6">
                    <component :is="activeComponent" />
                </div>

                <div class="flex justify-end space-x-4 mt-6">
                    <button class="px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                        {{ $t('cancel') }}
                    </button>
                    <button class="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium shadow-button transition-all cursor-pointer">
                        {{ $t('saveChanges') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';

const activeTab = ref('general');

const tabs = [
	{ id: 'general', label: 'general', icon: 'ri-settings-line', component: 'GeneralSettings' },
	{ id: 'menu', label: 'menuSettings', icon: 'ri-restaurant-line', component: 'MenuSettings' },
	{ id: 'delivery', label: 'delivery', icon: 'ri-truck-line', component: 'DeliverySettings' },
	{ id: 'notifications', label: 'notifications', icon: 'ri-notification-line', component: 'NotificationSettings' },
	{ id: 'payments', label: 'payments', icon: 'ri-money-dollar-circle-line', component: 'PaymentSettings' },
	{ id: 'staff', label: 'staff', icon: 'ri-team-line', component: 'StaffSettings' },
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
</script>