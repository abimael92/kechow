import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@layout/MainLayout.vue';
import LandingPage from '@/pages/LandingPage.vue';
import HomePage from '@/pages/HomePage.vue';

const routes = [
	{
		path: '/',
		component: MainLayout,
		children: [
			{ path: '', name: 'Landing', component: LandingPage },
			{ path: 'home', name: 'Home', component: HomePage },
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
