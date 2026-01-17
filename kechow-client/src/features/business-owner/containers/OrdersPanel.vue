<template>
	<div class="space-y-6">
		<!-- Header Section -->
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-3">
                <div class="w-16 h-16 rounded-3xl bg-gradient-to-r from-secondary-600 to-secondary-500 flex items-center justify-center shadow-md shadow-primary-500/30">
                    <i class="ri-shopping-cart-line text-white text-3xl"></i>
                </div>
                <div>
                    <h1 class="text-bubble text-6xl shadow-primary-500">
					{{ $t('orders') }}
					</h1>
                    <p class="text-neutral-950 dark:text-neutral-200 font-normal text-xl select-none">
					{{ $t('manageTrackOrders') }}
						<span v-if="orders.length > 0" class="ml-2 text-tertiary-800 font-medium">
							({{ orders.length }} {{ $t('orders', orders.length) }})
						</span>
                    </p>
                </div>
			</div>
		
			<div class="flex flex-wrap gap-3">
				<!-- Search Input -->
				<div class="relative flex-1 min-w-[200px]">
					<i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"></i>
					<input
						v-model="searchQuery"
						:placeholder="$t('searchPlaceholder')"
						class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
						@input="handleSearch"
					/>
					<button
						v-if="searchQuery"
						@click="clearSearch"
						class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
					>
						<i class="ri-close-line"></i>
					</button>
				</div>
				
				<!-- Filter Button with Dropdown -->
				<div class="relative">
					<button
						@click="toggleFilterDropdown"
						class="bg-ternary-600 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
					>
						<i class="ri-filter-line text-lg"></i>
						{{ $t('filter') }}
						<i class="ri-arrow-down-s-line text-sm transition-transform duration-200" :class="{ 'rotate-180': showFilterDropdown }"></i>
					</button>
					
					<!-- Filter Dropdown - MOVE THE ENTIRE FILTER CONTENT HERE -->
					<transition name="fade">
						<div 
							v-if="showFilterDropdown" 
							class="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden"
						>
							<!-- MOVE THE ENTIRE FILTER CONTENT INSIDE THIS DIV -->
							<div class="p-5 space-y-6">
								<!-- Header -->
								<div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
									<h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ $t('filter') }}</h3>
									<button
										@click="resetFilters"
										class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1 transition-colors"
									>
										<i class="ri-refresh-line text-base"></i>
										{{ $t('resetFilters') }}
									</button>
								</div>
								
								<!-- Status Filter Section -->
								<div>
									<div class="flex items-center gap-2 mb-3">
										<div class="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
											<i class="ri-filter-2-line text-primary-600 dark:text-primary-400"></i>
										</div>
										<h3 class="font-semibold text-gray-900 dark:text-white">{{ $t('filterByStatus') }}</h3>
									</div>
									
									<div class="grid grid-cols-1 gap-2">
										<div 
											v-for="status in orderStatuses" 
											:key="status.value"
											class="relative"
										>
											<input
												type="checkbox"
												:id="`status-${status.value}`"
												:value="status.value"
												v-model="selectedStatuses"
												@change="applyFilters"
												class="sr-only peer"
											/>
											<label 
												:for="`status-${status.value}`"
												class="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-200 peer-checked:border-primary-500 peer-checked:bg-primary-50 dark:peer-checked:bg-primary-900/20 peer-checked:shadow-sm peer-checked:shadow-primary-500/20 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
											>
												<div class="flex items-center gap-3">
													<div class="flex items-center justify-center w-5 h-5">
														<div class="w-4 h-4 rounded border border-gray-400 dark:border-gray-500 peer-checked:border-primary-500 peer-checked:bg-primary-500 peer-checked:border-4 transition-all duration-200"></div>
													</div>
													<span class="font-medium text-gray-800 dark:text-gray-200">{{ status.label }}</span>
												</div>
												<div 
													class="px-2 py-1 text-xs font-semibold rounded-full"
													:class="getStatusBadgeClass(status.value)"
												>
													{{ getOrderCountByStatus(status.value) }}
												</div>
											</label>
										</div>
									</div>
								</div>
								
								<!-- Sort Section -->
								<div>
									<div class="flex items-center gap-2 mb-3">
										<div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
											<i class="ri-sort-desc text-blue-600 dark:text-blue-400"></i>
										</div>
										<h3 class="font-semibold text-gray-900 dark:text-white">{{ $t('sortBy') }}</h3>
									</div>
									
									<div class="relative">
										<i class="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"></i>
										<select
											v-model="sortBy"
											@change="applyFilters"
											class="w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 appearance-none cursor-pointer transition-all duration-200"
										>
											<option value="newest">{{ $t('newestFirst') }}</option>
											<option value="oldest">{{ $t('oldestFirst') }}</option>
											<option value="amount">{{ $t('highestAmount') }}</option>
										</select>
									</div>
									
									<!-- Sort indicator icons -->
									<div class="mt-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
										<div class="flex items-center gap-2">
											<i class="ri-arrow-up-line"></i>
											<span>Ascendente</span>
										</div>
										<div class="flex items-center gap-2">
											<i class="ri-arrow-down-line"></i>
											<span>Descendente</span>
										</div>
									</div>
								</div>
								
								<!-- Apply Filters Button -->
								<div class="pt-4 border-t border-gray-100 dark:border-gray-700">
									<button
										@click="applyFilters"
										class="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 flex items-center justify-center gap-2"
									>
										<i class="ri-check-line"></i>
										{{ $t('applyFilters') }}
									</button>
									
									<p class="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
										{{ selectedStatuses.length }} filtros activos • {{ filteredOrders.length }} resultados
									</p>
								</div>
							</div>
							<!-- END OF FILTER CONTENT -->
						</div>
					</transition>
				</div>
				
				<!-- Refresh Button with Loading State -->
				<button
					@click="loadOrders"
					:disabled="loading"
					class="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<i 
						class="ri-refresh-line text-lg transition-transform duration-500" 
						:class="{ 'animate-spin': loading }"
					></i>
					{{ loading ? $t('refreshing') : $t('refresh') }}
				</button>
			</div>
		</div>

		<!-- Rest of your template remains the same -->
		<!-- Status Filter Tabs -->
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
			<div class="flex flex-wrap gap-2 pb-3 pt-4">
				<button
					v-for="tab in statusTabs"
					:key="tab.status"
					@click="setActiveTab(tab.status)"
					:class="[
						'px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2 relative',
						activeTab === tab.status 
							? 'shadow-lg border-2 border-primary-500'
							: 'border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
					]"
					:style="activeTab === tab.status ? tabStyle(tab.color) : {}"
				>
					<span :class="tab.iconClass"></span>
					{{ $t(tab.translationKey) }}
					<span 
						class="ml-2 px-2 py-1 rounded-full text-xs font-semibold min-w-[24px] text-center"
						:class="activeTab === tab.status ? 'bg-white/20' : 'bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-300'"
					>
						{{ getOrderCountByStatus(tab.status) }}
					</span>
				</button>
			</div>
			
			<!-- Stats Overview -->
			<div class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
				<div 
					v-for="stat in stats"
					:key="stat.label"
					class="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
					:class="{
						'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20': stat.highlight
					}"
				>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t(stat.label) }}</p>
							<p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stat.value }}</p>
						</div>
						<div class="w-10 h-10 rounded-full flex items-center justify-center" :class="stat.bgColor">
							<i :class="stat.icon" class="text-lg" :style="{ color: stat.color }"></i>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Orders List -->
		<div v-if="loading" class="space-y-4">
			<div v-for="n in 3" :key="n" class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
				<div class="flex items-center justify-between">
					<div class="space-y-3">
						<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
						<div class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
					</div>
					<div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
				</div>
			</div>
		</div>
		
		<div v-else-if="filteredOrders.length === 0" class="text-center py-12">
			<div class="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600">
				<i class="ri-inbox-line text-6xl"></i>
			</div>
			<h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
				{{ searchQuery ? $t('noResultsFound') : $t('noOrders') }}
			</h3>
			<p class="text-gray-500 dark:text-gray-400 mb-6">
				{{ searchQuery ? $t('tryDifferentSearch') : $t('createNewOrderPrompt') }}
			</p>
			<button
				v-if="!searchQuery"
				class="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 inline-flex items-center gap-2"
			>
				<i class="ri-add-line"></i>
				{{ $t('orderNow') }}
			</button>
		</div>

		<div v-else class="space-y-4">
			<OrderCard
				v-for="order in paginatedOrders"
				:key="order.id"
				:order="order"
				@update-status="handleStatusUpdate"
			/>

			<!-- Pagination -->
			<div v-if="filteredOrders.length > itemsPerPage" class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
				<p class="text-sm text-gray-600 dark:text-gray-400">
					{{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} {{ $t('of') }} {{ filteredOrders.length }} {{ $t('orders', filteredOrders.length) }}
				</p>
				<div class="flex gap-2">
					<button
						@click="prevPage"
						:disabled="currentPage === 1"
						class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						{{ $t('previous') }}
					</button>
					<button
						@click="nextPage"
						:disabled="currentPage * itemsPerPage >= filteredOrders.length"
						class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						{{ $t('next') }}
					</button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Click Outside Listener for Dropdown -->
	<div v-if="showFilterDropdown" class="fixed inset-0 z-40" @click="closeFilterDropdown"></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import OrderCard from '../components/OrderCard.vue';
import {
	fetchOrders,
	updateOrderStatus,
} from '../services/businessOwner.service';
import type { Order, OrderStats } from '../types/';

const { t } = useI18n();

const orders = ref<Order[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const showFilterDropdown = ref(false);
const activeTab = ref<string>('all');
const selectedStatuses = ref<string[]>([]);
const sortBy = ref('newest');
const currentPage = ref(1);
const itemsPerPage = 10;

// Status tabs with translation keys
const statusTabs = computed(() => [
	{
		status: 'all',
		translationKey: 'allOrders',
		color: '#8b34e0',
		iconClass: 'ri-list-check text-base'
	},
	{
		status: 'new',
		translationKey: 'new',
		color: '#3b82f6',
		iconClass: 'ri-time-line text-base'
	},
	{
		status: 'preparing',
		translationKey: 'preparing',
		color: '#8b5cf6',
		iconClass: 'ri-restaurant-line text-base'
	},
	{
		status: 'ready',
		translationKey: 'ready',
		color: '#06b6d4',
		iconClass: 'ri-checkbox-circle-line text-base'
	},
	{
		status: 'delivered',
		translationKey: 'delivered',
		color: '#10b981',
		iconClass: 'ri-truck-line text-base'
	},
	{
		status: 'cancelled',
		translationKey: 'statuscancelled',
		color: '#ef4444',
		iconClass: 'ri-close-circle-line text-base'
	}
]);

// Status options for filter dropdown
const orderStatuses = computed(() => [
	{ value: 'new', label: t('new') },
	{ value: 'preparing', label: t('preparing') },
	{ value: 'ready', label: t('ready') },
	{ value: 'delivered', label: t('delivered') },
	{ value: 'cancelled', label: t('statuscancelled') }
]);

// Statistics with translation keys
const stats = computed(() => [
	{
		label: 'totalOrders',
		value: orders.value.length,
		icon: 'ri-shopping-cart-line',
		color: '#8b34e0',
		bgColor: 'bg-primary-100 dark:bg-primary-900/30',
		highlight: true
	},
	{
		label: 'pending',
		value: getOrderCountByStatus('new') + getOrderCountByStatus('preparing'),
		icon: 'ri-time-line',
		color: '#f59e0b',
		bgColor: 'bg-amber-100 dark:bg-amber-900/30'
	},
	{
		label: 'revenue',
		value: `$${calculateTodayRevenue()}`,
		icon: 'ri-money-dollar-circle-line',
		color: '#10b981',
		bgColor: 'bg-emerald-100 dark:bg-emerald-900/30'
	},
	{
		label: 'avgOrder',
		value: `$${calculateAverageOrderValue().toFixed(2)}`,
		icon: 'ri-timer-line',
		color: '#06b6d4',
		bgColor: 'bg-cyan-100 dark:bg-cyan-900/30'
	}
]);

// Computed properties
const filteredOrders = computed(() => {
	let filtered = [...orders.value];
	
	// Filter by active tab
	if (activeTab.value !== 'all') {
		filtered = filtered.filter(order => order.status === activeTab.value);
	}
	
	// Filter by selected statuses (if any)
	if (selectedStatuses.value.length > 0) {
		filtered = filtered.filter(order => selectedStatuses.value.includes(order.status));
	}
	
	// Filter by search query
	if (searchQuery.value.trim()) {
		const query = searchQuery.value.toLowerCase();
		filtered = filtered.filter(order => 
			order.id.toLowerCase().includes(query) ||
			order.customerName.toLowerCase().includes(query) ||
			order.items.some(item => item.name.toLowerCase().includes(query))
		);
	}
	
	// Sort orders
	switch (sortBy.value) {
		case 'newest':
			filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
			break;
		case 'oldest':
			filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
			break;
		case 'amount':
			filtered.sort((a, b) => b.totalAmount - a.totalAmount);
			break;
	}
	
	return filtered;
});

const paginatedOrders = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	return filteredOrders.value.slice(start, end);
});

