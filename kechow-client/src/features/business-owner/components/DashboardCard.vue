<template>
	<div class="overflow-hidden rounded-lg bg-white shadow">
		<div class="p-5">
			<div class="flex items-center">
				<div class="flex-shrink-0 text-2xl">
					{{ getIcon(stat.icon) }}
				</div>
				<div class="ml-5 w-0 flex-1">
					<dl>
						<dt class="truncate text-sm font-medium text-gray-500">
							{{ stat.name }}
						</dt>
						<dd>
							<div class="text-lg font-medium text-gray-900">
								{{ stat.value }}
							</div>
						</dd>
					</dl>
				</div>
			</div>
			<div class="mt-4">
				<span
					class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
					:class="
						stat.changeType === 'increase'
							? 'bg-green-100 text-green-800'
							: 'bg-red-100 text-red-800'
					"
				>
					<span
						class="-ml-0.5 mr-1"
						:class="
							stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
						"
					>
						{{ stat.changeType === 'increase' ? '⬆️' : '⬇️' }}
					</span>
					{{ stat.change }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
	stat: {
		type: Object,
		required: true,
	},
});

const getIcon = (iconName) => {
	const icons = {
		NewOrdersIcon: '🛒',
		PreparingIcon: '⏳',
		ReadyIcon: '🚚',
		RevenueIcon: '💵',
	};
	return icons[iconName] || '📦';
};
</script>
