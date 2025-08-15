<template>
	<div
		class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white lg:pb-4 lg:pt-5"
	>
		<div class="flex flex-shrink-0 items-center px-6">
			<img
				class="h-8 w-auto"
				src="/images/kechow_logo.png"
				alt="Kechow Owner"
			/>
			<span class="ml-2 text-xl font-bold">Owner Portal</span>
		</div>

		<nav class="mt-6 flex-1 space-y-1 px-2">
			<router-link
				v-for="item in navigation"
				:key="item.name"
				:to="item.href"
				class="group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors"
				:class="[
					$route.path.includes(item.href)
						? 'bg-indigo-50 text-indigo-600'
						: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
				]"
			>
				<component
					:is="item.icon"
					class="mr-3 h-5 w-5 flex-shrink-0"
					:class="[
						$route.path.includes(item.href)
							? 'text-indigo-500'
							: 'text-gray-400 group-hover:text-gray-500',
					]"
				/>
				{{ item.name }}
			</router-link>
		</nav>

		<div class="mt-auto px-6 py-4">
			<div class="flex items-center">
				<img
					class="h-10 w-10 rounded-full"
					:src="user.imageUrl"
					:alt="user.name"
				/>
				<div class="ml-3">
					<p class="text-sm font-medium text-gray-700">{{ user.name }}</p>
					<button
						class="text-xs font-medium text-indigo-600 hover:text-indigo-500"
					>
						Ver perfil
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import {
	HomeIcon,
	ClipboardListIcon,
	ShoppingBagIcon,
	UsersIcon,
	ChartBarIcon,
	CogIcon,
	BellIcon,
	CalendarIcon,
} from '@heroicons/vue/outline';

const user = ref({
	name: 'Juan Pérez',
	imageUrl: '/images/default-avatar.png',
});

const navigation = ref([
	{ name: 'Dashboard', href: '/owner', icon: HomeIcon },
	{ name: 'Órdenes', href: '/owner/orders', icon: ClipboardListIcon },
	{ name: 'Menú', href: '/owner/menu', icon: ShoppingBagIcon },
	{ name: 'Clientes', href: '/owner/customers', icon: UsersIcon },
	{ name: 'Analíticas', href: '/owner/analytics', icon: ChartBarIcon },
	{ name: 'Promociones', href: '/owner/promotions', icon: BellIcon },
	{ name: 'Horarios', href: '/owner/schedule', icon: CalendarIcon },
	{ name: 'Configuración', href: '/owner/settings', icon: CogIcon },
]);
</script>