// Add status badge color classes
const getStatusBadgeClass = (status: string) => {
	switch(status) {
		case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
		case 'preparing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
		case 'ready': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300';
		case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
		case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
		default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
	}
};

// Functions
const getOrderCountByStatus = (status: string) => {
	if (status === 'all') return orders.value.length;
	return orders.value.filter(order => order.status === status).length;
};

const calculateTodayRevenue = () => {
	const today = new Date().toDateString();
	return orders.value
		.filter(order => new Date(order.createdAt).toDateString() === today && order.status === 'delivered')
		.reduce((sum, order) => sum + order.totalAmount, 0)
		.toFixed(2);
};

const calculateAverageOrderValue = () => {
	if (orders.value.length === 0) return 0;
	const total = orders.value.reduce((sum, order) => sum + order.totalAmount, 0);
	return total / orders.value.length;
};

const tabStyle = (color: string) => ({
	background: `linear-gradient(135deg, ${color}, ${color}80)`,
	color: 'white'
});

const setActiveTab = (status: string) => {
	activeTab.value = status;
	currentPage.value = 1;
};

const toggleFilterDropdown = () => {
	showFilterDropdown.value = !showFilterDropdown.value;
};

const closeFilterDropdown = () => {
	showFilterDropdown.value = false;
};

