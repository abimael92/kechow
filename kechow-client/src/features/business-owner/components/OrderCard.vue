<template>
	<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
		<div class="flex justify-between items-start mb-4">
			<div class="flex items-start space-x-4">
				<div
					class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"
				>
					<i
						class="ri-restaurant-line text-orange-600 text-lg w-6 h-6 flex items-center justify-center"
					></i>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 text-lg">#{{ order.id }}</h3>
					<p class="text-white">{{ order.customerName }}</p>
					<p class="text-sm text-gray-500">
						{{ formatTimeAgo(order.createdAt) }} • {{ order.phone }}
					</p>
					<p
						v-if="order.specialInstructions"
						class="text-sm text-orange-600 mt-1"
					>
						<i class="ri-information-line mr-1"></i
						>{{ order.specialInstructions }}
					</p>
				</div>
			</div>
			<div class="text-right">
				<span
					:class="statusClasses"
					class="px-3 py-1 rounded-full text-sm font-medium"
				>
					{{ $t('status' + order.status) }}
				</span>
				<p class="font-bold text-xl text-gray-900 mt-2">
					${{ order.totalAmount.toFixed(2) }}
				</p>
				<p class="text-sm text-gray-500 capitalize">
					{{ order.paymentMethod }} • {{ order.paymentStatus }}
				</p>
			</div>
		</div>

		<div class="mb-4">
			<h4 class="font-medium text-gray-900 mb-2">{{ $t('orderItems') }}</h4>
			<div class="flex flex-wrap gap-2">
				<span
					v-for="item in order.items"
					:key="item.id"
					class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
				>
					{{ item.name }} (x{{ item.quantity }})
				</span>
			</div>
		</div>

		<div class="mb-4 p-3 bg-gray-50 rounded-lg">
			<p class="text-sm text-white">
				<i
					class="ri-map-pin-line mr-2 w-4 h-4 flex items-center justify-center inline"
				></i>
				{{ order.address }}
			</p>
		</div>

		<div class="flex justify-between items-center">
			<div class="flex space-x-2">
				<button
					@click="callCustomer"
					class="text-white hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
				>
					<i class="ri-phone-line w-5 h-5 flex items-center justify-center"></i>
				</button>
				<button
					@click="messageCustomer"
					class="text-white hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
				>
					<i
						class="ri-message-line w-5 h-5 flex items-center justify-center"
					></i>
				</button>
			</div>
			<div class="flex space-x-3">
				<button
					v-if="order.status === 'new'"
					@click="updateStatus('declined')"
					class="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors cursor-pointer whitespace-nowrap"
				>
					{{ $t('btnDecline') }}
				</button>
				<button
					v-if="order.status === 'new'"
					@click="updateStatus('preparing')"
					class="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
				>
					{{ $t('btnAccept') }}
				</button>
				<button
					v-if="order.status === 'preparing'"
					@click="updateStatus('ready')"
					class="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
				>
					{{ $t('btnMarkReady') }}
				</button>
				<button
					v-if="order.status === 'ready'"
					@click="updateStatus('out_for_delivery')"
					class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
				>
					{{ $t('btnOutForDelivery') }}
				</button>
				<button
					v-if="order.status === 'out_for_delivery'"
					@click="updateStatus('delivered')"
					class="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap"
				>
					{{ $t('btnMarkDelivered') }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Order } from '../types';

const props = defineProps<{ order: Order }>();
const emit = defineEmits<{
	(event: 'update-status', orderId: string, newStatus: string): void;
}>();

const statusClasses = computed(() => {
	const statusMap: Record<string, string> = {
		new: 'bg-blue-100 text-blue-800',
		preparing: 'bg-yellow-100 text-yellow-800',
		ready: 'bg-green-100 text-green-800',
		out_for_delivery: 'bg-purple-100 text-purple-800',
		delivered: 'bg-gray-100 text-gray-800',
		declined: 'bg-red-100 text-red-800',
		cancelled: 'bg-red-100 text-red-800',
	};
	return statusMap[props.order.status] || 'bg-gray-100 text-gray-800';
});

const formatTimeAgo = (date: string) => {
	const now = new Date();
	const orderDate = new Date(date);
	const diffInMinutes = Math.floor(
		(now.getTime() - orderDate.getTime()) / (1000 * 60)
	);

	if (diffInMinutes < 1) return 'Just now';
	if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
	if (diffInMinutes < 1440)
		return `${Math.floor(diffInMinutes / 60)} hours ago`;
	return `${Math.floor(diffInMinutes / 1440)} days ago`;
};

const updateStatus = (newStatus: string) => {
	emit('update-status', props.order.id, newStatus);
};

const callCustomer = () => window.open(`tel:${props.order.phone}`, '_blank');
const messageCustomer = () => window.open(`sms:${props.order.phone}`, '_blank');
</script>
