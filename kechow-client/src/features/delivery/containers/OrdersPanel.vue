<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDeliveryStore } from '../store/delivery.store';

const router = useRouter();
const deliveryStore = useDeliveryStore();

// State
const activeTab = ref(0);
const showFilters = ref(false);
const expandedOrders = ref(new Set<string>());
const isRefreshing = ref(false);
const isLoading = ref(false);
const selectedFilters = ref<string[]>([]);
const toasts = ref<Array<{
	id: number;
	type: 'success' | 'error' | 'info' | 'warning';
	title: string;
	message: string;
}>>([]);

// Tabs configuration
const tabs = [
	{ label: 'Disponibles', key: 'available', icon: 'ri-store-line' },
	{ label: 'Activos', key: 'active', icon: 'ri-motorbike-line' },
	{ label: 'Completados', key: 'completed', icon: 'ri-check-line' },
];

// Filters
const filters = [
	{ label: 'Cercanos', value: 'nearby', icon: 'ri-map-pin-line' },
	{ label: 'Alta prioridad', value: 'priority', icon: 'ri-flashlight-line' },
	{ label: 'Efectivo', value: 'cash', icon: 'ri-money-dollar-circle-line' },
	{ label: 'Tarjeta', value: 'card', icon: 'ri-bank-card-line' },
];

// Computed
const getGreeting = computed(() => {
	const hour = new Date().getHours();
	if (hour < 12) return 'Buenos días';
	if (hour < 18) return 'Buenas tardes';
	return 'Buenas noches';
});

const activeFilterCount = computed(() => selectedFilters.value.length);

const avgDeliveryTime = computed(() => {
	const completed = deliveryStore.completedOrders;
	if (!completed.length) return 0;
	const total = completed.reduce((sum, order) => sum + (order.estimatedTime || 0), 0);
	return Math.round(total / completed.length);
});

const todayEarnings = computed(() => {
	const today = new Date().toDateString();
	const todayOrders = deliveryStore.completedOrders.filter(
		order => new Date((order as any).completedAt || order.createdAt).toDateString() === today
	);
	return todayOrders.reduce((sum, order) => sum + order.amount + ((order as any).fee || 0), 0).toFixed(2);
});

const driverRating = computed(() => {
	// You might want to get this from a driver store or user profile
	return '4.8';
});

const todayDistance = computed(() => {
	const today = new Date().toDateString();
	const todayOrders = deliveryStore.completedOrders.filter(
		order => new Date(((order as any).completedAt) || order.createdAt).toDateString() === today
	);
	return todayOrders.reduce((sum, order) => sum + order.distance, 0).toFixed(1);
});

const availableOrders = computed(() => 
	deliveryStore.availableJobs.map(job => mapOrderToViewModel(job.order, 'available', 'Disponible'))
);

const activeOrders = computed(() => 
	deliveryStore.activeOrder ? [mapOrderToViewModel(deliveryStore.activeOrder, 'active', 'En curso')] : []
);

const completedOrdersList = computed(() => 
	deliveryStore.completedOrders.map(order => mapOrderToViewModel(order, 'completed', 'Entregado'))
);

const filteredOrders = computed(() => {
	let orders: any[] = [];
	const key = tabs[activeTab.value].key;
	
	if (key === 'available') orders = availableOrders.value;
	else if (key === 'active') orders = activeOrders.value;
	else orders = completedOrdersList.value;

	// Apply filters
	if (selectedFilters.value.length > 0) {
		orders = orders.filter(order => {
			return selectedFilters.value.every(filter => {
				if (filter === 'nearby') return parseFloat(order.distance) <= 3;
				if (filter === 'priority') return order.priority;
				if (filter === 'cash') return order.paymentMethod?.toLowerCase() === 'efectivo';
				if (filter === 'card') return ['tarjeta', 'crédito', 'débito'].some(
					method => order.paymentMethod?.toLowerCase().includes(method)
				);
				return true;
			});
		});
	}

	return orders;
});

const tabCount = (key: string) => {
	if (key === 'available') return availableOrders.value.length;
	if (key === 'active') return activeOrders.value.length;
	return completedOrdersList.value.length;
};

const emptyState = computed(() => {
	const key = tabs[activeTab.value].key;
	
	if (key === 'available') {
		return {
			title: 'No hay pedidos disponibles',
			message: deliveryStore.isOnline 
				? 'En este momento no hay pedidos cercanos. Vuelve a intentar en unos minutos.'
				: 'Activa tu disponibilidad en el panel principal para recibir pedidos.',
			action: !deliveryStore.isOnline ? {
				label: 'Activar disponibilidad',
				handler: () => router.push('/driver/dashboard')
			} : null
		};
	}
	
	if (key === 'active') {
		return {
			title: 'Sin entregas activas',
			message: 'No tienes ninguna entrega en curso en este momento.',
			action: availableOrders.value.length > 0 ? {
				label: 'Ver pedidos disponibles',
				handler: () => { activeTab.value = 0; }
			} : null
		};
	}
	
	return {
		title: 'No hay entregas completadas',
		message: 'Aún no has completado ninguna entrega. Los pedidos entregados aparecerán aquí.',
		action: null
	};
});

