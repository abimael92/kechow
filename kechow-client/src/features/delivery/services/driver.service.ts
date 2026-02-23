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

export const updateOrderStatus = async (orderId: number, status: string) => {
  const response = await api.patch(`/delivery/orders/${orderId}/status`, {
    status,
  });
  return response.data;
};
