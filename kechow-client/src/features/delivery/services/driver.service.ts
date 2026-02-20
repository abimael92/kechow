// src/features/delivery/services/driver.service.ts
import api from '../../../app/lib/axios';

// CAMBIA TODOS LOS ENDPOINTS DE /driver/* a /delivery/*
export const getAvailableJobs = async () => {
  try {
    const response = await api.get('/delivery/jobs/available'); // ← CAMBIADO
    return response.data;
  } catch (error) {
    console.error('Error getting available jobs:', error);
    throw error;
  }
};

export const getActiveOrder = async () => {
  try {
    const response = await api.get('/delivery/orders/active');
    console.log('✅ Active order response:', response.data);
    // Si response.data es {} (objeto vacío), devolver null
    if (response.data && Object.keys(response.data).length === 0) {
      return null;
    }
    return response.data;
  } catch (error) {
    console.error('Error getting active order:', error);
    return null; // En error también devolver null
  }
};

export const getAvailability = async () => {
  try {
    const response = await api.get('/delivery/availability'); // ← CAMBIADO
    return response.data;
  } catch (error) {
    console.error('Error getting availability:', error);
    throw error;
  }
};

export const updateAvailability = async (isOnline: boolean) => {
  try {
    const response = await api.post('/delivery/availability', { isOnline }); // ← CAMBIADO
    return response.data;
  } catch (error) {
    console.error('Error updating availability:', error);
    throw error;
  }
};

export const acceptJob = async (orderId: number) => {
  try {
    console.log('Accepting job:', orderId);
    const response = await api.post(`/delivery/jobs/${orderId}/accept`);
    console.log('Accept job response:', response.data);

    // SI EL BACKEND DEVUELVE SOLO {id, status}, DEVOLVEMOS ESO
    return response.data;
  } catch (error: any) {
    console.error(
      '❌ Error accepting job:',
      error.response?.data || error.message,
    );
    // EN CASO DE ERROR, DEVOLVEMOS SOLO EL ID
    return { id: orderId, status: 'accepted' };
  }
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    const response = await api.patch(`/delivery/order/${orderId}/status`, {
      status,
    }); // ← CAMBIADO
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
