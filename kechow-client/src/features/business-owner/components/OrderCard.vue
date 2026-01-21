<template>
	<div class="bg-white rounded-2xl shadow-md border border-gray-200 p-5 lg:p-6 transition-all duration-300 hover:shadow-lg">
		<!-- Order Header with Progress Indicator -->
		<div class="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-5 gap-4">
			<div class="flex items-start space-x-4 flex-1">
				<!-- Order Icon with Status Badge -->
				<div class="relative">
					<div 
						:class="statusIconColor"
						class="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm"
					>
						<i :class="statusIcon" class="text-white text-xl"></i>
					</div>
					<div 
						v-if="isUrgentOrder"
						class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse"
					>
						<i class="ri-flashlight-line text-xs text-white"></i>
					</div>
				</div>
				
				<!-- Order Info -->
				<div class="flex-1 min-w-0">
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
						<h3 class="font-bold text-gray-900 text-xl truncate">
							#{{ order.id }}
						</h3>
						<div class="flex items-center gap-2">
							<span 
								:class="statusClasses"
								class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
							>
								{{ $t('status' + order.status) }}
							</span>
							<span v-if="order.isDelivery" class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
								<i class="ri-bike-line mr-1"></i>Delivery
							</span>
							<span v-else class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
								<i class="ri-store-line mr-1"></i>Pickup
							</span>
						</div>
					</div>
					
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<i class="ri-user-line text-gray-400 text-sm"></i>
							<span class="font-medium text-gray-900">{{ order.customerName }}</span>
						</div>
						<div class="flex items-center gap-2 text-sm">
							<i class="ri-time-line text-gray-400"></i>
							<span class="text-gray-600">{{ formatTimeAgo(order.createdAt) }}</span>
							<span class="text-gray-300">•</span>
							<i class="ri-phone-line text-gray-400"></i>
							<span class="text-gray-600">{{ formatPhone(order.phone) }}</span>
						</div>
					</div>
					
					<!-- Special Instructions -->
					<div 
						v-if="order.specialInstructions" 
						class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg"
					>
						<div class="flex items-start gap-2">
							<i class="ri-alert-line text-yellow-500 mt-0.5"></i>
							<p class="text-sm text-yellow-700">{{ order.specialInstructions }}</p>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Total Amount & Payment Status -->
			<div class="bg-gray-50 rounded-xl p-4 min-w-[140px] lg:min-w-[160px]">
				<div class="text-center">
					<p class="text-xs text-gray-500 mb-1">TOTAL</p>
					<p class="font-bold text-2xl lg:text-3xl text-gray-900">
						${{ order.totalAmount.toFixed(2) }} <span class="text-sm">MXN</span>
					</p>
					<div class="mt-2">
						<span 
							:class="paymentStatusColor"
							class="px-2 py-1 rounded-full text-xs font-medium capitalize"
						>
							<i :class="paymentIcon" class="mr-1"></i>
							{{ order.paymentStatus }}
						</span>
					</div>
					<p class="text-xs text-gray-500 mt-2">{{ order.paymentMethod }}</p>
				</div>
			</div>
		</div>

		<!-- Order Progress Bar -->
		<div class="mb-6">
			<div class="flex items-center justify-between text-xs text-gray-500 mb-2">
				<span :class="progressLabelClass(1)">Placed</span>
				<span :class="progressLabelClass(2)">Preparing</span>
				<span :class="progressLabelClass(3)">Ready</span>
				<span :class="progressLabelClass(4)" v-if="order.isDelivery">On Route</span>
				<span :class="progressLabelClass(order.isDelivery ? 5 : 4)">Completed</span>
			</div>
			<div class="h-2 bg-gray-200 rounded-full overflow-hidden">
				<div 
					:class="progressBarColor"
					class="h-full transition-all duration-500"
					:style="{ width: progressPercentage + '%' }"
				></div>
			</div>
		</div>

	<!-- Order Items -->
