import api from '@/app/lib/axios';

export interface AdminStats {
	platformRevenue: number;
	activeDeliveries: number;
	systemHealth: string;
}

export interface AdminLedger {
	drivers: { pending: number; paid: number };
	owners: { pending: number; paid: number };
}

export interface ExceptionRow {
	date: string;
	message: string;
	source: string;
}

export async function getAdminStats(): Promise<AdminStats> {
	const res = await api.get<AdminStats>('/admin/stats');
	return res.data;
}

export async function getAdminLedger(): Promise<AdminLedger> {
	const res = await api.get<AdminLedger>('/admin/ledger');
	return res.data;
}

export async function getAdminExceptions(limit = 50): Promise<ExceptionRow[]> {
	const res = await api.get<{ exceptions: ExceptionRow[] }>('/admin/exceptions', { params: { limit } });
	return res.data?.exceptions ?? [];
}

export async function getAdminInTransitDeliveries(): Promise<{ deliveries: unknown[] }> {
	const res = await api.get<{ deliveries: unknown[] }>('/admin/deliveries/in-transit');
	return res.data;
}
