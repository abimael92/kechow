// Import YOUR custom configured axios instance that already has the token interceptor
import { api } from '../../../app/lib/axios';

export const getAvailability = async () => {
  const response = await api.get('/delivery/availability');
  return response.data;
};

export const updateAvailability = async (isOnline: boolean) => {
  const response = await api.post('/delivery/availability', { isOnline });
  return response.data;
};

export const getAvailableJobs = async () => {
  const response = await api.get('/delivery/jobs/available');
  return response.data;
};

export const getActiveOrder = async () => {
  const response = await api.get('/delivery/orders/active');
  return response.data;
};

export const acceptJob = async (orderId: number) => {
  const response = await api.post(`/delivery/jobs/${orderId}/accept`);
  return response.data;
};

export const rejectJob = async (orderId: number) => {
  const response = await api.post(`/delivery/jobs/${orderId}/reject`);
  return response.data;
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const response = await api.patch(`/delivery/orders/${orderId}/status`, {
    status,
  });
  return response.data;
};

export const getCompletedOrders = async (page = 1, perPage = 15) => {
  const response = await api.get('/delivery/orders/completed', {
    params: { page, per_page: perPage },
  });
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/delivery/stats');
  return response.data;
};

export const getEarnings = async (period?: 'week' | 'month') => {
  const response = await api.get('/delivery/earnings', {
    params: period ? { period } : undefined,
  });
  return response.data;
};

export const getOrderDetail = async (orderId: number) => {
  const response = await api.get(`/delivery/orders/${orderId}`);
  return response.data;
};
