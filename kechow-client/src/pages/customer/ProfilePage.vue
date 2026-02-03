<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="mb-6">
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
					Mi Perfil
				</h1>
				<p class="text-gray-600 dark:text-gray-400 mt-2">
					Administra tu información personal y direcciones
				</p>
			</div>

			<div v-if="loading" class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
				<p class="mt-4 text-gray-600 dark:text-gray-400">Cargando perfil...</p>
			</div>

			<div v-else class="space-y-6">
				<!-- Profile Information -->
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
							Información Personal
						</h2>
						<button
							@click="editingProfile = !editingProfile"
							class="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
						>
							{{ editingProfile ? 'Cancelar' : 'Editar' }}
						</button>
					</div>

					<div v-if="!editingProfile" class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Nombre
							</label>
							<p class="text-gray-900 dark:text-white">{{ profile.name }}</p>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Email
							</label>
							<p class="text-gray-900 dark:text-white">{{ profile.email }}</p>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Teléfono
							</label>
							<p class="text-gray-900 dark:text-white">{{ profile.phone }}</p>
						</div>
					</div>

					<div v-else class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Nombre
							</label>
							<input
								v-model="editedProfile.name"
								type="text"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Email
							</label>
							<input
								v-model="editedProfile.email"
								type="email"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Teléfono
							</label>
							<input
								v-model="editedProfile.phone"
								type="tel"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>
						<button
							@click="saveProfile"
							:disabled="saving"
							class="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50"
						>
							{{ saving ? 'Guardando...' : 'Guardar Cambios' }}
						</button>
					</div>
				</div>

				<!-- Addresses -->
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
							Mis Direcciones
						</h2>
						<button
							@click="showAddAddress = true"
							class="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
						>
							+ Agregar Dirección
						</button>
					</div>

					<div v-if="profile.addresses.length === 0" class="text-center py-8">
						<p class="text-gray-600 dark:text-gray-400 mb-4">
							No tienes direcciones guardadas
						</p>
					</div>

					<div v-else class="space-y-4">
						<div
							v-for="address in profile.addresses"
							:key="address.id"
							class="border border-primary-300 dark:border-gray-700 rounded-lg p-4"
						>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-2">
										<span class="font-semibold text-gray-900 dark:text-white">
											{{ address.label }}
										</span>
										<span
											v-if="address.isDefault"
											class="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded"
										>
											Predeterminada
										</span>
									</div>
									<p class="text-sm text-gray-600 dark:text-gray-400">
										{{ address.street }}, {{ address.city }}, {{ address.state }}
										{{ address.zipCode }}
									</p>
								</div>
								<div class="flex gap-2">
									<button
										@click="editAddress(address)"
										class="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
									>
										<i class="ri-edit-line"></i>
									</button>
									<button
										@click="removeAddress(address.id)"
										class="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
									>
										<i class="ri-delete-bin-line"></i>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Add/Edit Address Modal -->
		<div
			v-if="showAddAddress || editingAddress"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			@click.self="closeAddressModal"
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
				@click.stop
			>
				<h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
					{{ editingAddress ? 'Editar Dirección' : 'Agregar Dirección' }}
				</h3>
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
							Etiqueta
						</label>
						<input
							v-model="addressForm.label"
							type="text"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
							Calle y Número
						</label>
						<input
							v-model="addressForm.street"
							type="text"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						/>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
								Ciudad
							</label>
							<input
								v-model="addressForm.city"
								type="text"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
								Estado
							</label>
							<input
								v-model="addressForm.state"
								type="text"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>
					</div>
					<div>
						<label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
							Código Postal
						</label>
						<input
							v-model="addressForm.zipCode"
							type="text"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						/>
					</div>
					<label class="flex items-center gap-2">
						<input
							v-model="addressForm.isDefault"
							type="checkbox"
							class="text-purple-500"
						/>
						<span class="text-sm text-gray-700 dark:text-gray-300">
							Establecer como dirección predeterminada
						</span>
					</label>
				</div>
				<div class="flex gap-3 mt-6">
					<button
						@click="closeAddressModal"
						class="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
					>
						Cancelar
					</button>
					<button
						@click="saveAddress"
						:disabled="savingAddress"
						class="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50"
					>
						{{ savingAddress ? 'Guardando...' : 'Guardar' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import {
	getCustomerProfile,
	updateCustomerProfile,
	addAddress,
	updateAddress,
	deleteAddress,
	type CustomerProfile,
	type Address,
} from '@/features/customer/services/customer.service';

const toast = useToast();

const profile = ref<CustomerProfile>({
	id: '',
	name: '',
	email: '',
	phone: '',
	addresses: [],
});
const loading = ref(true);
const editingProfile = ref(false);
const saving = ref(false);
const editedProfile = ref({
	name: '',
	email: '',
	phone: '',
});

const showAddAddress = ref(false);
const editingAddress = ref(false);
const savingAddress = ref(false);
const addressForm = ref<Omit<Address, 'id'>>({
	label: '',
	street: '',
	city: '',
	state: '',
	zipCode: '',
	isDefault: false,
});
const editingAddressId = ref<string>('');

onMounted(async () => {
	await loadProfile();
});

const loadProfile = async () => {
	try {
		loading.value = true;
		const profileData = await getCustomerProfile();
		profile.value = profileData;
		editedProfile.value = {
			name: profileData.name,
			email: profileData.email,
			phone: profileData.phone,
		};
	} catch (error) {
		toast.error('Error al cargar perfil');
	} finally {
		loading.value = false;
	}
};

const saveProfile = async () => {
	try {
		saving.value = true;
		const updated = await updateCustomerProfile({
			name: editedProfile.value.name,
			email: editedProfile.value.email,
			phone: editedProfile.value.phone,
		});
		profile.value = updated;
		editingProfile.value = false;
		toast.success('Perfil actualizado exitosamente');
	} catch (error) {
		toast.error('Error al actualizar perfil');
	} finally {
		saving.value = false;
	}
};

const editAddress = (address: Address) => {
	editingAddress.value = true;
	editingAddressId.value = address.id;
	addressForm.value = {
		label: address.label,
		street: address.street,
		city: address.city,
		state: address.state,
		zipCode: address.zipCode,
		isDefault: address.isDefault,
	};
};

const closeAddressModal = () => {
	showAddAddress.value = false;
	editingAddress.value = false;
	editingAddressId.value = '';
	addressForm.value = {
		label: '',
		street: '',
		city: '',
		state: '',
		zipCode: '',
		isDefault: false,
	};
};

const saveAddress = async () => {
	if (!addressForm.value.label || !addressForm.value.street) {
		toast.error('Por favor completa todos los campos requeridos');
		return;
	}

	try {
		savingAddress.value = true;
		if (editingAddress.value) {
			const updated = await updateAddress(editingAddressId.value, addressForm.value);
			const index = profile.value.addresses.findIndex((a) => a.id === editingAddressId.value);
			if (index !== -1) {
				profile.value.addresses[index] = updated;
			}
		} else {
			const newAddr = await addAddress(addressForm.value);
			profile.value.addresses.push(newAddr);
		}
		closeAddressModal();
		toast.success('Dirección guardada exitosamente');
	} catch (error) {
		toast.error('Error al guardar dirección');
	} finally {
		savingAddress.value = false;
	}
};

const removeAddress = async (addressId: string) => {
	if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;

	try {
		await deleteAddress(addressId);
		profile.value.addresses = profile.value.addresses.filter((a) => a.id !== addressId);
		toast.success('Dirección eliminada exitosamente');
	} catch (error) {
		toast.error('Error al eliminar dirección');
	}
};
</script>
