// src/app/store/auth/auth.store.ts
// Auth uses session (HttpOnly cookie) when backend supports it; no token in localStorage.
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

const USER_STORAGE_KEY = 'user';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const user = ref<User | null>(
    JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null'),
  );
  const error = ref<string | null>(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!user.value);
  const isOwner = computed(() => user.value?.role === 'owner');
  const isDelivery = computed(() => user.value?.role === 'delivery');
  const isCustomer = computed(() => user.value?.role === 'customer');

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
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

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
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

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
    const storedUser = user.value ?? JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
    if (!storedUser) return;

    try {
      isLoading.value = true;
      const data = await getUser();
      user.value = data.user;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    } catch {
      user.value = null;
      localStorage.removeItem(USER_STORAGE_KEY);
      logout();
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    error.value = null;

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

    localStorage.removeItem(USER_STORAGE_KEY);
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

    logoutService().catch(() => {});

    router.push('/login');
  };

  return {
    user,
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
