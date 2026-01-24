<template>
	<div class="orders-container space-y-6">
		<!-- Header Section -->
		<div class="header-section">
            <div class="header-content">
                <div class="header-icon-container">
                    <i class="ri-shopping-cart-line header-icon"></i>
                </div>
                <div>
                    <h1 class="header-title">
					{{ $t('orders') }}
					</h1>
                    <p class="header-subtitle">
					{{ $t('manageTrackOrders') }}
						<span v-if="orders.length > 0" class="order-count">
							({{ orders.length }} {{ $t('orders', orders.length) }})
						</span>
                    </p>
                </div>
			</div>
		
			<div class="header-controls">
				<!-- Search Input -->
				<div class="search-container">
					<i class="ri-search-line search-icon"></i>
					<input
						v-model="searchQuery"
						:placeholder="$t('searchPlaceholder')"
						class="search-input"
						@input="handleSearch"
						:aria-label="$t('searchPlaceholder')"
					/>
					<button
						v-if="searchQuery"
						@click="clearSearch"
						class="search-clear-button"
						:aria-label="$t('clearSearch')"
					>
						<i class="ri-close-line"></i>
					</button>
				</div>
				
				<!-- Filter Button with Dropdown -->
				<div class="filter-container">
					<button
						@click="toggleFilterDropdown"
						class="filter-button"
						:aria-expanded="showFilterDropdown"
						:aria-label="$t('filterOrders')"
					>
						<i class="ri-filter-line filter-icon"></i>
						{{ $t('filter') }}
						<i 
							class="ri-arrow-down-s-line filter-arrow" 
							:class="{ 'filter-arrow-open': showFilterDropdown }"
						></i>
					</button>
					
					<!-- Filter Dropdown -->
					<transition name="fade">
						<div 
							v-if="showFilterDropdown" 
							class="filter-dropdown"
							:aria-hidden="!showFilterDropdown"
						>
							<div class="filter-content">
								<!-- Header -->
								<div class="filter-header">
									<h3 class="filter-title">{{ $t('filter') }}</h3>
									<button
										@click="resetFilters"
										class="filter-reset-button"
										:aria-label="$t('resetFilters')"
									>
										<i class="ri-refresh-line"></i>
										{{ $t('resetFilters') }}
									</button>
								</div>
								
								<!-- Status Filter Section -->
								<div class="filter-section">
									<div class="filter-section-header">
										<div class="filter-section-icon-container">
											<i class="ri-filter-2-line filter-section-icon"></i>
										</div>
										<h3 class="filter-section-title">{{ $t('filterByStatus') }}</h3>
									</div>
									
									<div class="status-filter-grid">
										<div 
											v-for="status in orderStatuses" 
											:key="status.value"
											class="status-filter-item"
										>
											<input
												type="checkbox"
												:id="`status-${status.value}`"
												:value="status.value"
												v-model="selectedStatuses"
												@change="applyFilters"
												class="status-filter-input"
												:aria-label="`Filter by ${status.label}`"
											/>
											<label 
												:for="`status-${status.value}`"
												class="status-filter-label"
											>
												<div class="status-filter-label-content">
													<div class="status-checkbox">
														<div class="status-checkbox-inner"></div>
													</div>
													<span class="status-label">{{ status.label }}</span>
												</div>
												<div 
													class="status-count-badge"
													:class="getStatusBadgeClass(status.value)"
												>
													{{ getOrderCountByStatus(status.value) }}
												</div>
											</label>
										</div>
									</div>
								</div>
								
								<!-- Sort Section -->
								<div class="filter-section">
									<div class="filter-section-header">
										<div class="sort-section-icon-container">
											<i class="ri-sort-desc sort-section-icon"></i>
										</div>
										<h3 class="filter-section-title">{{ $t('sortBy') }}</h3>
									</div>
									
									<div class="sort-container">
										<i class="ri-arrow-down-s-line sort-dropdown-icon"></i>
										<select
											v-model="sortBy"
											@change="applyFilters"
											class="sort-select"
											:aria-label="$t('sortBy')"
										>
											<option value="newest">{{ $t('newestFirst') }}</option>
											<option value="oldest">{{ $t('oldestFirst') }}</option>
											<option value="amount">{{ $t('highestAmount') }}</option>
										</select>
									</div>
									
									<!-- Sort indicator icons -->
									<div class="sort-indicators">
										<div class="sort-indicator">
											<i class="ri-arrow-up-line"></i>
											<span>{{ $t('ascending') }}</span>
										</div>
										<div class="sort-indicator">
											<i class="ri-arrow-down-line"></i>
											<span>{{ $t('descending') }}</span>
										</div>
									</div>
								</div>
								
								<!-- Apply Filters Button -->
								<div class="filter-actions">
									<button
										@click="applyFilters"
										class="apply-filters-button"
										:aria-label="$t('applyFilters')"
									>
										<i class="ri-check-line"></i>
										{{ $t('applyFilters') }}
									</button>
									
									<p class="filter-stats">
										{{ selectedStatuses.length }} {{ $t('activeFilters') }} • {{ filteredOrders.length }} {{ $t('results') }}
									</p>
								</div>
							</div>
						</div>
					</transition>
				</div>
				
				<!-- Refresh Button with Loading State -->
				<button
					@click="loadOrders"
					:disabled="loading"
					class="refresh-button"
					:aria-label="$t('refresh')"
				>
					<i 
						class="ri-refresh-line refresh-icon" 
						:class="{ 'refreshing': loading }"
					></i>
					{{ loading ? $t('refreshing') : $t('refresh') }}
				</button>
			</div>
		</div>

		<!-- Status Filter Tabs -->
		<div class="status-tabs-container">
			<div class="status-tabs">
				<button
					v-for="tab in statusTabs"
					:key="tab.status"
					@click="setActiveTab(tab.status)"
					:class="[
						'status-tab-button',
						activeTab === tab.status 
							? 'status-tab-active'
							: 'status-tab-inactive'
					]"
					:style="activeTab === tab.status ? tabStyle(tab.color) : {}"
					:aria-label="`${$t(tab.translationKey)} orders`"
					:aria-selected="activeTab === tab.status"
				>
					<span :class="tab.iconClass"></span>
					{{ $t(tab.translationKey) }}
					<span 
						class="status-tab-count"
						:class="activeTab === tab.status ? 'status-tab-count-active' : 'status-tab-count-inactive'"
					>
						{{ getOrderCountByStatus(tab.status) }}
					</span>
				</button>
			</div>
			
			<!-- Stats Overview -->
			<div class="stats-overview">
				<div 
					v-for="stat in stats"
					:key="stat.label"
					class="stat-card"
					:class="{ 'highlighted': stat.highlight }"
				>
					<div class="stat-content">
						<div>
							<p class="stat-label">{{ $t(stat.label) }}</p>
							<p class="stat-value">{{ stat.value }}</p>
						</div>
						<div class="stat-icon-container" :style="{ backgroundColor: stat.bgColor }">
							<i :class="stat.icon" class="stat-icon" :style="{ color: stat.color }"></i>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Orders List -->
		<div v-if="loading" class="loading-skeleton">
			<div v-for="n in 3" :key="n" class="skeleton-card">
				<div class="skeleton-content">
					<div class="skeleton-line"></div>
					<div class="skeleton-title"></div>
				</div>
				<div class="skeleton-badge"></div>
			</div>
		</div>
		
		<div v-else-if="filteredOrders.length === 0" class="empty-state">
			<div class="empty-state-icon">
				<i class="ri-inbox-line"></i>
			</div>
			<h3 class="empty-state-title">
				{{ searchQuery ? $t('noResultsFound') : $t('noOrders') }}
			</h3>
			<p class="empty-state-description">
				{{ searchQuery ? $t('tryDifferentSearch') : $t('createNewOrderPrompt') }}
			</p>
			<button
				v-if="!searchQuery"
				class="empty-state-action-button"
				:aria-label="$t('orderNow')"
			>
				<i class="ri-add-line"></i>
				{{ $t('orderNow') }}
			</button>
		</div>

		<div v-else class="orders-list">
			<OrderCard
				v-for="order in paginatedOrders"
				:key="order.id"
				:order="order"
				@update-status="handleStatusUpdate"
			/>

			<!-- Pagination -->
			<div v-if="filteredOrders.length > itemsPerPage" class="pagination">
				<p class="pagination-info">
					{{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} {{ $t('of') }} {{ filteredOrders.length }} {{ $t('orders', filteredOrders.length) }}
				</p>
				<div class="pagination-controls">
					<button
						@click="prevPage"
						:disabled="currentPage === 1"
						class="pagination-button"
						:class="{ 'disabled': currentPage === 1 }"
						:aria-label="$t('previousPage')"
					>
						{{ $t('previous') }}
					</button>
					<button
						@click="nextPage"
						:disabled="currentPage * itemsPerPage >= filteredOrders.length"
						class="pagination-button"
						:class="{ 'disabled': currentPage * itemsPerPage >= filteredOrders.length }"
						:aria-label="$t('nextPage')"
					>
						{{ $t('next') }}
					</button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Click Outside Listener for Dropdown -->
	<div 
		v-if="showFilterDropdown" 
		class="dropdown-overlay" 
		@click="closeFilterDropdown"
		:aria-hidden="!showFilterDropdown"
	></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import OrderCard from '../components/OrderCard.vue';
import {
	fetchOrders,
	updateOrderStatus,
} from '../services/businessOwner.service';
import type { Order } from '../types/';

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
		color: '#8b5cf6', // Purple-500
		iconClass: 'ri-list-check text-base'
	},
	{
		status: 'new',
		translationKey: 'new',
		color: '#3b82f6', // Blue-500
		iconClass: 'ri-time-line text-base'
	},
	{
		status: 'preparing',
		translationKey: 'preparing',
		color: '#8b5cf6', // Purple-500
		iconClass: 'ri-restaurant-line text-base'
	},
	{
		status: 'ready',
		translationKey: 'ready',
		color: '#06b6d4', // Cyan-500
		iconClass: 'ri-checkbox-circle-line text-base'
	},
	{
		status: 'delivered',
		translationKey: 'delivered',
		color: '#10b981', // Emerald-500
		iconClass: 'ri-truck-line text-base'
	},
	{
		status: 'cancelled',
		translationKey: 'statuscancelled',
		color: '#ef4444', // Red-500
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

// Statistics
const stats = computed(() => [
	{
		label: 'totalOrders',
		value: orders.value.length,
		icon: 'ri-shopping-cart-line',
		color: '#8b5cf6', // Purple-500
		bgColor: 'rgba(139, 92, 246, 0.1)',
		highlight: true
	},
	{
		label: 'pending',
		value: getOrderCountByStatus('new') + getOrderCountByStatus('preparing'),
		icon: 'ri-time-line',
		color: '#f59e0b', // Amber-500
		bgColor: 'rgba(245, 158, 11, 0.1)'
	},
	{
		label: 'revenue',
		value: `$${calculateTodayRevenue()}`,
		icon: 'ri-money-dollar-circle-line',
		color: '#10b981', // Emerald-500
		bgColor: 'rgba(16, 185, 129, 0.1)'
	},
	{
		label: 'avgOrder',
		value: `$${calculateAverageOrderValue().toFixed(2)}`,
		icon: 'ri-timer-line',
		color: '#06b6d4', // Cyan-500
		bgColor: 'rgba(6, 182, 212, 0.1)'
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
		case 'new': return 'badge-blue';
		case 'preparing': return 'badge-purple';
		case 'ready': return 'badge-cyan';
		case 'delivered': return 'badge-green';
		case 'cancelled': return 'badge-red';
		default: return 'badge-gray';
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

// Keyboard shortcuts
const handleEscape = (e: KeyboardEvent) => {
	if (e.key === 'Escape' && showFilterDropdown.value) {
		closeFilterDropdown();
	}
};

// Initialize
onMounted(() => {
	loadOrders();
	window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
	window.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
/* Base container */
.orders-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 1.5rem;
}

@media (prefers-color-scheme: dark) {
    .orders-container {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    }
}

/* Header Section */
.header-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@media (min-width: 640px) {
    .header-section {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
}

.header-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.header-icon-container {
    width: 4rem;
    height: 4rem;
    border-radius: 1.5rem;
    background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.header-icon {
    font-size: 1.75rem;
    color: white;
}

.header-title {
    font-size: 3rem;
    font-weight: 800;
    color: #1e293b;
    margin: 0;
    line-height: 1;
    text-shadow: 0 2px 4px rgba(30, 41, 59, 0.1);
}

@media (prefers-color-scheme: dark) {
    .header-title {
        color: #f1f5f9;
        text-shadow: 0 2px 4px rgba(241, 245, 249, 0.1);
    }
}

.header-subtitle {
    color: #475569;
    font-size: 1.25rem;
    font-weight: 400;
    margin: 0.25rem 0 0 0;
    user-select: none;
}

@media (prefers-color-scheme: dark) {
    .header-subtitle {
        color: #cbd5e1;
    }
}

.order-count {
    margin-left: 0.5rem;
    color: #8b5cf6;
    font-weight: 500;
}

@media (prefers-color-scheme: dark) {
    .order-count {
        color: #a855f7;
    }
}

/* Header Controls */
.header-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

/* Search Container */
.search-container {
    position: relative;
    flex: 1;
    min-width: 200px;
}

.search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
}

.search-input {
    width: 100%;
    padding: 0.625rem 0.75rem 0.625rem 2.5rem;
    background: white;
    border: 1px solid #cbd5e1;
    border-radius: 0.75rem;
    color: #1e293b;
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.search-input:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

@media (prefers-color-scheme: dark) {
    .search-input {
        background: #1e293b;
        border-color: #475569;
        color: #f1f5f9;
    }
    
    .search-input:focus {
        border-color: #a855f7;
        box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
    }
}

.search-clear-button {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
}

.search-clear-button:hover {
    color: #64748b;
}

@media (prefers-color-scheme: dark) {
    .search-clear-button:hover {
        color: #cbd5e1;
    }
}

/* Filter Container */
.filter-container {
    position: relative;
}

.filter-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    color: #475569;
    border-radius: 0.75rem;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.filter-button:hover {
    background: #e2e8f0;
    border-color: #94a3b8;
}

.filter-button:focus-visible {
    outline: 2px solid #8b5cf6;
    outline-offset: 2px;
}

.filter-icon {
    font-size: 1.125rem;
}

.filter-arrow {
    font-size: 0.875rem;
    transition: transform 0.2s ease;
}

.filter-arrow-open {
    transform: rotate(180deg);
}

@media (prefers-color-scheme: dark) {
    .filter-button {
        background: #334155;
        border-color: #475569;
        color: #cbd5e1;
    }
    
    .filter-button:hover {
        background: #475569;
        border-color: #64748b;
    }
}

/* Filter Dropdown */
.filter-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    width: 20rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 50;
    overflow: hidden;
}

@media (prefers-color-scheme: dark) {
    .filter-dropdown {
        background: #1e293b;
        border-color: #334155;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
}

.filter-content {
    padding: 1.25rem;
}

.filter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f1f5f9;
}

@media (prefers-color-scheme: dark) {
    .filter-header {
        border-bottom-color: #334155;
    }
}

.filter-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
}

@media (prefers-color-scheme: dark) {
    .filter-title {
        color: #f1f5f9;
    }
}

.filter-reset-button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: #8b5cf6;
    font-weight: 500;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease;
}

.filter-reset-button:hover {
    color: #7c3aed;
}

@media (prefers-color-scheme: dark) {
    .filter-reset-button {
        color: #a855f7;
    }
    
    .filter-reset-button:hover {
        color: #c084fc;
    }
}

/* Filter Section */
.filter-section {
    margin-top: 1.5rem;
}

.filter-section-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.filter-section-icon-container {
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    background: rgba(139, 92, 246, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.filter-section-icon {
    color: #8b5cf6;
}

.sort-section-icon-container {
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    background: rgba(59, 130, 246, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.sort-section-icon {
    color: #3b82f6;
}

.filter-section-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
}

@media (prefers-color-scheme: dark) {
    .filter-section-title {
        color: #f1f5f9;
    }
}

/* Status Filter */
.status-filter-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
}

.status-filter-item {
    position: relative;
}

.status-filter-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.status-filter-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.status-filter-input:checked + .status-filter-label {
    border-color: #8b5cf6;
    background: rgba(139, 92, 246, 0.08);
    box-shadow: 0 2px 4px rgba(139, 92, 246, 0.2);
}

.status-filter-label:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
}

.status-filter-label-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.status-checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
}

.status-checkbox-inner {
    width: 1rem;
    height: 1rem;
    border: 2px solid #94a3b8;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
}

.status-filter-input:checked + .status-filter-label .status-checkbox-inner {
    border-color: #8b5cf6;
    background-color: #8b5cf6;
    border-width: 4px;
}

.status-label {
    font-weight: 500;
    color: #475569;
}

.status-filter-input:checked + .status-filter-label .status-label {
    color: #1e293b;
    font-weight: 600;
}

.status-count-badge {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
}

/* Status badge colors */
.badge-blue {
    background: rgba(59, 130, 246, 0.1);
    color: #1d4ed8;
}

.badge-purple {
    background: rgba(139, 92, 246, 0.1);
    color: #7c3aed;
}

.badge-cyan {
    background: rgba(6, 182, 212, 0.1);
    color: #0e7490;
}

.badge-green {
    background: rgba(16, 185, 129, 0.1);
    color: #047857;
}

.badge-red {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
}

.badge-gray {
    background: rgba(100, 116, 139, 0.1);
    color: #475569;
}

@media (prefers-color-scheme: dark) {
    .badge-blue {
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
    }
    
    .badge-purple {
        background: rgba(139, 92, 246, 0.2);
        color: #a855f7;
    }
    
    .badge-cyan {
        background: rgba(6, 182, 212, 0.2);
        color: #22d3ee;
    }
    
    .badge-green {
        background: rgba(16, 185, 129, 0.2);
        color: #34d399;
    }
    
    .badge-red {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
    }
    
    .badge-gray {
        background: rgba(148, 163, 184, 0.2);
        color: #cbd5e1;
    }
    
    .status-filter-label {
        border-color: #334155;
    }
    
    .status-filter-label:hover {
        border-color: #475569;
        background: #1e293b;
    }
    
    .status-filter-input:checked + .status-filter-label {
        border-color: #8b5cf6;
        background: rgba(139, 92, 246, 0.2);
    }
    
    .status-label {
        color: #cbd5e1;
    }
    
    .status-filter-input:checked + .status-filter-label .status-label {
        color: #f1f5f9;
    }
}

/* Sort Container */
.sort-container {
    position: relative;
}

.sort-dropdown-icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
}

.sort-select {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 1rem;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 0.75rem;
    color: #1e293b;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    appearance: none;
}

.sort-select:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

@media (prefers-color-scheme: dark) {
    .sort-select {
        background: #1e293b;
        border-color: #334155;
        color: #f1f5f9;
    }
    
    .sort-select:focus {
        border-color: #a855f7;
        box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
    }
}

.sort-indicators {
    display: flex;
    gap: 1rem;
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: #64748b;
}

.sort-indicator {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

@media (prefers-color-scheme: dark) {
    .sort-indicators {
        color: #94a3b8;
    }
}

/* Filter Actions */
.filter-actions {
    padding-top: 1rem;
    border-top: 1px solid #f1f5f9;
}

.apply-filters-button {
    width: 100%;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);
}

.apply-filters-button:hover {
    box-shadow: 0 8px 12px rgba(139, 92, 246, 0.4);
    transform: translateY(-1px);
}

.filter-stats {
    font-size: 0.75rem;
    color: #64748b;
    text-align: center;
    margin: 0.75rem 0 0 0;
}

@media (prefers-color-scheme: dark) {
    .filter-actions {
        border-top-color: #334155;
    }
    
    .apply-filters-button {
        background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%);
        box-shadow: 0 4px 6px rgba(168, 85, 247, 0.3);
    }
    
    .apply-filters-button:hover {
        box-shadow: 0 8px 12px rgba(168, 85, 247, 0.4);
    }
    
    .filter-stats {
        color: #94a3b8;
    }
}

/* Refresh Button */
.refresh-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.5rem;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);
}