<div class="mb-5">
	<div class="flex items-center justify-between mb-3">
		<h4 class="font-semibold text-gray-900 flex items-center gap-2">
			<i class="ri-shopping-basket-line"></i>
			Order Items ({{ order.items.length }})
		</h4>
		<button 
			@click="toggleItems"
			class="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
		>
			{{ showAllItems ? 'Show Less' : 'Show All' }}
			<i :class="showAllItems ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
		</button>
	</div>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
		<div 
			v-for="item in visibleItems"
			:key="item.id"
			class="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors"
		>
			<div class="flex items-center justify-between">
				<div class="flex-1 min-w-0">
					<p class="font-medium text-gray-900 truncate">{{ item.name }}</p>
					<div class="flex items-center gap-2 mt-1">
						<span class="text-sm text-gray-600">x{{ item.quantity }}</span>
						<span class="text-gray-300">•</span>
						<span class="text-sm font-medium text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</span>
					</div>
					<p v-if="item.specialRequest" class="text-xs text-gray-500 mt-1 italic">
						{{ item.specialRequest }}
					</p>
				</div>
				<div v-if="item.ready" class="ml-3">
					<span class="w-3 h-3 bg-green-500 rounded-full block"></span>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Item Checklist Section -->
<div v-if="order.status === 'preparing' || order.status === 'ready'" class="mb-5">
	<div class="flex items-center justify-between mb-3">
		<h4 class="font-semibold text-gray-900 flex items-center gap-2">
			<i class="ri-checkbox-circle-line"></i>
			Preparation Checklist
			<span class="text-sm font-normal text-gray-500">
				({{ preparedItemsCount }}/{{ order.items.length }})
			</span>
		</h4>
		<button 
			@click="toggleAllItems"
			class="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
		>
			{{ allItemsPrepared ? 'Uncheck All' : 'Check All' }}
			<i :class="allItemsPrepared ? 'ri-checkbox-line' : 'ri-checkbox-blank-line'"></i>
		</button>
	</div>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
		<div 
			v-for="(item, index) in order.items"
			:key="item.id"
			class="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
			@click="toggleItemPrepared(item.id)"
		>
			<div class="flex items-center gap-3 flex-1">
				<div 
					:class="item.prepared ? 'bg-primary-500 border-primary-500' : 'bg-white border-gray-300'"
					class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
				>
					<i v-if="item.prepared" class="ri-check-line text-white text-xs"></i>
				</div>
				<div class="flex-1 min-w-0">
					<p class="font-medium text-gray-900 truncate">{{ item.name }}</p>
					<div class="flex items-center gap-2 mt-1">
						<span class="text-sm text-gray-600">Quantity: {{ item.quantity }}</span>
						<span v-if="item.preparationTime" class="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
							{{ item.preparationTime }} min
						</span>
					</div>
				</div>
			</div>
			<div class="flex items-center gap-2 ml-3">
				<span class="text-sm font-medium text-gray-900">
					${{ (item.price * item.quantity).toFixed(2) }}
				</span>
				<span class="text-xs text-gray-400">#{{ index + 1 }}</span>
			</div>
		</div>
	</div>
</div>

		<!-- Delivery/Address Information -->
	<!-- Delivery Driver Information Section -->
