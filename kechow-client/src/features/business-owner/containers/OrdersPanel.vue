<template>
	<div class="space-y-6 mb-4">
		<!-- Header Section -->
            <div class="flex items-center gap-3 space-y-2 ">
                <div class="w-16 h-16 rounded-3xl bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center shadow-md shadow-primary-500/30">
                    <i class="ri-shopping-cart-line text-white text-3xl"></i>
                </div>
                <div>
                    <h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-snug">
					Pedidos
					</h1>
                  	<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none tline-clamp-2">
					Gestiona y sigue todos los pedidos de tu restaurante
						<span v-if="orders.length > 0" class="ml-1 sm:ml-2 text-tertiary-800 dark:text-tertiary-400 font-medium whitespace-nowrap">
							({{ orders.length }} pedidos)
						</span>
                    </p>
                </div>
			</div>

		<!-- Controls: Search, Filter, Refresh -->
			<div class="header-controls space-y-2 mb-4 ">
				<!-- Search Input -->
				<div class="search-container">
					<i class="ri-search-line search-icon"></i>
					<input
						v-model="searchQuery"
						placeholder="Buscar comida, restaurantes, categorías…"
						class="search-input"
						@input="handleSearch"
						aria-label="Buscar comida, restaurantes, categorías…"
					/>
					<button
						v-if="searchQuery"
						@click="clearSearch"
						class="search-clear-button"
						aria-label="Limpiar búsqueda"
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
						aria-label="Filtrar pedidos"
					>
						<i class="ri-filter-line filter-icon"></i>
						Filtrar
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
									<h3 class="filter-title">Filtrar</h3>
									<button
										@click="resetFilters"
										class="filter-reset-button"
										aria-label="Restablecer filtros"
									>
										<i class="ri-refresh-line"></i>
										Restablecer filtros
									</button>
								</div>
								
								<!-- Status Filter Section -->
								<div class="filter-section">
									<div class="filter-section-header">
										<div class="filter-section-icon-container">
											<i class="ri-filter-2-line filter-section-icon"></i>
										</div>
										<h3 class="filter-section-title">Filtrar por Estado</h3>
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
										<h3 class="filter-section-title">Ordenar por</h3>
									</div>
									
									<div class="sort-container">
										<i class="ri-arrow-down-s-line sort-dropdown-icon"></i>
										<select
											v-model="sortBy"
											@change="applyFilters"
											class="sort-select"
											aria-label="Ordenar por"
										>
											<option value="newest">Más recientes primero</option>
											<option value="oldest">Más antiguos primero</option>
											<option value="amount">Monto más alto</option>
										</select>
									</div>
									
									<!-- Sort indicator icons -->
									<div class="sort-indicators">
										<div class="sort-indicator">
											<i class="ri-arrow-up-line"></i>
											<span>Ascendente</span>
										</div>
										<div class="sort-indicator">
											<i class="ri-arrow-down-line"></i>
											<span>Descendente</span>
										</div>
									</div>
								</div>
								
								<!-- Apply Filters Button -->
								<div class="filter-actions">
									<button
										@click="applyFilters"
										class="apply-filters-button"
										aria-label="Aplicar Filtros"
									>
										<i class="ri-check-line"></i>
										Aplicar Filtros
									</button>
									
									<p class="filter-stats">
										{{ selectedStatuses.length }} filtros activos • {{ filteredOrders.length }} resultados
									</p>
								</div>
							</div>
						</div>
					</transition>
				</div>
				
				<!-- Refresh Button with Loading State -->
				<button
					@click="loadOrders"
					:disabled="loading || !isOnline"
					class="refresh-button"
					:aria-label="!isOnline ? 'Sin conexión' : 'Actualizar'"
				>
					<i 
						class="ri-refresh-line refresh-icon" 
						:class="{ 'refreshing': loading }"
					></i>
					{{ loading ? 'Actualizando...' : 'Actualizar' }}
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
					:aria-label="`${tabLabels[tab.translationKey] || tab.translationKey} pedidos`"
					:aria-selected="activeTab === tab.status"
				>
					<span :class="tab.iconClass"></span>
					{{ tabLabels[tab.translationKey] || tab.translationKey }}
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
							<p class="stat-label">{{ statLabels[stat.label] || stat.label }}</p>
							<p class="stat-value">{{ stat.value }}</p>
						</div>
						<div
							class="stat-icon-container"
							:class="{ 'stat-icon-container-highlighted': stat.highlight }"
							:style="!stat.highlight ? { backgroundColor: stat.bgColor } : {}"
						>
							<i
								:class="[stat.icon, 'stat-icon', { 'stat-icon-highlighted': stat.highlight }]"
								:style="!stat.highlight ? { color: stat.color } : {}"
							></i>
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
				{{ searchQuery ? 'No se encontraron resultados' : 'No hay pedidos aún' }}
			</h3>
			<p class="empty-state-description">
				{{ searchQuery ? 'Intenta con un término de búsqueda diferente' : 'Comienza creando tu primer pedido' }}
			</p>
			<button
				v-if="!searchQuery"
				class="empty-state-action-button"
				aria-label="Ordenar Ahora"
			>
				<i class="ri-add-line"></i>
				Ordenar Ahora
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
					Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} de {{ filteredOrders.length }} pedidos
				</p>
				<div class="pagination-controls">
					<button
						@click="prevPage"
						:disabled="currentPage === 1"
						class="pagination-button"
						:class="{ 'disabled': currentPage === 1 }"
						aria-label="Página anterior"
					>
						Anterior
					</button>
					<button
						@click="nextPage"
						:disabled="currentPage * itemsPerPage >= filteredOrders.length"
						class="pagination-button"
						:class="{ 'disabled': currentPage * itemsPerPage >= filteredOrders.length }"
						aria-label="Página siguiente"
					>
						Siguiente
					</button>
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
import OrderCard from '../components/OrderCard.vue';
import {
	fetchOrders,
	updateOrderStatus,
} from '../services/businessOwner.service';
import type { Order } from '../types/';
import { canTransition, normalizeOwnerStatus } from '@shared/order-state-machine';
import { useOnline } from '@shared/composables/useOnline';

