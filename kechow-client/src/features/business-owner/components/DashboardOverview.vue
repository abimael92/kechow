<template>
    <div class="min-h-screen min-w-0 overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-secondary-600 to-secondary-500 flex items-center justify-center shadow-md shadow-primary-500/30">
                    <i class="ri-home-3-line text-white text-xl sm:text-2xl md:text-3xl"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h1 class="text-bubble text-3xl sm:text-4xl md:text-5xl lg:text-6xl shadow-primary-500 leading-tight sm:leading-snug">
                        {{ t('dashboard') }}
                    </h1>
                    <p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none line-clamp-2">
                        {{ t('subtitle') }}
                    </p>
                </div>
            </div>
            
            <!-- Desktop welcome message -->
            <div class="hidden sm:block text-right">
                <p class="text-neutral-600 dark:text-neutral-400 text-sm md:text-base">
                    {{ t('welcomeBack') }}, {{ authStore.user?.name || 'User' }}
                </p>
                <p class="text-neutral-500 dark:text-neutral-500 text-xs md:text-sm">
                    {{ t('lastLogin') }}: {{ formatLastLogin() }}
                </p>
            </div>
        </div>

        <!-- Stats Grid - Enhanced with Gradient Backgrounds -->
        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <div
                v-for="(stat, i) in stats"
                :key="i"
                class="group relative bg-white dark:bg-neutral-900 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-800 hover:shadow-medium transition-all duration-300 cursor-pointer overflow-hidden"
                @click="handleStatClick(stat.label)"
            >
                <!-- Animated Background Gradient -->
                <div class="absolute inset-0 bg-gradient-to-br from-transparent to-primary-50 dark:to-primary-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div class="relative flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="text-neutral-700 dark:text-neutral-300 text-xs font-medium truncate">
                            {{ stat.label }}
                        </p>
                        <p class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white mt-1 truncate">
                            {{ stat.value }}
                        </p>
                        <p class="flex items-center gap-1 text-xs mt-1 font-medium truncate"
                        :class="stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                            <i :class="stat.trend === 'up' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"></i>
                            {{ stat.change }}
                        </p>
                    </div>
                    <div
                        :class="stat.bg"
                        class="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 ml-2"
                    >
                        <div class="absolute inset-0 bg-white/20 rounded-lg sm:rounded-xl"></div>
                        <i :class="[stat.icon, 'text-base sm:text-lg md:text-xl relative z-10']"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Enhanced Tabs with Active Indicator - Responsive -->
        <div class="mb-4 sm:mb-6 md:mb-8">
            <div class="relative">
                <div class="border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto pb-1">
                    <div class="flex space-x-1 min-w-max px-1">
                        <button
                            v-for="(tab, i) in tabs"
                            :key="i"
                            @click="setActiveTab(i)"
                            :class="[
                                'relative px-3 py-2 sm:px-4 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer',
                                tab.active
                                    ? 'text-primary-700 dark:text-primary-400'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200',
                            ]"
                        >
                            {{ tab.label }}
                            <!-- Active Indicator -->
                            <div
                                v-if="tab.active"
                                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                            ></div>
                        </button>
                    </div>
                </div>
                
                <!-- Mobile tab indicator -->
                <div class="sm:hidden text-xs text-neutral-500 dark:text-neutral-400 mt-2 px-2">
                    {{ t('activeTab') }}: {{ tabs.find(t => t.active)?.label }}
                </div>
            </div>
        </div>

        <!-- Content Grid - Enhanced Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <!-- Recent Orders Card -->
            <div class="group bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-800 hover:shadow-medium transition-all duration-300 overflow-hidden">
                <div class="p-3 sm:p-4 md:p-6">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 md:mb-6 gap-2">
                        <h3 class="text-base sm:text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                            {{ t('recentOrders') }}
                        </h3>
                        <button class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-xs sm:text-sm font-medium flex items-center gap-1 cursor-pointer self-end sm:self-auto">
                            {{ t('viewAll') }}
                            <i class="ri-arrow-right-line text-sm"></i>
                        </button>
                    </div>
                    
                    <!-- Orders List - Mobile optimized -->
                    <div class="space-y-2 sm:space-y-3">
                        <div v-for="order in recentOrders" :key="order.id"
                             class="flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200">
                            <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <div :class="order.statusClass"
                                     class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0"></div>
                                <div class="min-w-0 flex-1">
                                    <p class="font-medium text-neutral-900 dark:text-white text-sm sm:text-base truncate">
                                        {{ t('orderNumber', { id: order.id }) }}
                                    </p>
                                    <p class="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                                        {{ order.time }} • {{ order.items }} {{ t('items') }}
                                    </p>
                                </div>
                            </div>
                            <div class="text-right flex-shrink-0 ml-2">
                                <p class="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base">
                                    {{ order.amount }}
                                </p>
                                <p :class="order.statusTextClass"
                                   class="text-xs font-medium truncate">
                                    {{ t(`${order.status.toLowerCase().replace(' ', '')}`) }}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Mobile show more indicator -->
                    <div class="sm:hidden text-center mt-3">
                        <p class="text-xs text-neutral-500 dark:text-neutral-400">
                            {{ t('swipeForMore') }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Weekly Revenue Card -->
            <div class="group bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-800 hover:shadow-medium transition-all duration-300 overflow-hidden">
                <div class="p-3 sm:p-4 md:p-6">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 md:mb-6 gap-2">
                        <h3 class="text-base sm:text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                            {{ t('weeklyRevenue') }}
                        </h3>
                        <div class="flex items-center gap-1 sm:gap-2 self-end sm:self-auto">
                            <button @click="setRevenuePeriod('week')" 
                                    :class="revenuePeriod === 'week' ? 'bg-primary-500 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'"
                                    class="px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer">
                                {{ t('week') }}
                            </button>
                            <button @click="setRevenuePeriod('month')"
                                    :class="revenuePeriod === 'month' ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'"
                                    class="px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer">
                                {{ t('month') }}
                            </button>
                        </div>
                    </div>
                    
                    <!-- Revenue Chart Placeholder -->
                    <div class="relative w-full h-32 sm:h-36 md:h-40 lg:h-48 flex items-center justify-center bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-900/20 dark:to-transparent rounded-lg sm:rounded-xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                        <div class="text-center px-2 gap-2">
                            <div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                                <i class="ri-bar-chart-line text-xl sm:text-2xl md:text-3xl text-primary-600 dark:text-primary-400"></i>
                            </div>
                            <p class="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm md:text-base font-medium">
                                {{ t('revenueChartPlaceholder') }}
                            </p>
                            <p class="text-xs text-neutral-500 dark:text-neutral-500 mt-3 sm:mt-4 md:mt-5">
                                {{ revenueData.total }}
                            </p>
                        </div>
                        
                        <!-- Mock Data Points - Responsive -->
                        <div class="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4 pb-3 sm:pb-4 md:pb-5 flex items-end justify-between h-8 sm:h-10 md:h-12">
                            <div v-for="(day, index) in revenueData.days" :key="index"
                                 class="flex-1 flex flex-col items-center px-0.5">
                                <div :style="{ height: `${day.value}%` }"
                                     class="w-1.5 sm:w-2 md:w-3 rounded-t-sm sm:rounded-t-md md:rounded-t-lg bg-gradient-to-t from-primary-500 to-primary-400 transition-all duration-500 hover:from-secondary-500 hover:to-secondary-400"></div>
                                <p class="text-[10px] xs:text-xs text-neutral-500 dark:text-neutral-500 mt-1 sm:mt-2 truncate">
                                    {{ day.label }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions Bar - Responsive -->
        <div class="mt-4 sm:mt-6 md:mt-8">
            <div class="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-800 p-3 sm:p-4 md:p-6">
                <div class="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 class="text-base sm:text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                        {{ t('quickActions') }}
                    </h3>
                    <p class="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">
                        {{ t('tapToAction') }}
                    </p>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    <button v-for="action in quickActions" :key="action.id"
                            @click="handleQuickAction(action.id)"
                            class="group flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 cursor-pointer active:scale-95">
                        <div :class="action.bg"
                             class="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg flex items-center justify-center mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                            <i :class="[action.icon, 'text-base sm:text-lg']"></i>
                        </div>
                        <p class="text-xs sm:text-sm font-medium text-neutral-900 dark:text-white text-center leading-tight">
                            {{ action.label }}
                        </p>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Bottom Navigation -->
        <div class="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 p-2 flex justify-around items-center z-50">
            <button v-for="tab in mobileTabs" :key="tab.id"
                    @click="setActiveTab(tab.id)"
                    :class="[
                        'flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200',
                        activeTabIndex === tab.id ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-neutral-600 dark:text-neutral-400'
                    ]">
                <i :class="[tab.icon, 'text-lg mb-1']"></i>
                <span class="text-xs">{{ tab.label }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/app/store/auth/auth.store';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const { t } = useI18n();
const router = useRouter();

const activeTabIndex = ref(0);
const revenuePeriod = ref('week');

// Format last login time
const formatLastLogin = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Set active tab
const setActiveTab = (index: number) => {
    activeTabIndex.value = index;
    // In a real app, you would load data for this tab
    console.log(`Switched to tab ${index}`);
};

// Set revenue period
const setRevenuePeriod = (period: string) => {
    revenuePeriod.value = period;
    // In a real app, you would fetch data for this period
    console.log(`Revenue period changed to ${period}`);
};

// Handle stat card click - use owner routes so navigation stays in owner layout
const handleStatClick = (statLabel: string) => {
    console.log(`Clicked on ${statLabel}`);
    switch(statLabel) {
        case t('todaysOrders'):
            router.push('/owner/orders');
            break;
        case t('revenue'):
            router.push('/owner/analytics');
            break;
        default:
            break;
    }
};

// Handle quick action click - use owner routes
const handleQuickAction = (actionId: number) => {
    console.log(`Quick action ${actionId} clicked`);
    switch(actionId) {
        case 1: // Add Item
            router.push('/owner/menu-items/edit');
            break;
        case 2: // Manage Menu
            router.push('/owner/menu');
            break;
        case 3: // View Reports
            router.push('/owner/analytics');
            break;
        case 4: // Staff Management
            router.push('/owner/orders');
            break;
        default:
            break;
    }
};

// Reactive stats with translations
const stats = computed(() => [
    {
        label: t('todaysOrders'),
        value: '24',
        change: `+12% ${t('fromYesterday')}`,
        trend: 'up',
        bg: 'bg-gradient-to-br from-blue-500 to-blue-400',
        icon: 'ri-file-list-line text-white',
    },
    {
        label: t('revenue'),
        value: '$1,247',
        change: `+8% ${t('fromYesterday')}`,
        trend: 'up',
        bg: 'bg-gradient-to-br from-green-500 to-green-400',
        icon: 'ri-money-dollar-circle-line text-white',
    },
    {
        label: t('avgOrder'),
        value: '$28.50',
        change: `+3% ${t('fromYesterday')}`,
        trend: 'up',
        bg: 'bg-gradient-to-br from-secondary-500 to-secondary-400',
        icon: 'ri-shopping-cart-line text-white',
    },
    {
        label: t('rating'),
        value: '4.8',
        change: `+0.2 ${t('fromYesterday')}`,
        trend: 'up',
        bg: 'bg-gradient-to-br from-purple-500 to-purple-400',
        icon: 'ri-star-line text-white',
    },
]);

// Reactive tabs with translations
const tabs = computed(() => [
    { 
        label: t('tabs.overview'), 
        active: activeTabIndex.value === 0 
    },
    { 
        label: t('tabs.activeOrders'), 
        active: activeTabIndex.value === 1 
    },
    { 
        label: t('tabs.menuManagement'), 
        active: activeTabIndex.value === 2 
    },
    { 
        label: t('tabs.analytics'), 
        active: activeTabIndex.value === 3 
    },
]);

// Mobile tabs for bottom navigation
const mobileTabs = computed(() => [
    { id: 0, label: t('tabs.overview'), icon: 'ri-dashboard-line' },
    { id: 1, label: t('tabs.activeOrders'), icon: 'ri-shopping-cart-line' },
    { id: 2, label: t('tabs.menuManagement'), icon: 'ri-restaurant-line' },
    { id: 3, label: t('tabs.analytics'), icon: 'ri-bar-chart-line' },
]);

// Recent orders data
const recentOrders = ref([
    {
        id: '1001',
        time: '10:30 AM',
        items: 3,
        amount: '$45.60',
        status: 'Preparing',
        statusClass: 'bg-warning',
        statusTextClass: 'text-warning'
    },
    {
        id: '1002',
        time: '11:15 AM',
        items: 2,
        amount: '$28.90',
        status: 'Delivered',
        statusClass: 'bg-success',
        statusTextClass: 'text-success'
    },
    {
        id: '1003',
        time: '12:45 PM',
        items: 4,
        amount: '$67.80',
        status: 'On the way',
        statusClass: 'bg-delivery-ontheway',
        statusTextClass: 'text-delivery-ontheway'
    },
    {
        id: '1004',
        time: '1:20 PM',
        items: 1,
        amount: '$12.50',
        status: 'Pending',
        statusClass: 'bg-delivery-pending',
        statusTextClass: 'text-delivery-pending'
    }
]);

// Revenue data
const revenueData = computed(() => ({
    total: revenuePeriod.value === 'week' ? '$3,845.60' : '$14,892.30',
    days: revenuePeriod.value === 'week' ? [
        { label: t('days.mon'), value: 60 },
        { label: t('days.tue'), value: 85 },
        { label: t('days.wed'), value: 45 },
        { label: t('days.thu'), value: 90 },
        { label: t('days.fri'), value: 65 },
        { label: t('days.sat'), value: 100 },
        { label: t('days.sun'), value: 75 }
    ] : [
        { label: t('weeks.week1'), value: 70 },
        { label: t('weeks.week2'), value: 85 },
        { label: t('weeks.week3'), value: 60 },
        { label: t('weeks.week4'), value: 95 }
    ]
}));

// Quick actions
const quickActions = ref([
    {
        id: 1,
        label: t('addItem'),
        icon: 'ri-add-circle-line text-primary-600 dark:text-primary-400',
        bg: 'bg-primary-100 dark:bg-primary-900'
    },
    {
        id: 2,
        label: t('manageMenu'),
        icon: 'ri-restaurant-line text-green-600 dark:text-green-400',
        bg: 'bg-green-100 dark:bg-green-900'
    },
    {
        id: 3,
        label: t('viewReports'),
        icon: 'ri-bar-chart-2-line text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-100 dark:bg-purple-900'
    },
    {
        id: 4,
        label: t('staffManagement'),
        icon: 'ri-group-line text-secondary-600 dark:text-secondary-400',
        bg: 'bg-secondary-100 dark:bg-secondary-900'
    }
]);

onMounted(() => {
    console.log('Dashboard mounted - auth state:', {
        isAuthenticated: authStore.isAuthenticated,
        user: authStore.user,
    });
    
    // Add touch/swipe support for mobile
    if ('ontouchstart' in window) {
        console.log('Touch device detected - enabling mobile optimizations');
    }
});
</script>

<style scoped>
/* Responsive text sizes */
.text-bubble {
    font-size: clamp(2rem, 5vw, 3.5rem);
}

/* Better touch targets for mobile */
@media (max-width: 640px) {
    button, 
    [role="button"] {
        min-height: 44px;
        min-width: 44px;
    }
    
    /* Prevent text overflow on mobile */
    .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

/* Smooth transitions for all interactive elements */
* {
    transition-property: color, background-color, border-color, transform,
        box-shadow, opacity;
    transition-duration: 200ms;
}

/* Mobile bottom navigation spacing */
@media (max-width: 640px) {
    .min-h-screen {
        padding-bottom: 60px; /* Space for bottom nav */
    }
}
</style>