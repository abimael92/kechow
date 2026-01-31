// kechow-client/src/app/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@layout/MainLayout.vue';
import CustomerLayout from '@shared/layout/CustomerLayout.vue';
import OwnerLayout from '@shared/layout/OwnerLayout.vue';
import DeliveryLayout from '@shared/layout/DeliveryLayout.vue';
import { authGuard } from './guards';

// Pages (eager)
import LandingPage from '@pages/LandingPage.vue';
import LoginView from '@features/auth/components/LoginForm.vue';
import RegisterView from '@features/auth/components/RegisterView.vue';
import HomePage from '@pages/HomePage.vue';
import RestaurantListPage from '@pages/RestaurantListPage.vue';
import RestaurantDetailView from '@pages/RestaurantDetailView.vue';

// Owner pages (lazy)
const OwnerDashboardPage = () => import('@pages/owner/OwnerDashboardPage.vue');
const OwnerMenuPage = () => import('@pages/owner/MenuPage.vue');
const OrdersListPage = () => import('@pages/owner/OrdersListPage.vue');
const EditMenuItemPage = () => import('@pages/owner/EditMenuItemPage.vue');
const AnalyticsPage = () => import('@pages/owner/AnalyticsPage.vue');
const ReviewsPage = () => import('@pages/owner/ReviewsPage.vue');
const OwnerSettingsPage = () => import('@pages/owner/OwnerSettingsPage.vue');

// Delivery pages (lazy)
const DeliveryDashboard = () =>
	import('@features/delivery/views/DeliveryDashboard.vue');
const DeliveryOrderDetail = () =>
	import('@features/delivery/views/DeliveryOrderDetail.vue');
const LiveDelivery = () => import('@features/delivery/views/LiveDelivery.vue');
const DeliveryProfile = () => import('@pages/delivery/ProfilePage.vue');
const DeliveryEarnings = () => import('@pages/delivery/EarningsPage.vue');
const OrderDetailPage = () => import('@pages/delivery/OrderDetailPage.vue');

const routes = [
	{
		path: '/',
		component: MainLayout,
		children: [
			{ path: '', name: 'Landing', component: LandingPage },
			{ path: 'login', name: 'Login', component: LoginView },
			{ path: 'register', name: 'Register', component: RegisterView },
		],
	},
	// Customer routes with CustomerLayout
	{
		path: '/',
		component: CustomerLayout,
		children: [
			{
				path: 'home',
				name: 'Home',
				component: HomePage,
				meta: { requiresAuth: true, role: 'customer' },
			},
			{
				path: 'restaurants',
				name: 'RestaurantList',
				component: RestaurantListPage,
				meta: { requiresAuth: true, role: 'customer' },
			},
			{
				path: 'restaurants/:id',
				name: 'RestaurantDetail',
				component: RestaurantDetailView,
				props: true,
				meta: { requiresAuth: true, role: 'customer' },
			},
			{
				path: 'cart',
				name: 'CartPage',
				component: () => import('@/pages/customer/CartPage.vue'),
				meta: { requiresAuth: true, role: 'customer' },
			},
			{
				path: 'checkout',
				name: 'CheckoutPage',
				component: () => import('@/pages/customer/CheckoutPage.vue'),
				meta: { requiresAuth: true, role: 'customer' },
			},
			{
				path: 'orders',
				name: 'OrdersPage',
				component: () => import('@/pages/customer/OrdersPage.vue'),
				meta: { requiresAuth: true, role: 'customer' },
			},
			{
				path: 'orders/:id/track',
				name: 'OrderTracking',
				component: () => import('@/pages/customer/OrderTrackingPage.vue'),
				meta: { requiresAuth: true, role: 'customer' },
			},
			{
				path: 'reviews',
				name: 'ReviewPage',
				component: () => import('@/pages/customer/ReviewsPage.vue'),
				meta: { requiresAuth: true, role: 'customer' },
			},
			{
				path: 'profile',
				name: 'ProfilePage',
				component: () => import('@/pages/customer/ProfilePage.vue'),
				meta: { requiresAuth: true, role: 'customer' },
			},
		],
	},
	// Owner routes with OwnerLayout
	{
		path: '/',
		component: OwnerLayout,
		children: [
			{
				path: 'owner/dashboard',
				name: 'OwnerDashboard',
				component: OwnerDashboardPage,
				meta: { requiresAuth: true, role: 'owner' },
			},
			{
				path: 'owner/menu',
				name: 'OwnerMenu',
				component: OwnerMenuPage,
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
				path: 'owner/analytics',
				name: 'OwnerAnalytics',
				component: AnalyticsPage,
				meta: { requiresAuth: true, role: 'owner' },
			},
			{
				path: 'owner/orders',
				name: 'OwnerOrders',
				component: OrdersListPage,
				meta: { requiresAuth: true, role: 'owner' },
			},
			{
				path: 'owner/reviews',
				name: 'ReviewsPage',
				component: ReviewsPage,
				meta: { requiresAuth: true, role: 'owner' },
			},
			{
				path: 'owner/settings',
				name: 'OwnerSettings',
				component: OwnerSettingsPage,
				meta: { requiresAuth: true, role: 'owner' },
			},
		],
	},
	// Delivery routes with DeliveryLayout
	{
		path: '/',
		component: DeliveryLayout,
		children: [
			{
				path: 'delivery/dashboard',
				name: 'DeliveryDashboard',
				component: DeliveryDashboard,
				meta: { requiresAuth: true, role: 'delivery' },
			},
			{
				path: 'delivery/order/:id',
				name: 'DeliveryOrderDetail',
				component: DeliveryOrderDetail,
				meta: { requiresAuth: true, role: 'delivery' },
			},
			{
				path: 'delivery/live/:id',
				name: 'LiveDelivery',
				component: LiveDelivery,
				meta: { requiresAuth: true, role: 'delivery' },
			},
			{
				path: 'delivery/profile',
				name: 'DeliveryProfile',
				component: DeliveryProfile,
				meta: { requiresAuth: true, role: 'delivery' },
			},
			{
				path: 'delivery/earnings',
				name: 'DeliveryEarnings',
				component: DeliveryEarnings,
				meta: { requiresAuth: true, role: 'delivery' },
			},
			{
				path: 'delivery/orders',
				name: 'DeliveryOrders',
				component: OrderDetailPage,
				meta: { requiresAuth: true, role: 'delivery' },
			},
		],
	},
	// 404 fallback: show something instead of blank
	{
		path: '/:pathMatch(.*)*',
		name: 'NotFound',
		component: () => import('@/shared/ui/NotFoundPage.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

// Apply the auth guard globally
router.beforeEach(authGuard);

export default router;