.refresh-button:hover:not(:disabled) {
    box-shadow: 0 8px 12px rgba(139, 92, 246, 0.4);
    transform: translateY(-1px);
}

.refresh-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.refresh-icon {
    font-size: 1.125rem;
    transition: transform 0.5s ease;
}

.refreshing {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Status Tabs Container */
.status-tabs-container {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    padding: 1rem;
}

@media (prefers-color-scheme: dark) {
    .status-tabs-container {
        background: #1e293b;
        border-color: #334155;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }
}

.status-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f1f5f9;
}

@media (prefers-color-scheme: dark) {
    .status-tabs {
        border-bottom-color: #334155;
    }
}

.status-tab-button {
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    border: 2px solid transparent;
    position: relative;
}

.status-tab-button:focus-visible {
    outline: 2px solid #8b5cf6;
    outline-offset: 2px;
}

.status-tab-active {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border-color: #8b5cf6;
}

.status-tab-inactive {
    color: #475569;
    background: transparent;
    border-color: transparent;
}

.status-tab-inactive:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
}

.status-tab-count {
    margin-left: 0.25rem;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    min-width: 1.5rem;
    text-align: center;
}

.status-tab-count-active {
    background: rgba(255, 255, 255, 0.2);
    color: white;
}

.status-tab-count-inactive {
    background: #334155;
    color: white;
}

