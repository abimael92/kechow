<template>
	<div
		class="min-h-screen sm:min-h-0 py-4 md:py-6 min-w-0 overflow-x-hidden bg-white dark:bg-secondary-900"
		:class="{ 'flex flex-col': !standalone }"
	>
		<div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 w-full min-w-0 flex-1">
			<!-- Header - Clean and simple -->
			<header class="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-8 gap-4 sm:gap-0">
				<button
					v-if="!standalone"
					@click="$emit('close')"
					class="flex items-center gap-2 px-3 py-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors self-start sm:self-auto w-full sm:w-auto min-h-[44px]"
				>
					<i class="ri-arrow-left-line text-lg"></i>
					<span class="font-medium">Cerrar</span>
				</button>
				<button
					v-else
					@click="continueShopping"
					class="flex items-center gap-2 px-3 py-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors self-start sm:self-auto w-full sm:w-auto min-h-[44px]"
				>
					<i class="ri-shopping-bag-3-line text-lg"></i>
					<span class="font-medium">Seguir comprando</span>
				</button>

				<div class="flex-1 text-center order-first sm:order-none">
					<h1 class="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">
						Mi carrito
					</h1>
					<p class="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
						{{ itemCount === 1 ? '1 artículo' : `${itemCount} artículos` }}
					</p>
				</div>

				<div class="w-16 sm:w-20 hidden sm:block"></div>
			</header>

			<!-- Main -->
			<div class="grid gap-6 md:gap-8">
				<!-- Items -->
				<div class="lg:col-span-2 space-y-3">
					<TransitionGroup name="list">
						<div
							v-for="item in cartStore.items"
							:key="String(item.id)"
							:class="[
								'bg-white dark:bg-secondary-800 rounded-lg border p-4 transition-all duration-300',
								removingId === item.id ? 'opacity-0 scale-95' : 'opacity-100',
								'border-secondary-200 dark:border-secondary-700',
								!item.is_available && 'bg-secondary-50 dark:bg-secondary-800/50'
							]"
						>
							<div class="flex gap-4">
								<img
									:src="item.image_url || '/images/placeholder-image.png'"
									:alt="item.name"
									class="w-20 h-20 object-cover rounded-lg border border-secondary-200 dark:border-secondary-700"
								/>
								
								<div class="flex-1 min-w-0">
									<div class="flex justify-between gap-2">
										<div>
											<h3 class="font-medium text-secondary-900 dark:text-white truncate">
												{{ item.name }}
											</h3>
											<p class="text-primary-600 dark:text-primary-400 font-semibold mt-0.5">
												${{ formatPrice(item.price) }}
											</p>
										</div>
										<button
											@click="remove(item.id)"
											class="text-secondary-400 hover:text-red-500 dark:text-secondary-500 dark:hover:text-red-400 p-2 -mt-1 -mr-1 transition-colors"
											aria-label="Eliminar"
										>
											<i class="ri-close-line text-xl"></i>
										</button>
									</div>
									
									<div class="flex items-center justify-between mt-3">
										<div class="flex items-center border border-secondary-200 dark:border-secondary-700 rounded-lg">
											<button
												@click="decrease(item)"
												:disabled="item.quantity <= 1"
												class="w-8 h-8 flex items-center justify-center text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-40 transition-colors"
											>
												<i class="ri-subtract-line text-sm"></i>
											</button>
											<span class="w-8 text-center text-sm font-medium text-secondary-900 dark:text-white">
												{{ item.quantity }}
											</span>
											<button
												@click="increase(item)"
												:disabled="isAtMax(item)"
												class="w-8 h-8 flex items-center justify-center text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-40 transition-colors"
											>
												<i class="ri-add-line text-sm"></i>
											</button>
										</div>
										<p class="font-semibold text-secondary-900 dark:text-white">
											${{ formatPrice(item.price * item.quantity) }}
										</p>
									</div>
									
									<p v-if="!item.is_available" class="text-xs text-amber-600 dark:text-amber-400 mt-2">
										Ya no disponible
									</p>
								</div>
							</div>
						</div>
					</TransitionGroup>

					<!-- Empty - Perfectly centered -->
					<div
						v-if="!cartStore.items.length"
						class="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700"
					>
						<div class="text-center max-w-sm mx-auto px-4 py-8">
							<div class="w-20 h-20 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4">
								<i class="ri-shopping-cart-line text-3xl text-secondary-500 dark:text-secondary-400"></i>
							</div>
							<h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-2">
								Tu carrito está vacío
							</h3>
							<p class="text-sm text-secondary-500 dark:text-secondary-400 mb-6">
								Agrega platillos desde un restaurante para continuar
							</p>
							<button
								@click="continueShopping"
								class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
							>
								<i class="ri-store-3-line"></i>
								Ver restaurantes
							</button>
						</div>
					</div>
				</div>

				<!-- Summary -->
				<div v-if="cartStore.items.length" class="lg:col-span-1">
					<div class="sticky top-4 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 p-4">
						<h2 class="text-base font-semibold text-secondary-900 dark:text-white mb-3 pb-3 border-b border-secondary-200 dark:border-secondary-700">
							Resumen
						</h2>
						
						<div class="space-y-2 text-sm mb-4">
							<div class="flex justify-between">
								<span class="text-secondary-600 dark:text-secondary-400">Subtotal</span>
								<span class="font-medium text-secondary-900 dark:text-white">${{ formatPrice(cartStore.subtotal) }}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-secondary-600 dark:text-secondary-400">Envío</span>
								<span :class="cartStore.deliveryFee === 0 ? 'text-green-600 dark:text-green-400' : 'text-secondary-900 dark:text-white'">
									{{ cartStore.deliveryFee === 0 ? 'Gratis' : `$${formatPrice(cartStore.deliveryFee)}` }}
								</span>
							</div>
							<div class="flex justify-between">
								<span class="text-secondary-600 dark:text-secondary-400">IVA (8%)</span>
								<span class="font-medium text-secondary-900 dark:text-white">${{ formatPrice(cartStore.tax) }}</span>
							</div>
							
							<div class="border-t border-secondary-200 dark:border-secondary-700 pt-2 mt-2">
								<div class="flex justify-between text-base font-semibold">
									<span class="text-secondary-900 dark:text-white">Total</span>
									<span class="text-primary-600 dark:text-primary-400">${{ formatPrice(cartStore.total) }}</span>
								</div>
							</div>
						</div>

						<!-- Delivery progress - subtle -->
						<div v-if="cartStore.subtotal < 250" class="bg-secondary-50 dark:bg-secondary-700/30 rounded-lg p-3 mb-4 text-xs">
							<div class="flex justify-between text-secondary-600 dark:text-secondary-400 mb-1.5">
								<span>Agrega ${{ formatPrice(cartStore.amountToFreeDelivery) }} más</span>
								<span class="font-medium text-primary-600 dark:text-primary-400">{{ Math.round(cartStore.deliveryProgress) }}%</span>
							</div>
							<div class="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-1.5">
								<div
									class="bg-primary-500 h-1.5 rounded-full transition-all"
									:style="{ width: `${cartStore.deliveryProgress}%` }"
								></div>
							</div>
							<p class="text-secondary-500 dark:text-secondary-500 mt-1.5">para envío gratis</p>
						</div>

						<button
							@click="goCheckout"
							:disabled="!cartStore.isOnline"
							class="w-full py-3 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 disabled:bg-secondary-300 dark:disabled:bg-secondary-700 transition-colors"
						>
							<span v-if="!cartStore.isOnline">Sin conexión</span>
							<span v-else>Pagar ${{ formatPrice(cartStore.total) }}</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCartStore, type CartItemLocal } from '@/features/customer/cart/cart.store';

