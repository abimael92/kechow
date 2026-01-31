<template>
	<div class="space-y-6">
		<h3 class="text-lg font-semibold text-gray-900">Soporte y ayuda</h3>
		<p class="text-white">Obtén ayuda rápida o contacta a soporte.</p>

		<!-- Support Options -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<button
				class="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center"
			>
				<i
					class="ri-question-line text-blue-600 text-3xl mb-3 w-12 h-12 mx-auto"
				></i>
				<p class="font-medium text-gray-900">Preguntas frecuentes</p>
				<p class="text-sm text-gray-500 mt-1">
					Encuentra respuestas a preguntas comunes
				</p>
			</button>

			<button
				class="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center"
			>
				<i
					class="ri-chat-1-line text-green-600 text-3xl mb-3 w-12 h-12 mx-auto"
				></i>
				<p class="font-medium text-gray-900">Chat en vivo</p>
				<p class="text-sm text-gray-500 mt-1">Chatea con nuestro equipo de soporte.</p>
			</button>

			<button
				class="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center"
			>
				<i
					class="ri-phone-line text-purple-600 text-3xl mb-3 w-12 h-12 mx-auto"
				></i>
				<p class="font-medium text-gray-900">Llamar a soporte</p>
				<p class="text-sm text-gray-500 mt-1">+1 (555) 123-HELP</p>
			</button>

			<button
				class="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center"
			>
				<i
					class="ri-mail-line text-orange-600 text-3xl mb-3 w-12 h-12 mx-auto"
				></i>
				<p class="font-medium text-gray-900">Soporte por correo</p>
				<p class="text-sm text-gray-500 mt-1">support@kechow.com</p>
			</button>
		</div>

		<!-- Emergency Contacts -->
		<div class="bg-gray-50 rounded-lg p-6">
			<h4 class="font-medium text-gray-900 mb-4">Contactos de emergencia</h4>
			<div class="space-y-2 text-sm">
				<p>
					<span class="font-medium">Línea de seguridad:</span> +1 (555) 911-SAFE
				</p>
				<p>
					<span class="font-medium">Problemas con cuenta:</span> +1 (555) 123-HELP
				</p>
				<p>
					<span class="font-medium">Soporte técnico:</span> +1 (555) 456-TECH
				</p>
			</div>
		</div>
	</div>
</template>