@media (prefers-color-scheme: dark) {
    .status-tab-inactive {
        color: #cbd5e1;
    }
    
    .status-tab-inactive:hover {
        border-color: #475569;
        background: #1e293b;
    }
    
    .status-tab-count-inactive {
        background: #475569;
        color: white;
    }
}

/* Stats Overview */
.stats-overview {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 768px) {
    .stats-overview {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .stats-overview {
        grid-template-columns: repeat(4, 1fr);
    }
}

.stat-card {
    padding: 1rem;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
}

.stat-card.highlighted {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%);
}

@media (prefers-color-scheme: dark) {
    .stat-card {
        border-color: #334155;
    }
    
    .stat-card.highlighted {
        background: linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
    }
}

.stat-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.stat-label {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
}

@media (prefers-color-scheme: dark) {
    .stat-label {
        color: #94a3b8;
    }
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0.25rem 0 0 0;
}

@media (prefers-color-scheme: dark) {
    .stat-value {
        color: #f1f5f9;
    }
}

.stat-icon-container {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-icon {
    font-size: 1.25rem;
}

/* Loading Skeleton */
.loading-skeleton {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.skeleton-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@media (prefers-color-scheme: dark) {
    .skeleton-card {
        background: #1e293b;
        border-color: #334155;
    }
}

.skeleton-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.skeleton-line {
    height: 1rem;
    background: #f1f5f9;
    border-radius: 0.5rem;
    width: 8rem;
}

.skeleton-title {
    height: 1.5rem;
    background: #e2e8f0;
    border-radius: 0.5rem;
    width: 12rem;
}

.skeleton-badge {
    height: 2rem;
    background: #f1f5f9;
    border-radius: 0.5rem;
    width: 6rem;
}

@media (prefers-color-scheme: dark) {
    .skeleton-line,
    .skeleton-title,
    .skeleton-badge {
        background: #334155;
    }
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 3rem 1rem;
}

.empty-state-icon {
    width: 6rem;
    height: 6rem;
    margin: 0 auto 1.5rem;
    color: #cbd5e1;
}

.empty-state-icon i {
    font-size: 4rem;
}

.empty-state-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #475569;
    margin: 0 0 0.5rem 0;
}

.empty-state-description {
    color: #64748b;
    margin: 0 0 1.5rem 0;
}

.empty-state-action-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);
}

