<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/app/store/auth/auth.store';
import { useToast } from 'vue-toastification';

const toast = useToast();
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const authStore = useAuthStore();
const setRole = ref(false);

const registerForm = reactive({
	name: '',
	email: '',
	password: '',
	password_confirmation: '',
	role: 'customer',
	restaurant_name: '',
});

function joinUsClicked() {
	if (!setRole.value) {
		setRole.value = true;
		registerForm.role = 'owner'; // default forced role when true
	} else {
		setRole.value = false;
		registerForm.role = 'customer';
	}
}

async function handleRegister() {
	if (setRole.value && registerForm.role === 'owner' && !registerForm.restaurant_name?.trim()) {
		toast.error('Ingresa el nombre de tu restaurante');
		return;
	}
	try {
		const payload: Record<string, string> = {
			name: registerForm.name,
			email: registerForm.email,
			password: registerForm.password,
			password_confirmation: registerForm.password_confirmation,
			role: registerForm.role,
		};
		if (registerForm.role === 'owner' && registerForm.restaurant_name.trim()) {
			payload.restaurant_name = registerForm.restaurant_name.trim();
		}
		await authStore.register(payload);
		toast.success('Cuenta creada correctamente');
	} catch (error) {
		const e = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } }; message?: string };
		let message = 'Registro fallido. Verifica los datos e intenta de nuevo.';
		if (e?.response?.data?.message) message = e.response.data.message;
		else if (e?.response?.data?.errors) {
			const first = Object.values(e.response.data.errors).flat()[0];
			if (first) message = first;
		} else if (e?.message) message = e.message;
		toast.error(message);
	}
}
</script>

