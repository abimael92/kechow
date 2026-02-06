<template>
	<div class="min-h-screen bg-app dark:bg-secondary-900 py-6 px-4 sm:px-6 lg:px-8">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="mb-6">
				<h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
					Mi Perfil
				</h1>
				<p class="text-gray-600 dark:text-gray-400 mt-2">
					Administra tu información personal y direcciones
				</p>
			</div>

			<div v-if="loading" class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
				<p class="mt-4 text-gray-600 dark:text-gray-400">Cargando perfil...</p>
			</div>

			<div v-else class="space-y-6">
				<!-- Profile Information -->
				<div class="bg-card dark:bg-gray-800 rounded-xl shadow-soft border border-primary-100 dark:border-gray-700 p-4 sm:p-6">
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
							Información Personal
						</h2>
						<button
							@click="editingProfile = !editingProfile"
							class="min-h-[44px] px-4 py-2 rounded-button font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors"
						>
							{{ editingProfile ? 'Cancelar' : 'Editar' }}
						</button>
					</div>

					<div v-if="!editingProfile" class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
							<p class="text-gray-900 dark:text-white">{{ profile.name }}</p>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
							<p class="text-gray-900 dark:text-white">{{ profile.email }}</p>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
							<p class="text-gray-900 dark:text-white">{{ profile.phone || '—' }}</p>
						</div>
					</div>

					<div v-else class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
							<input
								v-model="editedProfile.name"
								type="text"
								class="w-full px-4 py-2.5 border border-secondary-300 dark:border-gray-600 rounded-input bg-card text-gray-900 dark:text-white min-h-[44px]"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
							<input
								v-model="editedProfile.email"
								type="email"
								class="w-full px-4 py-2.5 border border-secondary-300 dark:border-gray-600 rounded-input bg-card text-gray-900 dark:text-white min-h-[44px]"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
							<input
								v-model="editedProfile.phone"
								type="tel"
								class="w-full px-4 py-2.5 border border-secondary-300 dark:border-gray-600 rounded-input bg-card text-gray-900 dark:text-white min-h-[44px]"
							/>
						</div>
						<button
							@click="saveProfile"
							:disabled="saving"
							class="w-full min-h-[44px] py-2 px-4 rounded-button font-semibold bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition-colors"
						>
							{{ saving ? 'Guardando...' : 'Guardar Cambios' }}
						</button>
					</div>
				</div>

				<!-- Direcciones -->
				<div class="bg-card dark:bg-gray-800 rounded-xl shadow-soft border border-primary-100 dark:border-gray-700 p-4 sm:p-6">
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
						<h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
							Direcciones
						</h2>
						<button
							@click="openAddAddress"
							class="min-h-[44px] px-4 py-2 rounded-button font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
						>
							<i class="ri-add-line text-lg" aria-hidden="true"></i>
							Agregar Dirección
						</button>
					</div>

					<AddressList
						:addresses="profile.addresses"
						@set-default="setDefaultAddress"
						@edit="editAddress"
						@delete="removeAddress"
					/>
				</div>
			</div>
		</div>

		<!-- Modal: Add/Edit Address -->
		<Teleport to="body">
			<Transition name="modal">
				<div
					v-if="showAddressModal"
					class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
					role="dialog"
					aria-modal="true"
					aria-labelledby="address-modal-title"
					@click.self="closeAddressModal"
				>
					<div
						class="bg-card dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
						@click.stop
					>
						<div class="p-4 sm:p-6 sticky top-0 bg-card dark:bg-gray-800 border-b border-primary-100 dark:border-gray-700">
							<h3 id="address-modal-title" class="text-xl font-semibold text-gray-900 dark:text-white">
								{{ editingAddress ? 'Editar Dirección' : 'Agregar Dirección' }}
							</h3>
						</div>
						<div class="p-4 sm:p-6 pt-0">
							<AddressForm
								:model-value="addressFormModel"
								:saving="savingAddress"
								@submit="saveAddress"
								@cancel="closeAddressModal"
							/>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import {
	getCustomerProfile,
	updateCustomerProfile,
	addAddress,
	updateAddress,
	deleteAddress,
	setDefaultAddress as apiSetDefaultAddress,
	type CustomerProfile,
	type Address,
} from '@/features/customer/services/customer.service';
import AddressForm from '@/features/customer/addresses/AddressForm.vue';
import AddressList from '@/features/customer/addresses/AddressList.vue';

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

