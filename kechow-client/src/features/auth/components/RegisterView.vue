<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/app/store/auth/auth.store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
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
	try {
		await authStore.register({
			name: registerForm.name,
			email: registerForm.email,
			password: registerForm.password,
			password_confirmation: registerForm.password_confirmation,
			role: registerForm.role,
		});
	} catch (error) {
		alert(t('registrationFailed'));
	}
}
</script>

<template>
	<div class="min-h-screen flex items-center justify-center">
		<div
			class="bg-white shadow-lg p-10 w-full max-w-lg animate-fade-in relative"
			:class="{ 'customer-view': setRole }"
			style="border-radius: 12px 0 12px 12px"
		>
			<!-- Role Tabs -->
			<div class="absolute top-0 right-0 -translate-y-full">
				<div
					class="join-us-tab cursor-pointer"
					:class="{ 'change-customer': setRole }"
					@click="joinUsClicked"
				>
					{{ setRole ? t('orderNow') : t('joinUs') }}
					<div class="tab-tongue" :class="{ 'bg-changed': setRole }"></div>
				</div>
			</div>

			<div class="flex flex-col items-center justify-center gap-2">
				<h2
					class="text-2xl font-bold mb-2 text-center text-gradient-pulse text-primary"
				>
					{{ t('createAccount') }}
				</h2>
			</div>

			<p class="text-sm text-center text-gray-500 mb-6">
				{{ t('joinKechow') }} <br />
				{{ setRole ? t('registerAsOwnerDelivery') : t('getFoodFast') }}
			</p>

			<form
				@submit.prevent="handleRegister"
				class="space-y-6 animate-slide-up p-6 rounded-2xl max-w-md mx-auto"
			>
				<!-- Name -->
				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700">{{
						t('name')
					}}</label>
					<div
						class="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500"
					>
						<span class="px-3 text-gray-400"><i class="fas fa-user"></i></span>
						<input
							v-model="registerForm.name"
							type="text"
							:placeholder="t('namePlaceholder')"
							class="w-full text-gray-800 p-2 outline-none"
							required
						/>
					</div>
				</div>

				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700">{{
						t('email')
					}}</label>
					<div
						class="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500"
					>
						<span class="px-3 text-gray-400"
							><i class="fas fa-envelope"></i
						></span>
						<input
							v-model="registerForm.email"
							type="email"
							:placeholder="t('emailPlaceholder')"
							class="w-full text-gray-800 p-2 outline-none"
							required
						/>
					</div>
				</div>

				<!-- Password -->
				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700">{{
						t('password')
					}}</label>
					<div
						class="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 relative"
					>
						<span class="px-3 text-gray-400"><i class="fas fa-lock"></i></span>
						<input
							:type="showPassword ? 'text' : 'password'"
							v-model="registerForm.password"
							:placeholder="t('passwordPlaceholder')"
							class="w-full p-2 text-gray-800 outline-none"
							required
						/>
						<button
							type="button"
							@click="showPassword = !showPassword"
							class="absolute right-0 text-white"
						>
							<i :class="!showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
						</button>
					</div>
				</div>

				<!-- Confirm Password -->
				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700">{{
						t('confirmPassword')
					}}</label>
					<div
						class="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 relative"
					>
						<span class="px-3 text-gray-400"><i class="fas fa-lock"></i></span>
						<input
							:type="showConfirmPassword ? 'text' : 'password'"
							v-model="registerForm.password_confirmation"
							:placeholder="t('passwordPlaceholder')"
							class="w-full text-gray-800 p-2 outline-none"
							required
						/>
						<button
							type="button"
							@click="showConfirmPassword = !showConfirmPassword"
							class="absolute right-0 text-white"
						>
							<i
								:class="
									!showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
								"
							></i>
						</button>
					</div>
				</div>

				<!-- Role Select -->
				<div v-if="setRole">
					<label class="block mb-1 text-sm font-medium text-gray-700"
						>{{ t('registerAs') }} <span class="text-red-600">*</span></label
					>
					<select
						v-model="registerForm.role"
						required
						class="w-full p-2 text-white"
					>
						<option value="owner">{{ t('owner') }}</option>
						<option value="delivery">{{ t('delivery') }}</option>
					</select>
				</div>

				<button
					type="submit"
					class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition hover:scale-105 transition-transform active:scale-95 shadow-md"
				>
					{{ t('register') }}
				</button>
			</form>

			<p class="mt-6 text-sm text-center text-white">
				{{ t('alreadyHaveAccount') }}
				<router-link
					to="/login"
					class="text-indigo-600 hover:underline font-semibold"
				>
					{{ t('loginHere') }}
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
