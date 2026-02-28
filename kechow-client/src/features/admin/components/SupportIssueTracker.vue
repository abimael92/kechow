<template>
	<div class="p-4 sm:p-6 space-y-4">
		<h2 class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
			Soporte e incidencias
		</h2>
		<p class="text-sm text-neutral-600 dark:text-neutral-400">
			Excepciones del sistema y tickets de soporte enviados por usuarios.
		</p>

		<!-- System exceptions (catch-all error logger) -->
		<section class="bg-card dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
			<h3 class="font-semibold text-neutral-800 dark:text-neutral-200 p-4 border-b border-neutral-200 dark:border-neutral-800">
				Últimas excepciones del sistema
			</h3>
			<div class="overflow-x-auto max-h-80 overflow-y-auto">
				<table class="w-full text-sm text-left">
					<thead class="sticky top-0 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
						<tr>
							<th class="px-4 py-2">Fecha</th>
							<th class="px-4 py-2">Mensaje</th>
							<th class="px-4 py-2">Origen</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(ex, i) in exceptions"
							:key="i"
							class="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
						>
							<td class="px-4 py-2 text-neutral-600 dark:text-neutral-400">{{ ex.date }}</td>
							<td class="px-4 py-2">{{ ex.message }}</td>
							<td class="px-4 py-2 text-neutral-500 dark:text-neutral-400">{{ ex.source }}</td>
						</tr>
						<tr v-if="exceptions.length === 0">
							<td colspan="3" class="px-4 py-6 text-center text-neutral-500 dark:text-neutral-400">
								No hay excepciones registradas. Configure el endpoint GET /admin/exceptions (role:admin).
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<!-- User support tickets placeholder -->
		<section class="bg-card dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
			<h3 class="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">Tickets de soporte</h3>
			<p class="text-sm text-neutral-500 dark:text-neutral-400">
				Los tickets enviados por usuarios aparecerán aquí cuando exista el flujo y el endpoint GET /admin/tickets.
			</p>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface ExceptionRow {
	date: string;
	message: string;
	source: string;
}

const exceptions = ref<ExceptionRow[]>([]);

onMounted(async () => {
	try {
		const { getAdminExceptions } = await import('../services/admin.service');
		const list = await getAdminExceptions(50);
		exceptions.value = list.map((ex) => ({
			date: ex.date,
			message: ex.message,
			source: ex.source,
		}));
	} catch {
		exceptions.value = [];
	}
});
</script>
