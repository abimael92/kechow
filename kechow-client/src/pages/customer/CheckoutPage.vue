<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="mb-6">
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
					Finalizar Pedido
				</h1>
				<p class="text-gray-600 dark:text-gray-400 mt-2">
					Revisa tu pedido y completa la información de entrega
				</p>
			</div>

			<div v-if="loading" class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
				<p class="mt-4 text-gray-600 dark:text-gray-400">Procesando...</p>
			</div>

			<div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- Order Summary -->
				<div class="lg:col-span-2 space-y-6">
					<!-- Delivery Address -->
					<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
						<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
							Dirección de Entrega
						</h2>
						<div v-if="addresses.length > 0" class="space-y-3">
							<label
								v-for="address in addresses"
								:key="address.id"
								class="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors"
								:class="
									selectedAddressId === address.id
										? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
										: 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
								"
							>
								<input
									type="radio"
									v-model="selectedAddressId"
									:value="address.id"
									class="mt-1"
								/>
								<div class="flex-1">
									<div class="flex items-center justify-between">
										<span class="font-medium text-gray-900 dark:text-white">
											{{ address.label }}
										</span>
										<span
											v-if="address.isDefault"
											class="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded"
										>
											Predeterminada
										</span>
									</div>
									<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
										{{ address.street }}, {{ address.city }}, {{ address.state }}
										{{ address.zipCode }}
									</p>
								</div>
							</label>
						</div>
						<button
							@click="showAddAddress = true"
							class="mt-4 w-full py-2 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-purple-500 hover:text-purple-600 transition-colors"
						>
							+ Agregar Nueva Dirección
						</button>
					</div>

					<!-- Special Instructions -->
					<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
						<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
							Instrucciones Especiales
						</h2>
						<textarea
							v-model="specialInstructions"
							rows="4"
							placeholder="Ej: Llamar antes de llegar, dejar en la puerta, etc."
							class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						></textarea>
					</div>

					<!-- Payment Method (State only, no actual payment) -->
					<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
						<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
							Método de Pago
						</h2>
						<div class="space-y-3">
							<label
								v-for="method in paymentMethods"
								:key="method.value"
								class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors"
								:class="
									selectedPaymentMethod === method.value
										? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
										: 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
								"
							>
								<input
									type="radio"
									v-model="selectedPaymentMethod"
									:value="method.value"
									class="text-purple-500"
								/>
								<span class="font-medium text-gray-900 dark:text-white">
									{{ method.label }}
								</span>
							</label>
						</div>
					</div>
				</div>

				<!-- Order Summary Sidebar -->
				<div class="lg:col-span-1">
					<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-6">
						<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
							Resumen del Pedido
						</h2>

						<!-- Items -->
						<div class="space-y-3 mb-4">
							<div
								v-for="item in cartItems"
								:key="item.id"
								class="flex justify-between text-sm"
							>
								<span class="text-gray-600 dark:text-gray-400">
									{{ item.name }} x{{ item.quantity }}
								</span>
								<span class="font-medium text-gray-900 dark:text-white">
									${{ (item.price * item.quantity).toFixed(2) }}
								</span>
							</div>
						</div>

						<hr class="my-4 border-gray-200 dark:border-gray-700" />

						<!-- Totals -->
						<div class="space-y-2 text-sm">
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">Subtotal</span>
								<span class="text-gray-900 dark:text-white">${{ subtotal.toFixed(2) }}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">Envío</span>
								<span class="text-gray-900 dark:text-white">
									{{ deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Gratis' }}
								</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">Impuesto (8%)</span>
								<span class="text-gray-900 dark:text-white">${{ tax.toFixed(2) }}</span>
							</div>
							<hr class="my-2 border-gray-200 dark:border-gray-700" />
							<div class="flex justify-between text-lg font-bold">
								<span class="text-gray-900 dark:text-white">Total</span>
								<span class="text-purple-600 dark:text-purple-400">
									${{ total.toFixed(2) }}
								</span>
							</div>
						</div>

						<!-- Place Order Button (disabled offline) -->
						<button
							@click="placeOrder"
							:disabled="!canPlaceOrder || processing || !isOnline"
							class="w-full mt-6 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							:title="!isOnline ? $t('offline') : ''"
						>
							{{ !isOnline ? $t('offline') : processing ? $t('processing') || 'Procesando...' : `Confirmar Pedido - $${total.toFixed(2)}` }}
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Add Address Modal -->
		<div
			v-if="showAddAddress"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			@click.self="showAddAddress = false"
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
				@click.stop
			>
				<h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
					Agregar Dirección
				</h3>
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
							Etiqueta (Ej: Casa, Trabajo)
						</label>
						<input
							v-model="newAddress.label"
							type="text"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
							Calle y Número
						</label>
						<input
							v-model="newAddress.street"
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
								v-model="newAddress.city"
								type="text"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
								Estado
							</label>
							<input
								v-model="newAddress.state"
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
							v-model="newAddress.zipCode"
							type="text"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						/>
					</div>
					<label class="flex items-center gap-2">
						<input
							v-model="newAddress.isDefault"
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
						@click="showAddAddress = false"
						class="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
					>
						Cancelar
					</button>
					<button
						@click="saveAddress"
						class="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
					>
						Guardar
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useCartStore } from '@/features/customer/cart/cart.store';
import { useOnline } from '@/shared/composables/useOnline';
import {
	getCustomerProfile,
	addAddress,
	type Address,
	createOrder,
} from '@/features/customer/services/customer.service';

const router = useRouter();
const toast = useToast();
const cartStore = useCartStore();

const loading = ref(false);
const processing = ref(false);
const addresses = ref<Address[]>([]);
const selectedAddressId = ref<string>('');
const specialInstructions = ref('');
const selectedPaymentMethod = ref<'cash' | 'card' | 'online'>('cash');
const showAddAddress = ref(false);
const newAddress = ref<Omit<Address, 'id'>>({
	label: '',
	street: '',
	city: '',
	state: '',
	zipCode: '',
	isDefault: false,
});

const cartItems = computed(() => cartStore.items);
const subtotal = computed(() =>
	cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
const deliveryFee = computed(() => (subtotal.value > 250 ? 0 : 50));
const tax = computed(() => subtotal.value * 0.08);
const total = computed(() => subtotal.value + deliveryFee.value + tax.value);

const { isOnline } = useOnline();

const canPlaceOrder = computed(() => {
	return (
		selectedAddressId.value !== '' &&
		cartItems.value.length > 0 &&
		!processing.value &&
		isOnline.value
	);
});

const paymentMethods = [
	{ value: 'cash', label: 'Efectivo al entregar' },
	{ value: 'card', label: 'Tarjeta (simulado)' },
	{ value: 'online', label: 'Pago en línea (simulado)' },
];

onMounted(async () => {
	loading.value = true;
	try {
		const profile = await getCustomerProfile();
		addresses.value = profile.addresses;
		if (profile.addresses.length > 0) {
			const defaultAddress = profile.addresses.find((a) => a.isDefault);
			selectedAddressId.value = defaultAddress
				? defaultAddress.id
				: profile.addresses[0].id;
		}
	} catch (error) {
		toast.error('Error al cargar perfil');
	} finally {
		loading.value = false;
	}
});

const saveAddress = async () => {
	if (!newAddress.value.label || !newAddress.value.street) {
		toast.error('Por favor completa todos los campos requeridos');
		return;
	}

	try {
		const address = await addAddress(newAddress.value);
		addresses.value.push(address);
		if (address.isDefault) {
			selectedAddressId.value = address.id;
		}
		showAddAddress.value = false;
		newAddress.value = {
			label: '',
			street: '',
			city: '',
			state: '',
			zipCode: '',
			isDefault: false,
		};
		toast.success('Dirección agregada exitosamente');
	} catch (error) {
		toast.error('Error al agregar dirección');
	}
};

const placeOrder = async () => {
	if (!canPlaceOrder.value) return;

	processing.value = true;
	try {
		const selectedAddress = addresses.value.find(
			(a) => a.id === selectedAddressId.value
		);
		if (!selectedAddress) {
			toast.error('Por favor selecciona una dirección');
			return;
		}

		const fullAddress = `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}`;

		const order = await createOrder({
			restaurantId: 1, // TODO: Get from cart context
			items: cartItems.value.map((item) => ({
				menuItemId: item.id.toString(),
				quantity: item.quantity,
			})),
			deliveryAddress: fullAddress,
			specialInstructions: specialInstructions.value,
			paymentMethod: selectedPaymentMethod.value,
		});

		cartStore.clearCart();
		toast.success('¡Pedido realizado con éxito!');
		router.push({
			name: 'OrderTracking',
			params: { id: order.id },
		});
	} catch (error) {
		toast.error('Error al realizar el pedido');
	} finally {
		processing.value = false;
	}
};
</script>