<div v-if="order.status === 'out_for_delivery' || order.status === 'ready'" class="mb-5">
	<div class="flex flex-col sm:flex-row gap-4">
		<!-- Driver Info Card -->
		<div class="flex-1 bg-gradient-to-r from-tertiary-50 to-tertiary-100 rounded-xl border border-tertiary-200 p-4">
			<div class="flex items-start justify-between">
				<div class="flex items-start gap-3 flex-1">
					<div class="w-12 h-12 bg-tertiary-500 rounded-lg flex items-center justify-center flex-shrink-0">
						<i class="ri-user-line text-white text-lg"></i>
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2 mb-1">
							<h5 class="font-semibold text-tertiary-900">Delivery Driver</h5>
							<span v-if="order.driver?.status === 'active'" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
								<i class="ri-circle-fill text-[6px] mr-1"></i>
								Active
							</span>
						</div>
						<p v-if="order.driver" class="text-tertiary-700">
							{{ order.driver.name }}
						</p>
						<p v-else class="text-tertiary-600 text-sm italic">
							No driver assigned yet
						</p>
						<div v-if="order.driver" class="flex items-center gap-3 mt-2">
							<button 
								@click="callDriver"
								class="flex items-center gap-1 text-sm text-tertiary-600 hover:text-tertiary-700"
							>
								<i class="ri-phone-line"></i>
								{{ formatPhone(order.driver.phone) }}
							</button>
							<button 
								@click="messageDriver"
								class="flex items-center gap-1 text-sm text-tertiary-600 hover:text-tertiary-700"
							>
								<i class="ri-message-line"></i>
								Message
							</button>
						</div>
					</div>
				</div>
				<!-- QR Code for Order Pickup -->
				<div class="flex flex-col items-center">
					<div class="w-20 h-20 bg-white p-2 rounded-lg border border-tertiary-300 mb-2">
						<!-- QR Code Placeholder - Replace with actual QR generation -->
						<div class="w-full h-full bg-gradient-to-br from-tertiary-400 to-tertiary-600 rounded flex items-center justify-center">
							<span class="text-white font-bold text-xs">QR</span>
						</div>
					</div>
					<span class="text-xs text-tertiary-700 font-medium">Order #{{ order.id }}</span>
					<span class="text-xs text-tertiary-500">Scan to verify</span>
				</div>
			</div>
			
			<!-- Delivery Code Display -->
			<div v-if="order.deliveryCode" class="mt-4 pt-3 border-t border-tertiary-300">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-tertiary-600">Pickup Code</p>
						<p class="font-bold text-2xl text-tertiary-900 tracking-wider">
							{{ order.deliveryCode }}
						</p>
					</div>
					<button 
						@click="copyDeliveryCode"
						class="px-3 py-1.5 bg-tertiary-500 hover:bg-tertiary-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
					>
						<i class="ri-file-copy-line"></i>
						Copy
					</button>
				</div>
				<p class="text-xs text-tertiary-500 mt-2">
					Give this code to the driver for order verification
				</p>
			</div>
		</div>
		
		<!-- Estimated Delivery Time -->
		<div v-if="order.status === 'out_for_delivery'" class="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl border border-secondary-200 p-4 min-w-[200px]">
			<div class="flex items-center gap-3 mb-3">
				<div class="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center">
					<i class="ri-bike-line text-white"></i>
				</div>
				<div>
					<p class="text-sm text-secondary-600">Estimated Delivery</p>
					<p class="font-bold text-lg text-secondary-900">
						{{ order.estimatedDelivery ? formatDeliveryTime(order.estimatedDelivery) : 'N/A' }}
					</p>
				</div>
			</div>
			<div class="space-y-2">
				<div class="flex items-center justify-between text-sm">
					<span class="text-secondary-600">Driver Rating</span>
					<span class="text-secondary-900 font-medium">
						{{ order.driver?.rating || 'N/A' }} ⭐
					</span>
				</div>
				<div class="flex items-center justify-between text-sm">
					<span class="text-secondary-600">Vehicle</span>
					<span class="text-secondary-900 font-medium">
						{{ order.driver?.vehicle || 'Motorcycle' }}
					</span>
				</div>
			</div>
		</div>
	</div>
</div>

		<!-- Action Buttons -->
		<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-5 border-t border-gray-200">
			<!-- Quick Actions -->
		<!-- Quick Actions -->
