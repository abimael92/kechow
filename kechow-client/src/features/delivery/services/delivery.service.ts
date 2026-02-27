// src/features/delivery/services/delivery.service.ts
import api from '../../../app/lib/axios';

// Availability
export const getAvailability = async () => {
  try {
    console.log('🔍 Fetching availability from: /delivery/availability');
    const response = await api.get('/delivery/availability'); // CAMBIADO
    return response.data;
  } catch (error) {
    console.error('Error getting availability:', error);
    throw error;
  }
};

export const updateAvailability = async (isOnline: boolean) => {
  try {
    const response = await api.post('/delivery/availability', { isOnline }); // CAMBIADO
    return response.data;
  } catch (error) {
    console.error('Error updating availability:', error);
    throw error;
  }
};

// Jobs
export const getAvailableJobs = async () => {
  try {
    console.log('🔍 Fetching available jobs from: /delivery/jobs/available');
    const response = await api.get('/delivery/jobs/available'); // CAMBIADO
    return response.data;
  } catch (error) {
    console.error('Error getting available jobs:', error);
    return { jobs: [] };
  }
};

// Active order
export const getActiveOrder = async () => {
  try {
    console.log('🔍 Fetching active order from: /delivery/orders/active'); // CAMBIADO
    const response = await api.get('/delivery/orders/active'); // CAMBIADO
    console.log('✅ Active order response:', response.data);
    return response.data;
  } catch (error) {
    console.warn('No active order found');
    return null;
  }
};

// Accept order
export const acceptOrder = async (orderId: string) => {
  try {
    console.log('📤 Accepting order:', orderId);
    const response = await api.post(`/delivery/jobs/${orderId}/accept`); // CAMBIADO
    console.log('✅ Order accepted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error accepting order:', error);
    throw error;
  }
};

// Reject order
export const rejectOrder = async (orderId: string) => {
  try {
    const response = await api.post(`/delivery/jobs/${orderId}/reject`); // CAMBIADO
    return response.data;
  } catch (error) {
    console.error('Error rejecting order:', error);
    throw error;
  }
};

// Update status
export const updateDeliveryStatus = async (orderId: string, status: string) => {
  try {
    const response = await api.patch(`/delivery/orders/${orderId}/status`, {
      status,
    }); // CAMBIADO
    return response.data;
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};

// Settings
export const getDeliverySettings = async () => {
  try {
    const response = await api.get('/delivery/settings'); // CAMBIADO
    return response.data;
  } catch (error) {
    console.warn('Settings endpoint not available, using defaults');
    return {
      vehicleType: 'motorcycle',
      maxDistance: 10,
      autoAccept: false,
      notificationsEnabled: true,
    };
  }
};

// Earnings
export const getEarningsSummary = async () => {
  try {
    const response = await api.get('/delivery/earnings'); // CAMBIADO
    return response.data;
  } catch (error) {
    console.warn('Earnings endpoint not available');
    return {
      today: 0,
      week: 0,
      month: 0,
      total: 0,
    };
  }
};