const { isOnline } = useOnline();

const tabLabels: Record<string, string> = {
  allOrders: 'Todos los Pedidos',
  new: 'Nuevos',
  preparing: 'En Preparación',
  ready: 'Listos',
  delivered: 'Entregados',
  statuscancelled: 'Cancelado'
};

const statLabels: Record<string, string> = {
  totalOrders: 'Pedidos Totales',
  pending: 'Pendiente',
  revenue: 'Ingresos',
  avgOrder: 'Pedido Promedio'
};

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
	{ value: 'new', label: 'Nuevos' },
	{ value: 'preparing', label: 'En Preparación' },
	{ value: 'ready', label: 'Listos' },
	{ value: 'delivered', label: 'Entregados' },
	{ value: 'cancelled', label: 'Cancelado' }
]);

// Statistics - highlighted card uses primary in light, overridden to purple in .dark
const stats = computed(() => [
	{
		label: 'totalOrders',
		value: orders.value.length,
		icon: 'ri-shopping-cart-line',
		color: '#CC5500', // primary for light
		bgColor: 'rgba(255, 107, 0, 0.12)',
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
	const order = orders.value.find((o) => o.id === orderId);
	if (!order) return;
	const fromStatus = normalizeOwnerStatus(order.status);
	const toStatus = normalizeOwnerStatus(newStatus);
	if (!canTransition(fromStatus, toStatus, 'owner')) {
		console.error('Invalid order state transition:', fromStatus, '→', toStatus);
		// Show error toast: t('invalidStatusTransition')
		return;
	}
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

.dark .orders-container {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
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
    
    background: var(--color-card);
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    padding: 1rem;
    margin-bottom: 2rem;
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
    font-family: 'Chewy', cursive;
    color: #FF6B00;
    margin: 0;
    line-height: 1;
}

.dark .header-title {
    color: #FB923C;
}

.header-subtitle {
    color: #475569;
    font-size: 1.25rem;
    font-weight: 400;
    margin: 0.25rem 0 0 0;
    user-select: none;
}

.dark .header-subtitle {
    color: #cbd5e1;
}

.order-count {
    margin-left: 0.5rem;
    color: #8b5cf6;
    font-weight: 500;
}

.dark .order-count {
    color: #a855f7;
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

/* Light: primary/secondary for text and light primary surfaces */
.search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #CC5500;
}

.search-input {
    width: 100%;
    padding: 0.625rem 0.75rem 0.625rem 2.5rem;
    background: #FFEDD5;
    border: 1px solid #FDBA74;
    border-radius: 0.75rem;
    color: #1e293b;
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.search-input::placeholder {
    color: #6B7280;
}

.search-input:focus {
    outline: none;
    border-color: #FF6B00;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.15);
}

.search-clear-button {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6B7280;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
}

.search-clear-button:hover {
    color: #CC5500;
}

/* Dark: search bar */
.dark .search-icon {
    color: #94a3b8;
}

.dark .search-input {
    background: #1e293b;
    border-color: #475569;
    color: #f1f5f9;
}

.dark .search-input::placeholder {
    color: #94a3b8;
}

.dark .search-input:focus {
    border-color: #a855f7;
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
}

.dark .search-clear-button {
    color: #94a3b8;
}

.dark .search-clear-button:hover {
    color: #cbd5e1;
}

/* Filter Container */
.filter-container {
    position: relative;
}

/* Light: filter bar - light primary bg, secondary/primary text */
.filter-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    background: #FFEDD5;
    border: 1px solid #FDBA74;
    color: #1e293b;
    border-radius: 0.75rem;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.filter-button:hover {
    background: #FED7AA;
    border-color: #FF6B00;
    color: #CC5500;
}

.filter-button:focus-visible {
    outline: 2px solid #FF6B00;
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

.dark .filter-button {
    background: #334155;
    border-color: #475569;
    color: #cbd5e1;
}

.dark .filter-button:hover {
    background: #475569;
    border-color: #64748b;
}

/* Filter Dropdown - light: light primary bg and borders */
.filter-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    width: 20rem;
    background: #FFEDD5;
    border: 1px solid #FDBA74;
    border-radius: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    z-index: 50;
    overflow: hidden;
}

.dark .filter-dropdown {
    background: #1e293b;
    border-color: #334155;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.filter-content {
    padding: 1.25rem;
}

.filter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #FDBA74;
}

.dark .filter-header {
    border-bottom-color: #334155;
}

.filter-title {
    font-size: 1.25rem;
    font-weight: 700;
    font-family: 'Chewy', cursive;
    color: #FF6B00;
    margin: 0;
}

.dark .filter-title {
    color: #FB923C;
}

.filter-reset-button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: #CC5500;
    font-weight: 500;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease;
}

.filter-reset-button:hover {
    color: #FF6B00;
}

.dark .filter-reset-button {
    color: #a855f7;
}

.dark .filter-reset-button:hover {
    color: #c084fc;
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
    background: rgba(255, 107, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
}

.filter-section-icon {
    color: #CC5500;
}

.sort-section-icon-container {
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    background: rgba(255, 107, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
}

.sort-section-icon {
    color: #CC5500;
}

.filter-section-title {
    font-size: 1.125rem;
    font-weight: 600;
    font-family: 'Chewy', cursive;
    color: #FF6B00;
    margin: 0;
}

.dark .filter-section-title {
    color: #FB923C;
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
    border: 1px solid #FDBA74;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #FFF7ED;
}

.status-filter-input:checked + .status-filter-label {
    border-color: #FF6B00;
    background: rgba(255, 107, 0, 0.1);
    box-shadow: 0 2px 4px rgba(255, 107, 0, 0.15);
}

.status-filter-label:hover {
    border-color: #FF6B00;
    background: #FFEDD5;
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
    border: 2px solid #FDBA74;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
}

.dark .status-filter-label .status-checkbox-inner {
    border-color: #94a3b8;
}

.status-filter-input:checked + .status-filter-label .status-checkbox-inner {
    border-color: #FF6B00;
    background-color: #FF6B00;
    border-width: 4px;
}

.status-label {
    font-weight: 500;
    color: #1e293b;
}

.status-filter-input:checked + .status-filter-label .status-label {
    color: #CC5500;
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

.dark .badge-blue {
    background: rgba(59, 130, 246, 0.2);
    color: #60a5fa;
}

.dark .badge-purple {
    background: rgba(139, 92, 246, 0.2);
    color: #a855f7;
}

.dark .badge-cyan {
    background: rgba(6, 182, 212, 0.2);
    color: #22d3ee;
}

.dark .badge-green {
    background: rgba(16, 185, 129, 0.2);
    color: #34d399;
}

.dark .badge-red {
    background: rgba(239, 68, 68, 0.2);
    color: #f87171;
}

.dark .badge-gray {
    background: rgba(148, 163, 184, 0.2);
    color: #cbd5e1;
}

.dark .status-filter-label {
    border-color: #334155;
    background: #1e293b;
}

.dark .status-filter-label:hover {
    border-color: #475569;
    background: #334155;
}

.dark .status-filter-input:checked + .status-filter-label {
    border-color: #8b5cf6;
    background: rgba(139, 92, 246, 0.2);
}

.dark .status-label {
    color: #cbd5e1;
}

.dark .status-filter-input:checked + .status-filter-label .status-label {
    color: #f1f5f9;
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
    color: #CC5500;
    pointer-events: none;
}

.dark .sort-dropdown-icon {
    color: #94a3b8;
}

.sort-select {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 1rem;
    background: #FFEDD5;
    border: 2px solid #FDBA74;
    border-radius: 0.75rem;
    color: #1e293b;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    appearance: none;
}

.sort-select:focus {
    outline: none;
    border-color: #FF6B00;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.15);
}

.dark .sort-select {
    background: #1e293b;
    border-color: #334155;
    color: #f1f5f9;
}

.dark .sort-select:focus {
    border-color: #a855f7;
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
}

.sort-indicators {
    display: flex;
    gap: 1rem;
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: #6B7280;
}

.sort-indicator {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.dark .sort-indicators {
    color: #94a3b8;
}

/* Filter Actions - light: primary button, secondary text */
.filter-actions {
    padding-top: 1rem;
    border-top: 1px solid #FDBA74;
}

.apply-filters-button {
    width: 100%;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #FF6B00 0%, #E65F00 100%);
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
    box-shadow: 0 4px 6px rgba(255, 107, 0, 0.3);
}

.apply-filters-button:hover {
    box-shadow: 0 8px 12px rgba(255, 107, 0, 0.4);
    transform: translateY(-1px);
}

.filter-stats {
    font-size: 0.75rem;
    color: #6B7280;
    text-align: center;
    margin: 0.75rem 0 0 0;
}

.dark .filter-actions {
    border-top-color: #334155;
}

.dark .apply-filters-button {
    background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%);
    box-shadow: 0 4px 6px rgba(168, 85, 247, 0.3);
}

.dark .apply-filters-button:hover {
    box-shadow: 0 8px 12px rgba(168, 85, 247, 0.4);
}

.dark .filter-stats {
    color: #94a3b8;
}

/* Refresh Button - light: primary orange; dark: purple */
.refresh-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.5rem;
    background: linear-gradient(135deg, #FF6B00 0%, #E65F00 100%);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(255, 107, 0, 0.3);
}

.refresh-button:hover:not(:disabled) {
    box-shadow: 0 8px 12px rgba(255, 107, 0, 0.4);
    transform: translateY(-1px);
}

.refresh-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.dark .refresh-button {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);
}

.dark .refresh-button:hover:not(:disabled) {
    box-shadow: 0 8px 12px rgba(139, 92, 246, 0.4);
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

/* Status Tabs Container - light: light primary bg */
.status-tabs-container {
    background: #FFEDD5;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
    border: 1px solid #FDBA74;
    padding: 1rem;
    margin-bottom: 2rem;
}

.dark .status-tabs-container {
    background: #1e293b;
    border-color: #334155;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

.status-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #FDBA74;
}

.dark .status-tabs {
    border-bottom-color: #334155;
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
    outline: 2px solid #FF6B00;
    outline-offset: 2px;
}

.status-tab-active {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
    border-color: #FF6B00;
    background: linear-gradient(135deg, #FF6B00 0%, #E65F00 100%);
    color: white;
}

.status-tab-inactive {
    color: #475569;
    background: transparent;
    border-color: transparent;
}

.status-tab-inactive:hover {
    border-color: #FDBA74;
    background: var(--color-app-bg);
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
    background: rgba(255, 255, 255, 0.25);
    color: white;
}

.status-tab-count-inactive {
    background: #FED7AA;
    color: #1e293b;
}

.dark .status-tab-active {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    border-color: #8b5cf6;
    color: white;
}

.dark .status-tab-inactive {
    color: #cbd5e1;
}

.dark .status-tab-inactive:hover {
    border-color: #475569;
    background: #1e293b;
}

.dark .status-tab-count-inactive {
    background: #475569;
    color: white;
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
    border: 1px solid #FDBA74;
    background: var(--color-app-bg);
}

.stat-card.highlighted {
    background: linear-gradient(135deg, rgba(255, 107, 0, 0.12) 0%, rgba(230, 95, 0, 0.12) 100%);
    border-color: #FF6B00;
}

.dark .stat-card {
    border-color: #334155;
    background: #1e293b;
}

.dark .stat-card.highlighted {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
    border-color: #8b5cf6;
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

.dark .stat-label {
    color: #94a3b8;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0.25rem 0 0 0;
}

.dark .stat-value {
    color: #f1f5f9;
}

.stat-icon-container {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-icon-container-highlighted {
    background-color: rgba(255, 107, 0, 0.12);
}

.stat-icon {
    font-size: 1.25rem;
}

.stat-icon-highlighted {
    color: #CC5500;
}

.dark .stat-icon-container-highlighted {
    background-color: rgba(139, 92, 246, 0.2);
}

.dark .stat-icon-highlighted {
    color: #8b5cf6;
}

/* Loading Skeleton */
.loading-skeleton {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.skeleton-card {
    background: var(--color-card);
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeleton-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.skeleton-line {
    height: 1rem;
    background: #FFEDD5;
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
    background: #FFEDD5;
    border-radius: 0.5rem;
    width: 6rem;
}

.dark .skeleton-line,
.dark .skeleton-title,
.dark .skeleton-badge {
    background: #334155;
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
    font-family: 'Chewy', cursive;
    color: #FF6B00;
    margin: 0 0 0.5rem 0;
}

.dark .empty-state-title {
    color: #FB923C;
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

.dark .empty-state-icon {
    color: #475569;
}

.dark .empty-state-title {
    color: #cbd5e1;
}

.dark .empty-state-description {
    color: #94a3b8;
}

.dark .empty-state-action-button {
    background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%);
    box-shadow: 0 4px 6px rgba(168, 85, 247, 0.3);
}

.dark .empty-state-action-button:hover {
    box-shadow: 0 8px 12px rgba(168, 85, 247, 0.4);
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
    background: var(--color-card);
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

.dark .pagination {
    border-top-color: #334155;
}

.dark .pagination-info {
    color: #94a3b8;
}

.dark .pagination-button {
    background: #1e293b;
    border-color: #475569;
    color: #cbd5e1;
}

.dark .pagination-button:hover:not(.disabled) {
    background: #334155;
    border-color: #64748b;
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
        background: var(--color-card);
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