<div class="flex items-center gap-2">
	<button
		@click="callCustomer"
		class="flex items-center gap-2 px-4 py-2.5 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg font-medium transition-colors whitespace-nowrap"
		title="Call Customer"
	>
		<i class="ri-phone-line"></i>
		<span class="hidden sm:inline">Call</span>
	</button>
	<button
		@click="messageCustomer"
		class="flex items-center gap-2 px-4 py-2.5 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-lg font-medium transition-colors whitespace-nowrap"
		title="Message Customer"
	>
		<i class="ri-message-line"></i>
		<span class="hidden sm:inline">Message</span>
	</button>
	<button
		@click="printOrder"
		class="flex items-center gap-2 px-4 py-2.5 bg-tertiary-100 hover:bg-tertiary-200 text-tertiary-700 rounded-lg font-medium transition-colors whitespace-nowrap"
		title="Print Order"
	>
		<i class="ri-printer-line"></i>
		<span class="hidden sm:inline">Print</span>
	</button>
	<button
		v-if="order.isDelivery"
		@click="assignDriver"
		class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors whitespace-nowrap"
		title="Assign Driver"
	>
		<i class="ri-user-line"></i>
		<span class="hidden sm:inline">Assign</span>
	</button>
</div>
			
			<!-- Status Control Buttons -->
			<div class="flex flex-wrap gap-2 justify-end">
				<button
					v-if="order.status === 'new'"
					@click="updateStatus('declined')"
					class="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
				>
					<i class="ri-close-line"></i>
					{{ $t('btnDecline') }}
				</button>
				<button
					v-if="order.status === 'new'"
					@click="updateStatus('preparing')"
					class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2 whitespace-nowrap"
				>
					<i class="ri-check-line"></i>
					{{ $t('btnAccept') }}
					<span class="hidden sm:inline">& Start</span>
				</button>
				<button
					v-if="order.status === 'preparing'"
					@click="updateStatus('ready')"
					class="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2 whitespace-nowrap"
				>
					<i class="ri-check-double-line"></i>
					{{ $t('btnMarkReady') }}
				</button>
				<button
					v-if="order.status === 'ready' && order.isDelivery"
					@click="updateStatus('out_for_delivery')"
					class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2 whitespace-nowrap"
				>
					<i class="ri-bike-line"></i>
					{{ $t('btnOutForDelivery') }}
				</button>
				<button
					v-if="order.status === 'ready' && !order.isDelivery"
					@click="updateStatus('delivered')"
					class="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2 whitespace-nowrap"
				>
					<i class="ri-checkbox-circle-line"></i>
					Pickup Complete
				</button>
				<button
					v-if="order.status === 'out_for_delivery'"
					@click="updateStatus('delivered')"
					class="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2 whitespace-nowrap"
				>
					<i class="ri-checkbox-circle-line"></i>
					{{ $t('btnMarkDelivered') }}
				</button>
			</div>
		</div>
		
		<!-- Estimated Time Display -->
		<div v-if="order.estimatedTime" class="mt-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
						<i class="ri-time-line text-gray-600"></i>
					</div>
					<div>
						<p class="text-sm text-gray-600">Estimated Completion</p>
						<p class="font-bold text-gray-900">{{ formatTime(order.estimatedTime) }}</p>
					</div>
				</div>
				<button 
					@click="updateTime"
					class="text-sm text-orange-600 hover:text-orange-700 font-medium"
				>
					Update Time
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Order, OrderItem } from '../types';

// Extend OrderItem to include prepared property
interface ExtendedOrderItem extends OrderItem {
	prepared?: boolean;
	ready?: boolean;
	preparationTime?: number;
	specialRequest?: string;
}

interface ExtendedOrder extends Order {
	items: ExtendedOrderItem[];
	isDelivery?: boolean;
	estimatedTime?: string;
	driver?: {
		name: string;
		phone: string;
		status?: string;
		rating?: number;
		vehicle?: string;
	};
	deliveryCode?: string;
	estimatedDelivery?: string;
}

