// src/app/store/auth/auth.store.ts
import { defineStore } from 'pinia';
import {
  login,
  register,
  getUser,
  logout as logoutService,
} from '../../../features/auth';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { getDashboardRouteForRole } from '@shared/utils/role.utils';
import { useCartStore } from '@features/customer/cart/cart.store';
import { useUserStore } from '@app/store/user.store';
import { useMenuStore } from '@features/business-owner/store/menuStore';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const user = ref<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null'),
  );
  const token = ref(localStorage.getItem('token'));
  const error = ref<string | null>(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const isOwner = computed(() => user.value?.role === 'owner');
  const isDelivery = computed(() => user.value?.role === 'delivery');
  const isCustomer = computed(() => user.value?.role === 'customer');

  const setAuthHeader = () => {
    // El interceptor de axios ya maneja esto
  };

  const redirectByRole = () => {
    if (!user.value) return;
    const dashboardRoute = getDashboardRouteForRole(user.value.role);
    router.push(dashboardRoute);
  };

  const loginAction = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await login(credentials);
      user.value = response.user;
      token.value = response.token;

      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);

      redirectByRole();

      return response;
    } catch (err: any) {
      error.value = err.message || 'Error al iniciar sesión';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const registerAction = async (payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    restaurant_name?: string;
  }) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await register(payload);
      user.value = response.user;
      token.value = response.token;

      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);

      redirectByRole();

      return response;
    } catch (err: any) {
      error.value = err.message || 'Error al registrarse';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const initialize = async () => {
    if (token.value && !user.value) {
      try {
        isLoading.value = true;
        const data = await getUser();
        user.value = data.user;
      } catch {
        logout();
      } finally {
        isLoading.value = false;
      }
    }
  };

  const logout = () => {
    // Clear auth store state
    user.value = null;
    token.value = null;
    error.value = null;

    // Clear all Pinia stores
    try {
      const cartStore = useCartStore();
      if (cartStore && typeof cartStore.clearCart === 'function') {
        cartStore.clearCart();
      }
    } catch (err) {}

    try {
      const userStore = useUserStore();
      if (userStore && typeof userStore.logout === 'function') {
        userStore.logout();
      }
    } catch (err) {}

    try {
      const menuStore = useMenuStore();
      if (menuStore && typeof menuStore.$reset === 'function') {
        menuStore.$reset();
      }
    } catch (err) {}

    // Clear all localStorage items
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('theme');
    localStorage.removeItem('preferredLanguage');
    localStorage.removeItem('darkMode');
    localStorage.removeItem('deliverySettings');
    localStorage.removeItem('delivery_availability');
    localStorage.removeItem('delivery_active_order');
    localStorage.removeItem('delivery_settings');
    localStorage.removeItem('delivery_completed_orders');
    localStorage.removeItem('delivery_location_updates');

    // Call logout service
    logoutService().catch(() => {});

    // Redirect to login
    router.push('/login');
  };

  return {
    user,
    token,
    error,
    isLoading,
    login: loginAction,
    register: registerAction,
    logout,
    initialize,
    isAuthenticated,
    isOwner,
    isDelivery,
    isCustomer,
    redirectByRole,
  };
});
