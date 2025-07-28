import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@layout/MainLayout.vue';
import LandingPage from '@/pages/LandingPage.vue';
// import HomePage from '@/pages/HomePage.vue';
import RestaurantListPage from '@/pages/RestaurantListPage.vue';
import RestaurantDetailView from '@/pages/RestaurantDetailView.vue';

const routes = [
	{
		path: '/',
		component: MainLayout,
		children: [
			{ path: '', name: 'Landing', component: LandingPage },
			{ path: 'home', name: 'Home', component: RestaurantListPage },
			{
				path: 'restaurants/:id',
				name: 'RestaurantDetail',
				component: RestaurantDetailView,
				props: true,
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