// Methods
const mapOrderToViewModel = (order: any, status: string, statusLabel: string) => ({
	id: order.id,
	number: order.orderNumber,
	restaurant: order.restaurant?.name || 'Restaurante',
	customer: order.customer?.name || 'Cliente',
	amount: ((order.amount || 0) + (order.fee || 0)).toFixed(2),
	items: order.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0,
	itemsList: order.items || [],
	paymentMethod: order.paymentMethod || 'Efectivo',
	distance: `${order.distance || 0} km`,
	eta: `${order.estimatedTime || 0} min`,
	pickup: order.restaurant?.address || 'Dirección de recogida',
	dropoff: order.customer?.address || 'Dirección de entrega',
	instructions: order.specialInstructions || '',
	priority: order.priority || false,
	status,
	statusLabel,
	createdAt: order.createdAt || new Date(),
	reviewed: order.reviewed || false
});

const getTabIcon = (key: string) => {
	const tab = tabs.find(t => t.key === key);
	return tab?.icon || '';
};

const getTabAnimation = (index: number) => {
	const animations = ['animate-slideInLeft', 'animate-slideInUp', 'animate-slideInRight'];
	return animations[index] || '';
};

const getStatusBadgeClass = (status: string) => {
	const classes: Record<string, string> = {
		available: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
		active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
		completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
	};
	return classes[status] || '';
};

const getToastIcon = (type: string) => {
	const icons: Record<string, string> = {
		success: 'ri-checkbox-circle-line text-green-500',
		error: 'ri-error-warning-line text-red-500',
		info: 'ri-information-line text-blue-500',
		warning: 'ri-alert-line text-yellow-500'
	};
	return icons[type] || icons.info;
};

const timeAgo = (date: Date) => {
	try {
		return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
	} catch (error) {
		return 'recientemente';
	}
};

const toggleExpand = (orderId: string) => {
	const newExpanded = new Set(expandedOrders.value);
	if (newExpanded.has(orderId)) {
		newExpanded.delete(orderId);
	} else {
		newExpanded.add(orderId);
	}
	expandedOrders.value = newExpanded;
};

const isExpanded = (orderId: string) => expandedOrders.value.has(orderId);

const toggleFilter = (filter: string) => {
	if (selectedFilters.value.includes(filter)) {
		selectedFilters.value = selectedFilters.value.filter(f => f !== filter);
	} else {
		selectedFilters.value = [...selectedFilters.value, filter];
	}
};

const refreshData = async () => {
	if (isRefreshing.value) return;
	
	isRefreshing.value = true;
	try {
		await Promise.all([
			deliveryStore.loadAvailableJobs(),
			deliveryStore.loadCompletedOrdersFromStorage()
		]);
		showToast('success', 'Actualizado', 'Los datos se han actualizado correctamente');
	} catch (error) {
		console.error('Refresh error:', error);
		showToast('error', 'Error', 'No se pudo actualizar los datos');
	} finally {
		setTimeout(() => {
			isRefreshing.value = false;
		}, 1000);
	}
};

const handleAcceptOrder = async (orderId: string) => {
	try {
		await deliveryStore.acceptDeliveryOrder(orderId);
		showToast('success', 'Pedido aceptado', 'Serás redirigido a la entrega');
		setTimeout(() => {
			router.push(`/delivery/live/${orderId}`);
		}, 1500);
	} catch (error) {
		console.error('Accept error:', error);
		showToast('error', 'Error', 'No se pudo aceptar el pedido');
	}
};

const handleRejectOrder = async (orderId: string) => {
	if (confirm('¿Estás seguro de rechazar este pedido?')) {
		try {
			await deliveryStore.rejectDeliveryOrder(orderId);
			showToast('info', 'Pedido rechazado', 'El pedido ha sido rechazado');
		} catch (error) {
			console.error('Reject error:', error);
			showToast('error', 'Error', 'No se pudo rechazar el pedido');
		}
	}
};

const handleContactCustomer = (orderId: string) => {
	const order = deliveryStore.activeOrder;
	if (order?.customer?.phone) {
		window.location.href = `tel:${order.customer.phone}`;
	} else {
		showToast('warning', 'Sin teléfono', 'No hay número de teléfono disponible');
	}
};

const handleViewDetails = (orderId: string) => {
	router.push(`/delivery/details/${orderId}`);
};

const handleRateOrder = (orderId: string) => {
	// Emit event or show rating modal
	console.log('Rate order:', orderId);
	showToast('info', 'Calificar', 'Función de calificación próximamente');
};

const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Toast management
let toastId = 0;
const showToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
	const id = ++toastId;
	toasts.value.push({ id, type, title, message });
	
	setTimeout(() => {
		removeToast(id);
	}, 5000);
};

const removeToast = (id: number) => {
	toasts.value = toasts.value.filter(t => t.id !== id);
};

// Auto-refresh
let refreshInterval: ReturnType<typeof setInterval>;

onMounted(async () => {
	isLoading.value = true;
	try {
		await deliveryStore.initialize();
		await deliveryStore.loadCompletedOrdersFromStorage();
		if (deliveryStore.isOnline) {
			await deliveryStore.loadAvailableJobs();
		}
		
		// Set up auto-refresh for available orders
		refreshInterval = setInterval(() => {
			if (deliveryStore.isOnline && activeTab.value === 0) {
				deliveryStore.loadAvailableJobs();
			}
		}, 30000);
	} catch (error) {
		console.error('Failed to initialize orders view:', error);
		showToast('error', 'Error de carga', 'No se pudieron cargar los pedidos');
	} finally {
		isLoading.value = false;
	}
});

onUnmounted(() => {
	if (refreshInterval) {
		clearInterval(refreshInterval);
	}
});

// Watch for online status changes
watch(() => deliveryStore.isOnline, async (isOnline) => {
	if (isOnline && activeTab.value === 0) {
		await deliveryStore.loadAvailableJobs();
	}
});
</script>