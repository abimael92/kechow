// src/features/delivery/services/delivery.service.ts
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

export const getAvailability = async () => {
  const response = await fetch(`${API_BASE_URL}/delivery/availability`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

export const updateAvailability = async (isOnline: boolean) => {
  const response = await fetch(`${API_BASE_URL}/delivery/availability`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isOnline }),
  });
  return handleResponse(response);
};

export const getAvailableJobs = async () => {
  const response = await fetch(`${API_BASE_URL}/delivery/jobs/available`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

export const getActiveOrder = async () => {
  const response = await fetch(`${API_BASE_URL}/delivery/order/active`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

export const acceptOrder = async (orderId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/delivery/orders/${orderId}/accept`,
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

export const rejectOrder = async (orderId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/delivery/orders/${orderId}/reject`,
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

export const updateDeliveryStatus = async (orderId: string, status: string) => {
  const response = await fetch(
    `${API_BASE_URL}/delivery/orders/${orderId}/status`,
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

export const getDeliveryProgress = async (orderId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/delivery/orders/${orderId}/progress`,
    {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return handleResponse(response);
};

export const updateLocation = async (orderId: string, location: any) => {
  const response = await fetch(
    `${API_BASE_URL}/delivery/orders/${orderId}/location`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    },
  );
  return handleResponse(response);
};

// This is a helper, not an API call
export const getCurrentLocation = (order: any, step: number) => {
  return {
    latitude: order?.restaurant?.location?.latitude || 0,
    longitude: order?.restaurant?.location?.longitude || 0,
    timestamp: new Date().toISOString(),
  };
};

export const getEarningsSummary = async () => {
  const response = await fetch(`${API_BASE_URL}/delivery/earnings`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

export const getDeliverySettings = async () => {
  const response = await fetch(`${API_BASE_URL}/delivery/settings`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

export const updateDeliverySettings = async (settings: any) => {
  const response = await fetch(`${API_BASE_URL}/delivery/settings`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  return handleResponse(response);
};
