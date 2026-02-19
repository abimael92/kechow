// src/features/delivery/services/driver.service.ts
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Helper to handle responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

export const getAvailableJobs = async () => {
  const response = await fetch(`${API_BASE_URL}/driver/jobs/available`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

export const getActiveOrder = async () => {
  const response = await fetch(`${API_BASE_URL}/driver/order/active`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

export const getAvailability = async () => {
  const response = await fetch(`${API_BASE_URL}/driver/availability`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json', // <--- ESTO ES VITAL
};

export const updateAvailability = async (isOnline: boolean) => {
  const response = await fetch(`${API_BASE_URL}/driver/availability`, {
    method: 'POST',
    credentials: 'include', // Mantén esto para las cookies de Sanctum
    headers: headers,
    body: JSON.stringify({ isOnline }),
  });
  return handleResponse(response);
};

export const acceptJob = async (orderId: number) => {
  const response = await fetch(
    `${API_BASE_URL}/driver/jobs/${orderId}/accept`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return handleResponse(response);
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const response = await fetch(
    `${API_BASE_URL}/driver/order/${orderId}/status`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    },
  );
  return handleResponse(response);
};
