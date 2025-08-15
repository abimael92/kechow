<template>
	<div class="min-h-screen bg-gray-50">
		<!-- Owner Navigation Sidebar -->
		<OwnerSidebar />

		<div class="lg:pl-64">
			<!-- Owner Header -->
			<OwnerHeader />

			<main class="py-6 px-4 sm:px-6 lg:px-8">
				<!-- Dashboard Overview -->
				<DashboardOverview />

				<div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
					<!-- Left Column -->
					<div class="lg:col-span-2 space-y-6">
						<OrdersPanel />
						<MenuManagement />
					</div>

					<!-- Right Column -->
					<div class="space-y-6">
						<QuickStats />
						<RecentActivity />
					</div>
				</div>
			</main>
		</div>
	</div>
</template>

<script setup>
import OwnerSidebar from '@/components/owner/OwnerSidebar.vue';
import OwnerHeader from '@/components/owner/OwnerHeader.vue';
import DashboardOverview from '@/components/owner/DashboardOverview.vue';
import OrdersPanel from '@/components/owner/OrdersPanel.vue';
import MenuManagement from '@/components/owner/MenuManagement.vue';
import QuickStats from '@/components/owner/QuickStats.vue';
import RecentActivity from '@/components/owner/RecentActivity.vue';
</script>
