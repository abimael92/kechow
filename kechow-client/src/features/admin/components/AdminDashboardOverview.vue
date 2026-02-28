<template>
	<div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
		<div class="flex items-center gap-2 sm:gap-3 md:gap-4">
			<div
				class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0"
			>
				<i class="ri-dashboard-line text-white text-lg sm:text-xl md:text-2xl" aria-hidden="true"></i>
			</div>
			<div class="min-w-0 flex-1">
				<h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl leading-tight sm:leading-snug">
					Centro de control
				</h1>
				<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base select-none">
					Super Admin — Visión general de la plataforma
				</p>
			</div>
		</div>

		<!-- Platform KPIs -->
		<section aria-label="Estadísticas de la plataforma">
			<h2 class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-3 uppercase tracking-wide">
				Resumen de la plataforma
			</h2>
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
				<div class="bg-card dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
					<p class="text-xs text-neutral-500 dark:text-neutral-400">Ingresos totales (período)</p>
					<p class="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
						{{ formatCurrency(platformRevenue) }}
					</p>
				</div>
				<div class="bg-card dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
					<p class="text-xs text-neutral-500 dark:text-neutral-400">Entregas activas</p>
					<p class="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
						{{ activeDeliveries }}
					</p>
				</div>
				<div class="bg-card dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
					<p class="text-xs text-neutral-500 dark:text-neutral-400">Estado del sistema</p>
					<p class="text-xl sm:text-2xl font-bold mt-1" :class="systemHealth === 'ok' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'">
						{{ systemHealthLabel }}
					</p>
				</div>
			</div>
		</section>

		<ConnectivityMonitor />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ConnectivityMonitor from './ConnectivityMonitor.vue';

const platformRevenue = ref(0);
const activeDeliveries = ref(0);
const systemHealth = ref<'ok' | 'degraded'>('ok');

const systemHealthLabel = ref('Correcto');

function formatCurrency(n: number): string {
	return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
}

onMounted(async () => {
	try {
		const { getAdminStats } = await import('../services/admin.service');
		const data = await getAdminStats();
		platformRevenue.value = data.platformRevenue ?? 0;
		activeDeliveries.value = data.activeDeliveries ?? 0;
		systemHealth.value = (data.systemHealth as 'ok' | 'degraded') ?? 'ok';
		systemHealthLabel.value = systemHealth.value === 'ok' ? 'Correcto' : 'Degradado';
	} catch {
		platformRevenue.value = 0;
		activeDeliveries.value = 0;
	}
});
</script>

<style scoped>
.text-bubble {
	font-size: clamp(1.5rem, 4vw, 2rem);
}
</style>