const applyFilters = () => {
	currentPage.value = 1;
	closeFilterDropdown();
};

const resetFilters = () => {
	selectedStatuses.value = [];
	sortBy.value = 'newest';
	activeTab.value = 'all';
	currentPage.value = 1;
	closeFilterDropdown();
};

const handleSearch = () => {
	currentPage.value = 1;
};

const clearSearch = () => {
	searchQuery.value = '';
	currentPage.value = 1;
};

const nextPage = () => {
	if (currentPage.value * itemsPerPage < filteredOrders.value.length) {
		currentPage.value++;
	}
};

const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
	}
};

const loadOrders = async () => {
	try {
		loading.value = true;
		orders.value = await fetchOrders();
	} catch (error) {
		console.error('Failed to load orders:', error);
		// Show error toast notification here using t('errorMessage')
	} finally {
		loading.value = false;
	}
};

const handleStatusUpdate = async (orderId: string, newStatus: string) => {
	try {
		await updateOrderStatus(orderId, newStatus);
		await loadOrders();
		// Show success toast notification here using t('statusUpdated')
	} catch (error) {
		console.error('Failed to update order status:', error);
		// Show error toast notification here using t('updateFailed')
	}
};

// Initialize
onMounted(() => {
	loadOrders();
});

// Keyboard shortcuts
const handleEscape = (e: KeyboardEvent) => {
	if (e.key === 'Escape' && showFilterDropdown.value) {
		closeFilterDropdown();
	}
};

onMounted(() => {
	window.addEventListener('keydown', handleEscape);
	return () => {
		window.removeEventListener('keydown', handleEscape);
	};
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

/* Custom scrollbar for tabs */
.overflow-x-auto::-webkit-scrollbar {
	height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.05);
	border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
	background: rgba(139, 52, 224, 0.3);
	border-radius: 4px;
}

.dark .overflow-x-auto::-webkit-scrollbar-track {
	background: rgba(255, 255, 255, 0.05);
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
	background: rgba(168, 85, 247, 0.4);
}
</style>