<template>
	<div class="bg-white shadow rounded-lg overflow-hidden">
		<div class="px-4 py-5 sm:px-6 border-b border-gray-200">
			<h3 class="text-lg font-medium leading-6 text-gray-900">
				Estadísticas Rápidas
			</h3>
		</div>

		<div class="px-4 py-5 sm:p-6">
			<dl class="grid grid-cols-1 gap-5 sm:grid-cols-2">
				<div
					v-for="stat in stats"
					:key="stat.name"
					class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
				>
					<dt class="text-sm font-medium text-gray-500 truncate">
						{{ stat.name }}
					</dt>
					<dd class="mt-1 text-3xl font-semibold text-gray-900">
						{{ stat.value }}
					</dd>
					<div class="mt-2 flex items-baseline">
						<span
							class="flex items-baseline text-sm font-semibold"
							:class="
								stat.changeType === 'increase'
									? 'text-green-600'
									: 'text-red-600'
							"
						>
							<ArrowUpIcon
								v-if="stat.changeType === 'increase'"
								class="self-center flex-shrink-0 h-5 w-5 text-green-500"
								aria-hidden="true"
							/>
							<ArrowDownIcon
								v-else
								class="self-center flex-shrink-0 h-5 w-5 text-red-500"
								aria-hidden="true"
							/>
							<span class="sr-only">
								{{
									stat.changeType === 'increase' ? 'Increased' : 'Decreased'
								}}
								by
							</span>
							{{ stat.change }}
						</span>
						<span class="ml-2 text-sm text-gray-500"> vs última semana </span>
					</div>
				</div>
			</dl>
		</div>
	</div>
</template>

<script setup>
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/solid';

const stats = ref([
	{
		name: 'Ventas Hoy',
		value: '$2,450',
		change: '12%',
		changeType: 'increase',
	},
	{ name: 'Pedidos Hoy', value: '24', change: '8%', changeType: 'increase' },
	{
		name: 'Tasa de Cancelación',
		value: '3.2%',
		change: '0.5%',
		changeType: 'decrease',
	},
	{
		name: 'Clientes Nuevos',
		value: '14',
		change: '20%',
		changeType: 'increase',
	},
]);
</script>
