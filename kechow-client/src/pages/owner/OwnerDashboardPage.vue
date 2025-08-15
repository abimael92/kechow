<template>
	<div class="p-6">
		<ErrorBoundary>
			<DashboardOverview />
			<div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div class="lg:col-span-2 space-y-6">
					<ErrorBoundary>
						<OrdersPanel />
					</ErrorBoundary>
					<ErrorBoundary>
						<MenuManagement />
					</ErrorBoundary>
				</div>
				<div class="space-y-6">
					<ErrorBoundary>
						<QuickStats />
					</ErrorBoundary>
				</div>
			</div>
		</ErrorBoundary>
	</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/store/auth/auth.store';
import DashboardOverview from '@/features/business-owner/components/DashboardOverview.vue';
import OrdersPanel from '@/features/business-owner/components/OrdersPanel.vue';
import MenuManagement from '@/features/business-owner/components/MenuManagement.vue';
import QuickStats from '@/features/business-owner/components/QuickStats.vue';

const authStore = useAuthStore();

onMounted(() => {
	console.log('Dashboard mounted - auth state:', {
		isAuthenticated: authStore.isAuthenticated,
		isOwner: authStore.isOwner,
		user: authStore.user,
		token: authStore.token,
	});
});
</script>
