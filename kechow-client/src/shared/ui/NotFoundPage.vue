<template>
	<div class="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Página no encontrada</h1>
		<p class="text-gray-600 dark:text-gray-400 mb-6">La ruta a la que intentas acceder no existe.</p>
		<router-link
			to="/"
			class="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
		>
			Ir al inicio
		</router-link>
	</div>
</template>

<script setup lang="ts">
</script>