.empty-state-action-button:hover {
    box-shadow: 0 8px 12px rgba(139, 92, 246, 0.4);
    transform: translateY(-2px);
}

@media (prefers-color-scheme: dark) {
    .empty-state-icon {
        color: #475569;
    }
    
    .empty-state-title {
        color: #cbd5e1;
    }
    
    .empty-state-description {
        color: #94a3b8;
    }
    
    .empty-state-action-button {
        background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%);
        box-shadow: 0 4px 6px rgba(168, 85, 247, 0.3);
    }
    
    .empty-state-action-button:hover {
        box-shadow: 0 8px 12px rgba(168, 85, 247, 0.4);
    }
}

/* Orders List */
.orders-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Pagination */
.pagination {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
}

@media (min-width: 640px) {
    .pagination {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
}

.pagination-info {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
}

.pagination-controls {
    display: flex;
    gap: 0.5rem;
}

.pagination-button {
    padding: 0.5rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.5rem;
    background: white;
    color: #475569;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.pagination-button:hover:not(.disabled) {
    background: #f8fafc;
    border-color: #94a3b8;
}

.pagination-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (prefers-color-scheme: dark) {
    .pagination {
        border-top-color: #334155;
    }
    
    .pagination-info {
        color: #94a3b8;
    }
    
    .pagination-button {
        background: #1e293b;
        border-color: #475569;
        color: #cbd5e1;
    }
    
    .pagination-button:hover:not(.disabled) {
        background: #334155;
        border-color: #64748b;
    }
}

/* Dropdown Overlay */
.dropdown-overlay {
    position: fixed;
    inset: 0;
    z-index: 40;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

/* Responsive Design */
@media (max-width: 768px) {
    .orders-container {
        padding: 1rem;
    }
    
    .header-title {
        font-size: 2.25rem;
    }
    
    .header-subtitle {
        font-size: 1.125rem;
    }
    
    .header-controls {
        flex-direction: column;
        width: 100%;
    }
    
    .search-container,
    .filter-button,
    .refresh-button {
        width: 100%;
    }
    
    .filter-dropdown {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: calc(100% - 2rem);
        max-width: 400px;
    }
    
    .status-tabs {
        overflow-x: auto;
        flex-wrap: nowrap;
        padding-bottom: 0.5rem;
    }
}

@media (max-width: 480px) {
    .header-title {
        font-size: 1.875rem;
    }
    
    .header-subtitle {
        font-size: 1rem;
    }
    
    .header-icon-container {
        width: 3rem;
        height: 3rem;
    }
    
    .header-icon {
        font-size: 1.5rem;
    }
    
    .stats-overview {
        grid-template-columns: 1fr;
    }
}

/* Accessibility Improvements */
.status-tab-button:focus-visible,
.filter-button:focus-visible,
.search-input:focus-visible,
.sort-select:focus-visible,
.apply-filters-button:focus-visible,
.refresh-button:focus-visible,
.empty-state-action-button:focus-visible,
.pagination-button:focus-visible {
    outline: 2px solid #8b5cf6;
    outline-offset: 2px;
}

/* Print Styles */
@media print {
    .header-controls,
    .status-tabs,
    .stats-overview,
    .pagination,
    .dropdown-overlay {
        display: none;
    }
    
    .orders-container {
        background: white;
        padding: 0;
    }
    
    .header-title {
        color: black;
        text-shadow: none;
    }
    
    .header-subtitle {
        color: #666;
    }
}
</style>