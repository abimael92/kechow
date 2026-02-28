<template>
	<div class="p-4 sm:p-6 space-y-4">
		<h2 class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
			Libro de finanzas
		</h2>
		<p class="text-sm text-neutral-600 dark:text-neutral-400">
			Saldos pendientes y pagados para repartidores y propietarios.
		</p>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<section class="bg-card dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
				<h3 class="font-semibold text-neutral-800 dark:text-neutral-200 mb-3">Repartidores</h3>
				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span class="text-neutral-600 dark:text-neutral-400">Pendiente</span>
						<span class="font-medium">{{ formatCurrency(driversPending) }}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-neutral-600 dark:text-neutral-400">Pagado</span>
						<span class="font-medium">{{ formatCurrency(driversPaid) }}</span>
					</div>
				</div>
			</section>
			<section class="bg-card dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
				<h3 class="font-semibold text-neutral-800 dark:text-neutral-200 mb-3">Propietarios</h3>
				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span class="text-neutral-600 dark:text-neutral-400">Pendiente</span>
						<span class="font-medium">{{ formatCurrency(ownersPending) }}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-neutral-600 dark:text-neutral-400">Pagado</span>
						<span class="font-medium">{{ formatCurrency(ownersPaid) }}</span>
					</div>
				</div>
			</section>
		</div>

		<p class="text-xs text-neutral-500 dark:text-neutral-400">
			Los datos se obtienen del backend cuando exista el endpoint GET /admin/ledger (role:admin).
		</p>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const driversPending = ref(0);
const driversPaid = ref(0);
const ownersPending = ref(0);
const ownersPaid = ref(0);

function formatCurrency(n: number): string {
	return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
}

onMounted(async () => {
	try {
		const { getAdminLedger } = await import('../services/admin.service');
		const data = await getAdminLedger();
		driversPending.value = data.drivers?.pending ?? 0;
		driversPaid.value = data.drivers?.paid ?? 0;
		ownersPending.value = data.owners?.pending ?? 0;
		ownersPaid.value = data.owners?.paid ?? 0;
	} catch {
		// placeholder on 403/404
	}
});
</script>
