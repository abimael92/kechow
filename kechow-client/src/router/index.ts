import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/features/auth/auth.store';
import MainLayout from '@/layout/MainLayout.vue';

// Import non-owner pages (eager)
import LandingPage from '@/pages/LandingPage.vue';
import LoginView from '@/features/auth/components/LoginForm.vue';
import RegisterView from '@/features/auth/components/RegisterView.vue';
import HomePage from '@/pages/HomePage.vue';
import RestaurantDetailView from '@/pages/RestaurantDetailView.vue';
import RestaurantListPage from '@/pages/RestaurantListPage.vue';

// Lazy load owner pages
const OwnerDashboardPage = () => import('@/pages/owner/OwnerDashboardPage.vue');
const MenuItemsListPage = () => import('@/pages/owner/MenuItemsListPage.vue');
const OrdersListPage = () => import('@/pages/owner/OrdersListPage.vue');
const EditMenuItemPage = () => import('@/pages/owner/EditMenuItemPage.vue');

const routes = [
	{
		path: '/',
		component: MainLayout,
		children: [
			{ path: '', name: 'Landing', component: LandingPage },
			{ path: 'login', name: 'Login', component: LoginView },
			{ path: 'register', name: 'Register', component: RegisterView },
			{
				path: 'home',
				name: 'Home',
				component: HomePage,
				meta: { requiresAuth: true },
			},
			{
				path: 'restaurants',
				name: 'RestaurantList',
				component: RestaurantListPage,
				meta: { requiresAuth: true },
			},
			{
				path: 'restaurants/:id',
				name: 'RestaurantDetail',
				component: RestaurantDetailView,
				props: true,
				meta: { requiresAuth: true },
			},

			// Owner pages grouped under /owner
			{
				path: 'owner/dashboard',
				name: 'OwnerDashboard',
				component: OwnerDashboardPage,
				meta: { requiresAuth: true, role: 'owner' },
			},
			{
				path: 'owner/menu-items',
				name: 'OwnerMenuItems',
				component: MenuItemsListPage,
				meta: { requiresAuth: true, role: 'owner' },
			},
			{
				path: 'owner/menu-items/edit/:id?',
				name: 'OwnerEditMenuItem',
				component: EditMenuItemPage,
				props: true,
				meta: { requiresAuth: true, role: 'owner' },
			},
			{
				path: 'owner/orders',
				name: 'OwnerOrders',
				component: OrdersListPage,
				meta: { requiresAuth: true, role: 'owner' },
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

// Navigation guard for auth and role checking
router.beforeEach((to, from, next) => {
	const authStore = useAuthStore();

	if (to.meta.requiresAuth && !authStore.token) {
		return next({ name: 'Login' });
	}

	if (to.meta.role === 'owner' && authStore.user?.role !== 'owner') {
		return next({ name: 'Home' }); // or redirect to 403 page
	}

	return next();
});

export default router;
