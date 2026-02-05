/**
 * Driver API Service - Integrates with Laravel Driver endpoints
 */

import { api } from '@app/lib/axios';

const API = '/api';

export interface DriverOrderDto {
	id: string;
	orderNumber: string;
	status: string;
	restaurant: {
		id: string;
		name: string;
		address: string;
		phone: string;
		location: { latitude: number; longitude: number };
	};
	customer: {
		id: string;
		name: string;
		address: string;
		phone: string;
		location: { latitude: number; longitude: number };
	};
	items: Array<{ id: string; name: string; quantity: number }>;
	paymentMethod: string;
	amount: number;
	fee: number;
	distance: number;
	estimatedTime: number;
	createdAt: string;
	delivery_notes?: string;
}

export interface DriverStatsDto {
	isOnline?: boolean;
	today: { deliveries: number; earnings: number; distance: number; hours: number };
	week: { deliveries: number; earnings: number; distance: number; hours: number };
	month: { deliveries: number; earnings: number; distance: number; hours: number };
	totalEarnings: number;
	averagePerDelivery: number;
	rating: number;
	totalDeliveries: number;
}

export async function getAvailableOrders(): Promise<DriverOrderDto[]> {
	const { data } = await api.get<DriverOrderDto[]>(`${API}/driver/available-orders`);
	return data;
}

export async function getCurrentOrder(): Promise<DriverOrderDto | null> {
	const { data } = await api.get<{ order: DriverOrderDto | null }>(`${API}/driver/current-order`);
	return data.order;
}

export async function acceptOrder(orderId: string): Promise<unknown> {
	const { data } = await api.post(`${API}/orders/${orderId}/accept`);
	return data;
}

export async function startDelivery(orderId: string): Promise<unknown> {
	const { data } = await api.post(`${API}/orders/${orderId}/start-delivery`);
	return data;
}

export async function completeDelivery(orderId: string): Promise<unknown> {
	const { data } = await api.post(`${API}/orders/${orderId}/complete-delivery`);
	return data;
}

export async function updateDriverLocation(lat: number, lng: number): Promise<void> {
	await api.put(`${API}/driver/location`, { latitude: lat, longitude: lng });
}

export async function toggleDriverStatus(): Promise<{ isOnline: boolean; status: string }> {
	const { data } = await api.patch<{ isOnline: boolean; status: string }>(`${API}/driver/status`);
	return data;
}

export async function getDriverStats(): Promise<DriverStatsDto> {
	const { data } = await api.get<DriverStatsDto>(`${API}/driver/stats`);
	return data;
}
