<template>
	<div class="min-w-0 bg-gradient-to-br from-primary-50 via-primary-100/40 to-primary-200/50 text-secondary-900 dark:bg-secondary-900 dark:text-secondary-100 dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-800 font-sans transition-colors duration-300">

		<!-- HEADER -->
		<div class="max-w-7xl mx-auto px-4 mb-8 sm:px-6 lg:px-8 pt-4 lg:pt-8">
			<div class="flex items-center gap-2 sm:gap-3 md:gap-4">
				<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
					<i class="ri-shopping-bag-3-line text-white text-lg sm:text-xl md:text-2xl"></i>
				</div>
				<div class="min-w-0 flex-1">
					<h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-snug">
					Mi Perfil
					</h1>
					<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none line-clamp-1">
					Administra tu información personal y direcciones
					</p>
				</div>
			</div>
		</div>
		<!-- MAIN CONTENT  -->
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
			<div v-if="loading" class="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-secondary-800 rounded-lg border border-primary-100 dark:border-secondary-700">
				<div class="text-center max-w-sm mx-auto px-4 py-8">
					<div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
						<i class="ri-loader-4-line text-3xl text-primary-600 dark:text-primary-400 animate-spin"></i>
					</div>
					<p class="text-secondary-600 dark:text-secondary-400">Cargando perfil...</p>
				</div>
			</div>

			<div v-else class="space-y-6">
				<!-- Profile Information -->
				<div class="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-primary-100/50 dark:border-secondary-700 shadow-lg hover:shadow-xl transition-all duration-300">
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
							<i class="ri-user-settings-line text-primary-500"></i>
							Información Personal
						</h2>
						<button
							@click="editingProfile = !editingProfile"
							class="min-h-[44px] px-5 py-2 rounded-xl font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
						>
							{{ editingProfile ? 'Cancelar' : 'Editar' }}
						</button>
					</div>

					<div v-if="!editingProfile" class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Nombre</label>
							<p class="text-secondary-900 dark:text-white">{{ profile.name }}</p>
						</div>
						<div>
							<label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Email</label>
							<p class="text-secondary-900 dark:text-white">{{ profile.email }}</p>
						</div>
						<div>
							<label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Teléfono</label>
							<p class="text-secondary-900 dark:text-white">{{ profile.phone || '—' }}</p>
						</div>
					</div>

					<div v-else class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Nombre</label>
							<input
								v-model="editedProfile.name"
								type="text"
								class="w-full px-4 py-2.5 border border-secondary-200 dark:border-secondary-700 rounded-xl bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white min-h-[44px] focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Email</label>
							<input
								v-model="editedProfile.email"
								type="email"
								class="w-full px-4 py-2.5 border border-secondary-200 dark:border-secondary-700 rounded-xl bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white min-h-[44px] focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Teléfono</label>
							<input
								v-model="editedProfile.phone"
								type="tel"
								class="w-full px-4 py-2.5 border border-secondary-200 dark:border-secondary-700 rounded-xl bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white min-h-[44px] focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
							/>
						</div>
						<button
							@click="saveProfile"
							:disabled="saving"
							class="w-full min-h-[44px] py-2.5 px-4 rounded-xl font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
						>
							{{ saving ? 'Guardando...' : 'Guardar Cambios' }}
						</button>
					</div>
				</div>

				<!-- Direcciones -->
				<div class="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-primary-100/50 dark:border-secondary-700 shadow-lg hover:shadow-xl transition-all duration-300">
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
						<h2 class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
							<i class="ri-map-pin-line text-primary-500"></i>
							Direcciones
						</h2>
						<button
							@click="openAddAddress"
							class="min-h-[44px] px-5 py-2 rounded-xl font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
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
					class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
					role="dialog"
					aria-modal="true"
					aria-labelledby="address-modal-title"
					@click.self="closeAddressModal"
				>
					<div
						class="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-primary-100/50 dark:border-secondary-700"
						@click.stop
					>
						<div class="p-4 sm:p-6 sticky top-0 bg-white dark:bg-secondary-800 border-b border-primary-100/50 dark:border-secondary-700 flex items-center justify-between">
							<h3 id="address-modal-title" class="text-xl font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
								<i class="ri-map-pin-add-line text-primary-500"></i>
								{{ editingAddress ? 'Editar Dirección' : 'Agregar Dirección' }}
							</h3>
							<button 
								@click="closeAddressModal"
								class="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
							>
								<i class="ri-close-line text-xl text-secondary-600 dark:text-secondary-400"></i>
							</button>
						</div>
						<div class="p-4 sm:p-6">
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
import { ref, reactive } from 'vue'
import AddressList from '@/features/customer/addresses/AddressList.vue';  // ✅ Correct path
import AddressForm from '@/features/customer/addresses/AddressForm.vue';  // ✅ Correct path

const loading = ref(false)
const editingProfile = ref(false)
const saving = ref(false)
const showAddressModal = ref(false)
const editingAddress = ref<any>(null)
const savingAddress = ref(false)

const profile = reactive({
	name: '',
	email: '',
	phone: '',
	addresses: []
})

const editedProfile = reactive({
	name: '',
	email: '',
	phone: ''
})

const addressFormModel = ref({})

const saveProfile = async () => {
	saving.value = true
	// TODO: Implement profile save logic
	saving.value = false
	editingProfile.value = false
}

const openAddAddress = () => {
	editingAddress.value = null
	addressFormModel.value = {}
	showAddressModal.value = true
}

const editAddress = (address: any) => {
	editingAddress.value = address
	addressFormModel.value = { ...address }
	showAddressModal.value = true
}

const closeAddressModal = () => {
	showAddressModal.value = false
	editingAddress.value = null
	addressFormModel.value = {}
}

const saveAddress = async (addressData: any) => {
	savingAddress.value = true
	// TODO: Implement address save logic
	savingAddress.value = false
	closeAddressModal()
}

const setDefaultAddress = async (addressId: any) => {
	// TODO: Implement set default address logic
}

const removeAddress = async (addressId: any) => {
	// TODO: Implement remove address logic
}
</script>