<template>
	<div class="min-h-screen flex items-center justify-center min-w-0 overflow-x-hidden px-4 py-6 sm:py-8">
		<div
			class="bg-white dark:bg-gray-800 shadow-lg p-6 sm:p-10 w-full max-w-lg animate-fade-in relative min-w-0 rounded-xl sm:rounded-2xl"
			:class="{ 'customer-view': setRole }"
		>
			<!-- Role Tabs - visible on sm+ to avoid overflow on mobile -->
			<div class="absolute top-0 right-0 -translate-y-full hidden sm:block">
				<div
					class="join-us-tab cursor-pointer"
					:class="{ 'change-customer': setRole }"
					@click="joinUsClicked"
				>
					{{ setRole ? 'Ordenar Ahora' : 'Únete a Nosotros' }}
					<div class="tab-tongue" :class="{ 'bg-changed': setRole }"></div>
				</div>
			</div>

			<!-- Mobile role toggle (replaces absolute tab on small screens) -->
			<div class="sm:hidden flex justify-center mb-4">
				<button
					type="button"
					@click="joinUsClicked"
					class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
					:class="setRole ? 'bg-amber-500 text-white' : 'bg-primary text-white'"
				>
					{{ setRole ? 'Ordenar Ahora' : 'Únete a Nosotros' }}
				</button>
			</div>
			<div class="flex flex-col items-center justify-center gap-2">
				<h2
					class="text-xl sm:text-3xl font-bold mb-2 text-center font-chewy text-primary-500 dark:text-primary-400 break-words"
				>
					Crea tu cuenta de Kechow
				</h2>
			</div>

			<p class="text-sm text-center text-gray-500 mb-6">
				Únete a Kechow <br />
				{{ setRole ? 'Regístrate como Propietario o Repartidor para comenzar.' : 'Recibe comida rápida, fresca y directamente en tu puerta.' }}
			</p>

			<form
				@submit.prevent="handleRegister"
				class="space-y-6 animate-slide-up p-0 sm:p-6 rounded-2xl max-w-md mx-auto w-full min-w-0"
			>
				<!-- Name -->
				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
					<div
						class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 bg-white dark:bg-gray-700"
					>
						<span class="pl-3 pr-2 text-gray-500 dark:text-gray-400"><i class="ri-user-line text-base"></i></span>
						<input
							v-model="registerForm.name"
							type="text"
							placeholder="Tu nombre"
							class="w-full py-2.5 pl-1 outline-none text-gray-900 dark:text-white bg-transparent placeholder-gray-500 dark:placeholder-gray-400"
							required
						/>
					</div>
				</div>

				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Correo electrónico</label>
					<div
						class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 bg-white dark:bg-gray-700"
					>
						<span class="pl-3 pr-2 text-gray-500 dark:text-gray-400"><i class="ri-mail-line text-base"></i></span>
						<input
							v-model="registerForm.email"
							type="email"
							placeholder="tu@ejemplo.com"
							class="w-full py-2.5 pl-1 outline-none text-gray-900 dark:text-white bg-transparent placeholder-gray-500 dark:placeholder-gray-400"
							required
						/>
					</div>
				</div>

				<!-- Password -->
				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
					<div
						class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 relative bg-white dark:bg-gray-700"
					>
						<span class="pl-3 pr-2 text-gray-500 dark:text-gray-400"><i class="ri-lock-line text-base"></i></span>
						<input
							:type="showPassword ? 'text' : 'password'"
							v-model="registerForm.password"
							placeholder="••••••••"
							class="w-full py-2.5 pr-12 pl-1 outline-none text-gray-900 dark:text-white bg-transparent placeholder-gray-500 dark:placeholder-gray-400"
							required
						/>
						<button
							type="button"
							@click="showPassword = !showPassword"
							class="absolute right-0 top-0 bottom-0 flex items-center justify-center w-12 min-w-[44px] min-h-[44px] text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-600/50 active:bg-indigo-100 dark:active:bg-gray-600 transition-colors"
							:aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
						>
							<i :class="showPassword ? 'ri-eye-line text-xl' : 'ri-eye-off-line text-xl'"></i>
						</button>
					</div>
				</div>

				<!-- Confirm Password -->
				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar contraseña</label>
					<div
						class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 relative bg-white dark:bg-gray-700"
					>
						<span class="pl-3 pr-2 text-gray-500 dark:text-gray-400"><i class="ri-lock-line text-base"></i></span>
						<input
							:type="showConfirmPassword ? 'text' : 'password'"
							v-model="registerForm.password_confirmation"
							placeholder="••••••••"
							class="w-full py-2.5 pr-12 pl-1 outline-none text-gray-900 dark:text-white bg-transparent placeholder-gray-500 dark:placeholder-gray-400"
							required
						/>
						<button
							type="button"
							@click="showConfirmPassword = !showConfirmPassword"
							class="absolute right-0 top-0 bottom-0 flex items-center justify-center w-12 min-w-[44px] min-h-[44px] text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-600/50 active:bg-indigo-100 dark:active:bg-gray-600 transition-colors"
							:aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
						>
							<i :class="showConfirmPassword ? 'ri-eye-line text-xl' : 'ri-eye-off-line text-xl'"></i>
						</button>
					</div>
				</div>

				<!-- Role Selection (radio) -->
				<div v-if="setRole">
					<label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
						Registrarse como <span class="text-red-600">*</span>
					</label>
					<div class="flex flex-col gap-3">
						<label class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
							:class="registerForm.role === 'owner' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'">
							<input
								v-model="registerForm.role"
								type="radio"
								value="owner"
								class="w-4 h-4 text-primary-600"
							/>
							<span class="font-medium text-gray-900 dark:text-white">Propietario</span>
							<div v-if="registerForm.role === 'owner'" class="flex-1 flex items-center gap-2 ml-2">
								<input
									v-model="registerForm.restaurant_name"
									type="text"
									placeholder="Nombre del restaurante"
									required
									class="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
								/>
							</div>
						</label>
						<label class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
							:class="registerForm.role === 'delivery' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'">
							<input
								v-model="registerForm.role"
								type="radio"
								value="delivery"
								class="w-4 h-4 text-primary-600"
							/>
							<span class="font-medium text-gray-900 dark:text-white">Repartidor</span>
						</label>
					</div>
				</div>

				<button
					type="submit"
					class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition hover:scale-105 transition-transform active:scale-95 shadow-md"
				>
					Registrarse
				</button>
			</form>

			<p class="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
				¿Ya tienes cuenta?
				<router-link
					to="/login"
					class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
				>
					Inicia sesión aquí
				</router-link>
			</p>
		</div>
	</div>
</template>

<style scoped>
.join-us-tab {
	background: #3b82f6; /* Blue-500 */
	color: white;
	padding: 8px 20px;
	border: none;
	border-bottom: none;
	border-radius: 5px 5px 0 0;
	position: relative;
	z-index: 20;
}
.join-us-tab.change-customer {
	background: #f59e0b;
}
.tab-tongue {
	position: absolute;
	bottom: -6px;
	left: 50%;
	width: 12px;
	height: 6px;
	background: #3b82f6; /* Matches tab color */
	clip-path: polygon(0 0, 100% 0, 50% 100%);
	transform: translateX(-50%);
	transition: background-color 0.3s ease;
}
.tab-tongue.bg-changed {
	background: #f59e0b;
}

.customer-view {
	box-shadow: inset 0 0 0 2px #f59e0b,
		/* inner thin border */ inset 0 0 0 5px #fff,
		/* inner spacing to simulate "double" effect */ inset 0 0 0 8px #f59e0b; /* outer thicker border */
}

/* Hide original select but keep functionality */
select.form-control {
	position: absolute;
	opacity: 0;
	width: 1px;
	height: 1px;
	pointer-events: none;
}
</style>