const props = defineProps<{ 
	order: ExtendedOrder;
}>();
const emit = defineEmits<{
	(event: 'update-status', orderId: string, newStatus: string): void;
	(event: 'update-time', orderId: string): void;
	(event: 'print-order', orderId: string): void;
	(event: 'assign-driver', orderId: string): void;
	(event: 'toggle-item-prepared', orderId: string, itemId: string): void;
	(event: 'toggle-all-items', orderId: string, prepared: boolean): void;
}>();

const showAllItems = ref(false);

// Computed properties
const visibleItems = computed(() => {
	return showAllItems.value 
		? props.order.items 
		: props.order.items.slice(0, 4);
});

const statusClasses = computed(() => {
	const statusMap: Record<string, string> = {
		new: 'bg-blue-100 text-blue-700 border border-blue-200',
		preparing: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
		ready: 'bg-green-100 text-green-700 border border-green-200',
		out_for_delivery: 'bg-purple-100 text-purple-700 border border-purple-200',
		delivered: 'bg-gray-100 text-gray-700 border border-gray-200',
		declined: 'bg-red-100 text-red-700 border border-red-200',
		cancelled: 'bg-red-100 text-red-700 border border-red-200',
	};
	return statusMap[props.order.status] || 'bg-gray-100 text-gray-700 border border-gray-200';
});

const statusIcon = computed(() => {
	const iconMap: Record<string, string> = {
		new: 'ri-timer-line',
		preparing: 'ri-restaurant-line',
		ready: 'ri-checkbox-circle-line',
		out_for_delivery: 'ri-bike-line',
		delivered: 'ri-check-double-line',
		declined: 'ri-close-circle-line',
		cancelled: 'ri-close-circle-line',
	};
	return iconMap[props.order.status] || 'ri-question-line';
});

const statusIconColor = computed(() => {
	const colorMap: Record<string, string> = {
		new: 'bg-gradient-to-br from-blue-500 to-blue-600',
		preparing: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
		ready: 'bg-gradient-to-br from-green-500 to-green-600',
		out_for_delivery: 'bg-gradient-to-br from-purple-500 to-purple-600',
		delivered: 'bg-gradient-to-br from-gray-500 to-gray-600',
		declined: 'bg-gradient-to-br from-red-500 to-red-600',
		cancelled: 'bg-gradient-to-br from-red-500 to-red-600',
	};
	return colorMap[props.order.status] || 'bg-gradient-to-br from-gray-500 to-gray-600';
});

const paymentStatusColor = computed(() => {
	const colorMap: Record<string, string> = {
		paid: 'bg-green-100 text-green-700',
		pending: 'bg-yellow-100 text-yellow-700',
		failed: 'bg-red-100 text-red-700',
		refunded: 'bg-gray-100 text-gray-700',
	};
	return colorMap[props.order.paymentStatus] || 'bg-gray-100 text-gray-700';
});

const paymentIcon = computed(() => {
	const iconMap: Record<string, string> = {
		paid: 'ri-checkbox-circle-line',
		pending: 'ri-time-line',
		failed: 'ri-close-circle-line',
		refunded: 'ri-refresh-line',
	};
	return iconMap[props.order.paymentStatus] || 'ri-question-line';
});

const isUrgentOrder = computed(() => {
	const created = new Date(props.order.createdAt);
	const now = new Date();
	const diffMinutes = (now.getTime() - created.getTime()) / (1000 * 60);
	return diffMinutes > 15 && props.order.status === 'new';
});

const progressPercentage = computed(() => {
	const progressMap: Record<string, number> = {
		new: 20,
		preparing: 40,
		ready: props.order.isDelivery ? 60 : 80,
		out_for_delivery: 80,
		delivered: 100,
		declined: 0,
		cancelled: 0,
	};
	return progressMap[props.order.status] || 0;
});