const props = withDefaults(
	defineProps<{ standalone?: boolean }>(),
	{ standalone: true }
);

const emit = defineEmits<{ close: [] }>();

const router = useRouter();
const cartStore = useCartStore();
const { itemCount } = storeToRefs(cartStore);
const removingId = ref<number | string | null>(null);

onMounted(() => {
	cartStore.syncFromBackend();
});

function formatPrice(n: number) {
	return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function isAtMax(item: CartItemLocal) {
	const max = item.stock == null ? 20 : Math.min(20, item.stock);
	return item.quantity >= max;
}

async function increase(item: CartItemLocal) {
	await cartStore.updateQuantity(item.id, item.quantity + 1);
}

async function decrease(item: CartItemLocal) {
	if (item.quantity <= 1) return;
	await cartStore.updateQuantity(item.id, item.quantity - 1);
}

function remove(itemId: number | string) {
	removingId.value = itemId;
	setTimeout(() => {
		cartStore.removeItem(itemId);
		removingId.value = null;
	}, 300);
}

function continueShopping() {
	if (!props.standalone) emit('close');
	router.push({ name: 'RestaurantList' });
}

function goCheckout() {
	if (!cartStore.isOnline) return;
	if (!props.standalone) emit('close');
	router.push({ name: 'CheckoutPage' });
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
	transition: all 0.2s ease;
}
.list-enter-from {
	opacity: 0;
	transform: translateX(-10px);
}
.list-leave-to {
	opacity: 0;
	transform: translateX(10px);
}
</style>