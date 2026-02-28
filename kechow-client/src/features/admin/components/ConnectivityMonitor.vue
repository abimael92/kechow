<template>
	<section
		class="bg-card dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6"
		aria-label="Estado de conexión"
	>
		<h2 class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-3 uppercase tracking-wide">
			Estado de conexión
		</h2>
		<div class="flex flex-wrap gap-4">
			<div class="flex items-center gap-2">
				<span
					class="w-3 h-3 rounded-full"
					:class="apiStatus === 'ok' ? 'bg-green-500' : apiStatus === 'error' ? 'bg-red-500' : 'bg-amber-500'"
					aria-hidden="true"
				/>
				<span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">API</span>
				<span class="text-xs text-neutral-500 dark:text-neutral-400">{{ apiLabel }}</span>
			</div>
			<div class="flex items-center gap-2">
				<span
					class="w-3 h-3 rounded-full"
					:class="socketStatus === 'connected' ? 'bg-green-500' : socketStatus === 'error' ? 'bg-red-500' : 'bg-amber-500'"
					aria-hidden="true"
				/>
				<span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">WebSocket</span>
				<span class="text-xs text-neutral-500 dark:text-neutral-400">{{ socketLabel }}</span>
			</div>
		</div>
		<p v-if="lastCheck" class="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
			Última comprobación: {{ lastCheck }}
		</p>
	</section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/app/lib/axios';

type ApiStatus = 'ok' | 'error' | 'pending';
type SocketStatus = 'connected' | 'disconnected' | 'error' | 'pending';

const apiStatus = ref<ApiStatus>('pending');
const socketStatus = ref<SocketStatus>('pending');
const lastCheck = ref<string | null>(null);

const apiLabel = ref('Comprobando…');
const socketLabel = ref('No configurado');

async function checkApi() {
	try {
		await api.get('/user').catch(() => api.get('/restaurants'));
		apiStatus.value = 'ok';
		apiLabel.value = 'Conectado';
	} catch {
		apiStatus.value = 'error';
		apiLabel.value = 'Error';
	}
	lastCheck.value = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

onMounted(() => {
	checkApi();
	// TODO: [USER] Add API Key here — WebSocket (Pusher/Reverb) connection status
	// When VITE_REVERB_APP_KEY and Echo are configured, set socketStatus from Echo.connector.pusher.connection.state
	socketStatus.value = 'pending';
	socketLabel.value = 'Configurar Reverb/Pusher';
});
</script>