const progressBarColor = computed(() => {
	const colorMap: Record<string, string> = {
		new: 'bg-blue-500',
		preparing: 'bg-yellow-500',
		ready: 'bg-green-500',
		out_for_delivery: 'bg-purple-500',
		delivered: 'bg-gray-500',
	};
	return colorMap[props.order.status] || 'bg-gray-500';
});

// Methods
const progressLabelClass = (step: number) => {
	const currentStep = progressPercentage.value / (props.order.isDelivery ? 20 : 25);
	return step <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-400';
};

const formatTimeAgo = (date: string) => {
	const now = new Date();
	const orderDate = new Date(date);
	const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));

	if (diffInMinutes < 1) return 'Just now';
	if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
	if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hr ago`;
	return `${Math.floor(diffInMinutes / 1440)} days ago`;
};

const formatPhone = (phone: string) => {
	// Format phone number for display
	return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
};

const formatDistance = (distance?: number) => {
	if (!distance) return 'Nearby';
	return `${distance.toFixed(1)} km`;
};

const formatTime = (time: string) => {
	const date = new Date(time);
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const toggleItems = () => {
	showAllItems.value = !showAllItems.value;
};

const updateStatus = (newStatus: string) => {
	emit('update-status', props.order.id, newStatus);
};

const updateTime = () => {
	emit('update-time', props.order.id);
};

const printOrder = () => {
	emit('print-order', props.order.id);
};

const assignDriver = () => {
	emit('assign-driver', props.order.id);
};

// Add these computed properties
const preparedItemsCount = computed(() => {
	return props.order.items.filter(item => item.prepared).length;
});

const allItemsPrepared = computed(() => {
	return props.order.items.length > 0 && 
		   props.order.items.every(item => item.prepared);
});

// Add these methods
const toggleItemPrepared = (itemId: string) => {
	// Emit event to parent component to update item prepared status
	emit('toggle-item-prepared', props.order.id, itemId);
};

const toggleAllItems = () => {
	// Emit event to toggle all items prepared status
	emit('toggle-all-items', props.order.id, !allItemsPrepared.value);
};

const formatDeliveryTime = (time: string) => {
	const date = new Date(time);
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const callDriver = () => {
	if (props.order.driver?.phone) {
		window.open(`tel:${props.order.driver.phone}`, '_blank');
	}
};

const messageDriver = () => {
	if (props.order.driver?.phone) {
		window.open(`sms:${props.order.driver.phone}`, '_blank');
	}
};

const copyDeliveryCode = () => {
	if (props.order.deliveryCode) {
		navigator.clipboard.writeText(props.order.deliveryCode);
		// You could add a toast notification here
		console.log('Delivery code copied to clipboard');
	}
};

const callCustomer = () => window.open(`tel:${props.order.phone}`, '_blank');
const messageCustomer = () => window.open(`sms:${props.order.phone}`, '_blank');
const openMap = () => {
	// Open in Google Maps
	const address = encodeURIComponent(props.order.address);
	window.open(`https://maps.google.com/?q=${address}`, '_blank');
};
</script>

<style scoped>
/* Smooth transitions */
button, div {
	transition: all 0.2s ease;
}

/* Better hover effects */
button:hover {
	transform: translateY(-1px);
}

/* Improve touch targets on mobile */
@media (max-width: 640px) {
	button {
		min-height: 44px;
		min-width: 44px;
	}
}

/* Responsive text sizing */
@media (max-width: 768px) {
	:deep(.text-xl) {
		font-size: 1.25rem;
	}
	:deep(.text-2xl) {
		font-size: 1.5rem;
	}
	:deep(.text-3xl) {
		font-size: 1.75rem;
	}
}

/* Improve readability on small screens */
@media (max-width: 640px) {
	:deep(.whitespace-nowrap) {
		white-space: normal;
	}
}

/* Loading animation for progress bar */
@keyframes progress-pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.7; }
}

.bg-gradient-to-br {
	background-size: 200% 200%;
	animation: gradient-shift 2s ease infinite;
}

@keyframes gradient-shift {
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
}
</style>