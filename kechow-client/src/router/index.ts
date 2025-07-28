import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/features/auth/auth.store';
import MainLayout from '@/layout/MainLayout.vue';
import LandingPage from '@/pages/LandingPage.vue';
import LoginView from '@/features/auth/components/LoginForm.vue';
import RegisterView from '@/features/auth/components/RegisterView.vue';
import RestaurantListPage from '@/pages/RestaurantListPage.vue';
import RestaurantDetailView from '@/pages/RestaurantDetailView.vue';

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
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

// Navigation guard for routes requiring authentication
router.beforeEach((to, from, next) => {
	const authStore = useAuthStore();

	if (to.meta.requiresAuth && !authStore.token) {
		next({ name: 'Login' });
	} else {
		next();
	}
});

export default router;