const showAddressModal = ref(false);
const editingAddress = ref(false);
const savingAddress = ref(false);
const editingAddressId = ref<string>('');

const addressFormModel = computed(() => {
	if (!editingAddress.value || !editingAddressId.value) return null;
	return profile.value.addresses.find((a) => a.id === editingAddressId.value) ?? null;
});

onMounted(async () => {
	await loadProfile();
});

async function loadProfile() {
	try {
		loading.value = true;
		const profileData = await getCustomerProfile();
		profile.value = profileData;
		editedProfile.value = {
			name: profileData.name,
			email: profileData.email,
			phone: profileData.phone,
		};
	} catch {
		toast.error('Error al cargar perfil');
	} finally {
		loading.value = false;
	}
}

async function saveProfile() {
	try {
		saving.value = true;
		const updated = await updateCustomerProfile({
			name: editedProfile.value.name,
			email: editedProfile.value.email,
			phone: editedProfile.value.phone,
		});
		profile.value = updated;
		editingProfile.value = false;
		toast.success('Perfil actualizado');
	} catch {
		toast.error('Error al actualizar perfil');
	} finally {
		saving.value = false;
	}
}

function openAddAddress() {
	editingAddressId.value = '';
	editingAddress.value = false;
	showAddressModal.value = true;
}

function editAddress(address: Address) {
	editingAddressId.value = address.id;
	editingAddress.value = true;
	showAddressModal.value = true;
}

function closeAddressModal() {
	showAddressModal.value = false;
	editingAddress.value = false;
	editingAddressId.value = '';
}

async function saveAddress(payload: Omit<Address, 'id'>) {
	try {
		savingAddress.value = true;
		if (editingAddress.value && editingAddressId.value) {
			const updated = await updateAddress(editingAddressId.value, payload);
			const index = profile.value.addresses.findIndex((a) => a.id === editingAddressId.value);
			if (index !== -1) profile.value.addresses[index] = updated;
		} else {
			const newAddr = await addAddress(payload);
			profile.value.addresses.push(newAddr);
		}
		closeAddressModal();
		toast.success('Dirección guardada');
	} catch {
		toast.error('Error al guardar dirección');
	} finally {
		savingAddress.value = false;
	}
}

async function setDefaultAddress(addressId: string) {
	try {
		const updated = await apiSetDefaultAddress(addressId);
		const index = profile.value.addresses.findIndex((a) => a.id === addressId);
		if (index !== -1) profile.value.addresses[index] = updated;
		profile.value.addresses = profile.value.addresses.map((a) => ({
			...a,
			isDefault: a.id === addressId,
		}));
		toast.success('Dirección predeterminada actualizada');
	} catch {
		toast.error('Error al marcar dirección predeterminada');
	}
}

async function removeAddress(addressId: string) {
	if (!confirm('¿Eliminar esta dirección?')) return;
	try {
		await deleteAddress(addressId);
		profile.value.addresses = profile.value.addresses.filter((a) => a.id !== addressId);
		toast.success('Dirección eliminada');
	} catch {
		toast.error('Error al eliminar dirección');
	}
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}
.modal-enter-active .bg-card,
.modal-leave-active .bg-card {
	transition: transform 0.2s ease;
}
.modal-enter-from .bg-card,
.modal-leave-to .bg-card {
	transform: scale(0.98);
}
</style>
