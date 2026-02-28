<template>
	<div class="p-4 sm:p-6 space-y-4">
		<h2 class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
			Mapa de despacho
		</h2>
		<p class="text-sm text-neutral-600 dark:text-neutral-400">
			Seguimiento en tiempo real de repartidores en tránsito.
		</p>

		<!-- Placeholder for map; API key required -->
		<div
			class="bg-neutral-100 dark:bg-neutral-800 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex flex-col items-center justify-center min-h-[320px] text-center px-4 py-8"
			role="img"
			aria-label="Mapa de despacho (pendiente de configurar)"
		>
			<i class="ri-map-pin-line text-4xl text-neutral-400 dark:text-neutral-500 mb-3" aria-hidden="true"></i>
			<p class="text-neutral-600 dark:text-neutral-400 font-medium mb-1">
				Mapa de entregas en tránsito
			</p>
			<p class="text-sm text-neutral-500 dark:text-neutral-500 max-w-md">
				<!-- TODO: [USER] Add API Key here — Google Maps (or Mapbox) API key required to render the map and track "In-Transit" drivers. -->
				Configure la API de mapas (Google Maps o Mapbox) y el endpoint GET /admin/deliveries/in-transit para mostrar los repartidores activos.
			</p>
		</div>

		<div class="text-xs text-neutral-500 dark:text-neutral-400">
			<!-- TODO: [USER] Add API Key here — Maps API key for Active Dispatch Map -->
			VITE_GOOGLE_MAPS_API_KEY o similar en .env; componente de mapa comentado hasta que se añada la clave.
		</div>
	</div>
</template>

<script setup lang="ts">
// TODO: [USER] Add API Key here — When Google Maps (or Mapbox) key is set, import map component and render:
// - Fetch GET /admin/deliveries/in-transit (role:admin)
// - Display driver markers and optional routes
</script>
