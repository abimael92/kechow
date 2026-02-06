<template>
	<div class="space-y-4">
		<div
			v-for="address in addresses"
			:key="address.id"
			class="border border-primary-200 dark:border-gray-700 rounded-xl bg-card p-4 sm:p-5 transition-shadow hover:shadow-soft"
		>
			<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
				<div class="flex-1 min-w-0">
					<div class="flex flex-wrap items-center gap-2 mb-2">
						<span class="font-semibold text-gray-900 dark:text-white">
							{{ address.label }}
						</span>
						<span
							v-if="address.isDefault"
							class="text-xs font-medium bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-2 py-1 rounded"
						>
							Predeterminada
						</span>
					</div>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						{{ fullAddress(address) }}
					</p>
				</div>
				<div class="flex items-center gap-2 flex-shrink-0">
					<button
						v-if="!address.isDefault"
						type="button"
						@click="$emit('set-default', address.id)"
						class="min-h-[44px] min-w-[44px] p-2 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
						:aria-label="`Marcar como predeterminada`"
						title="Marcar como predeterminada"
					>
						<i class="ri-star-line text-lg" aria-hidden="true"></i>
					</button>
					<button
						type="button"
						@click="$emit('edit', address)"
						class="min-h-[44px] min-w-[44px] p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
						aria-label="Editar"
						title="Editar"
					>
						<i class="ri-edit-line text-lg" aria-hidden="true"></i>
					</button>
					<button
						type="button"
						@click="$emit('delete', address.id)"
						class="min-h-[44px] min-w-[44px] p-2 rounded-lg text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
						aria-label="Eliminar"
						title="Eliminar"
					>
						<i class="ri-delete-bin-line text-lg" aria-hidden="true"></i>
					</button>
				</div>
			</div>
		</div>
		<p
			v-if="addresses.length === 0 && !hideEmpty"
			class="text-center py-8 text-gray-500 dark:text-gray-400"
		>
			No tienes direcciones guardadas
		</p>
	</div>
</template>

<script setup lang="ts">
import type { Address } from '@/features/customer/services/customer.service';

defineProps<{
	addresses: Address[];
	hideEmpty?: boolean;
}>();

defineEmits<{
	'set-default': [id: string];
	edit: [address: Address];
	delete: [id: string];
}>();

function fullAddress(a: Address): string {
	const parts = [a.street, a.city, a.state].filter(Boolean);
	const line = parts.join(', ');
	return a.zipCode ? `${line} ${a.zipCode}` : line;
}
</script>
