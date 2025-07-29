<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/features/auth/auth.store';

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const authStore = useAuthStore();

const registerForm = reactive({
	name: '',
	email: '',
	password: '',
	password_confirmation: '',
	role: 'customer',
});

async function handleRegister() {
	try {
		await authStore.register({
			name: registerForm.name,
			email: registerForm.email,
			password: registerForm.password,
			password_confirmation: registerForm.password_confirmation, // add this
		});
	} catch (error) {
		alert('Registration failed.');
	}
}
</script>

<template>
	<div class="min-h-screen flex items-center justify-center">
		<div
			class="bg-white shadow-lg p-10 w-full max-w-lg animate-fade-in relative"
			style="border-radius: 12px 0 12px 12px"
		>
			>
			<!-- Role Tabs -->
			<div class="absolute top-0 right-0 -translate-y-full">
				<div class="join-us-tab">
					Join Us
					<div class="tab-tongue"></div>
				</div>
			</div>
			<div class="flex flex-col items-center justify-center gap-2">
				<h2
					class="text-2xl font-bold mb-2 text-center text-gradient-pulse text-primary"
				>
					Create your Kechow account
				</h2>
			</div>

			<p class="text-sm text-center text-gray-500 mb-6">
				Join Kechow <br />
				Get food fast, fresh, and right to your door.
			</p>

			<form
				@submit.prevent="handleRegister"
				class="space-y-6 animate-slide-up p-6 rounded-2xl max-w-md mx-auto"
			>
				<!-- Name -->
				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700"
						>Name</label
					>
					<div
						class="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500"
					>
						<span class="px-3 text-gray-400"><i class="fas fa-user"></i></span>
						<input
							v-model="registerForm.name"
							type="text"
							placeholder="Your name"
							class="w-full text-gray-800 p-2 outline-none"
							required
						/>
					</div>
				</div>

				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700"
						>Email</label
					>
					<div
						class="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500"
					>
						<span class="px-3 text-gray-400"
							><i class="fas fa-envelope"></i
						></span>
						<input
							v-model="registerForm.email"
							type="email"
							placeholder="you@example.com"
							class="w-full text-gray-800 p-2 outline-none"
							required
						/>
					</div>
				</div>

				<!-- Role Select -->
				<div>
					<label>Registering as</label>
					<select v-model="registerForm.role" class="form-control w-full p-2">
						<option value="owner">Owner</option>
						<option value="delivery">Delivery</option>
					</select>
				</div>

				<!-- Password -->
				<div
					class="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 relative"
				>
					<span class="px-3 text-gray-400"><i class="fas fa-lock"></i></span>
					<input
						:type="showPassword ? 'text' : 'password'"
						v-model="registerForm.password"
						placeholder="••••••••"
						class="w-full p-2 text-gray-800 outline-none"
						required
					/>
					<button
						type="button"
						@click="showPassword = !showPassword"
						class="absolute right-3 text-gray-600"
					>
						{{ showPassword ? 'Hide' : 'Show' }}
					</button>
				</div>

				<!-- Confirm Password -->
				<div
					class="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 relative"
				>
					<span class="px-3 text-gray-400"><i class="fas fa-lock"></i></span>
					<input
						:type="showConfirmPassword ? 'text' : 'password'"
						v-model="registerForm.password_confirmation"
						placeholder="••••••••"
						class="w-full text-gray-800 p-2 outline-none"
						required
					/>
					<button
						type="button"
						@click="showConfirmPassword = !showConfirmPassword"
						class="absolute right-3 text-gray-600"
					>
						{{ showConfirmPassword ? 'Hide' : 'Show' }}
					</button>
				</div>

				<button
					type="submit"
					class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition hover:scale-105 transition-transform active:scale-95 shadow-md"
				>
					Register
				</button>
			</form>

			<p class="mt-6 text-sm text-center text-gray-600">
				Already have an account?
				<router-link
					to="/login"
					class="text-indigo-600 hover:underline font-semibold"
				>
					Login here
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

.tab-tongue {
	position: absolute;
	bottom: -6px;
	left: 50%;
	width: 12px;
	height: 6px;
	background: #3b82f6; /* Matches tab color */
	clip-path: polygon(0 0, 100% 0, 50% 100%);
	transform: translateX(-50%);
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
