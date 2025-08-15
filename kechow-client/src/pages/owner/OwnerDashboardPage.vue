<template>
	<div class="p-6">
		<DashboardOverview />
		<div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
			<div class="lg:col-span-2 space-y-6">
				<OrdersPanel />
				<MenuManagement />
			</div>
			<div class="space-y-6">
				<QuickStats />
			</div>
		</div>
	</div>
</template>

<script setup>
import DashboardOverview from '@/features/business-owner/components/DashboardOverview.vue';
import OrdersPanel from '@/features/business-owner/components/OrdersPanel.vue';
import MenuManagement from '@/features/business-owner/components/MenuManagement.vue';
import QuickStats from '@/features/business-owner/components/QuickStats.vue';
</script>
