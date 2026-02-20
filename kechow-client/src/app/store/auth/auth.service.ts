// src/features/delivery/services/auth.service.ts
import api from '../../../app/lib/axios';

// Función para CSRF cookie (no bloqueante)
const ensureCsrfCookie = async () => {
  try {
    await api.get('/sanctum/csrf-cookie');
    if (import.meta.env.DEV) {
      console.log('✅ CSRF cookie obtenida');
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('⚠️ CSRF cookie failed (continuando en modo desarrollo)');
    }
    // No lanzamos error para no bloquear el login
  }
};

// Login
export const login = async (payload: { email: string; password: string }) => {
  try {
    await ensureCsrfCookie();

    const response = await api.post('/login', payload);

    if (import.meta.env.DEV) {
      console.log('✅ Login exitoso');
    }

    return response.data;
  } catch (error: any) {
    if (import.meta.env.DEV) {
      console.error(
        '❌ Login failed:',
        error.response?.status || error.message,
      );

      // MODO DEMO para desarrollo - SOLO cuando el backend falla
      if (
        payload.email === 'demo@example.com' &&
        payload.password === 'password'
      ) {
        console.log('🔧 Usando MODO DEMO - login simulado');
        return {
          user: {
            id: 1,
            name: 'Demo Driver',
            email: payload.email,
            role: 'delivery',
          },
          token: 'demo_token_' + Date.now(),
        };
      }
    }
    throw error;
  }
};

// Register
export const register = async (payload: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  restaurant_name?: string;
}) => {
  try {
    await ensureCsrfCookie();

    const response = await api.post('/register', payload);

    if (import.meta.env.DEV) {
      console.log('✅ Registro exitoso');
    }

    return response.data;
  } catch (error: any) {
    if (import.meta.env.DEV) {
      console.error(
        '❌ Register failed:',
        error.response?.status || error.message,
      );
    }
    throw error;
  }
};

// Get user
export const getUser = async (token?: string) => {
  try {
    const response = await api.get('/user', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error: any) {
    if (import.meta.env.DEV) {
      console.error(
        '❌ Get user failed:',
        error.response?.status || error.message,
      );

      // En desarrollo, devolver usuario del localStorage si existe
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return { user: JSON.parse(userStr) };
      }
    }
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await api.post('/logout');
    if (import.meta.env.DEV) {
      console.log('✅ Logout exitoso');
    }
  } catch (error: any) {
    if (import.meta.env.DEV) {
      console.warn('⚠️ Logout error:', error.response?.status || error.message);
    }
  }
};

// Helpers
export const isAuthenticated = () => {
  return !!(localStorage.getItem('token') && localStorage.getItem('user'));
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};
