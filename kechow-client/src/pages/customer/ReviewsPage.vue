<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="mb-6">
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
					Reseñas
				</h1>
				<p class="text-gray-600 dark:text-gray-400 mt-2">
					Comparte tu experiencia con otros clientes
				</p>
			</div>

			<!-- Create Review Form -->
			<div
				v-if="showCreateForm"
				class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
			>
				<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
					Escribir Reseña
				</h2>
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
							Restaurante
						</label>
						<select
							v-model="newReview.restaurantId"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
							<option value="">Seleccionar restaurante</option>
							<option
								v-for="restaurant in restaurants"
								:key="restaurant.id"
								:value="restaurant.id"
							>
								{{ restaurant.name }}
							</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
							Calificación
						</label>
						<div class="flex gap-2">
							<button
								v-for="rating in 5"
								:key="rating"
								@click="newReview.rating = rating"
								class="text-3xl transition-transform hover:scale-110"
								:class="
									rating <= newReview.rating
										? 'text-yellow-400'
										: 'text-gray-300 dark:text-gray-600'
								"
							>
								★
							</button>
						</div>
					</div>
					<div>
						<label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
							Comentario
						</label>
						<textarea
							v-model="newReview.comment"
							rows="4"
							placeholder="Comparte tu experiencia..."
							class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						></textarea>
					</div>
					<div class="flex gap-3">
						<button
							@click="showCreateForm = false"
							class="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
						>
							Cancelar
						</button>
						<button
							@click="submitReview"
							:disabled="!canSubmitReview || submitting"
							class="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{{ submitting ? 'Enviando...' : 'Publicar Reseña' }}
						</button>
					</div>
				</div>
			</div>

			<!-- Reviews List -->
			<div v-if="loading" class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
				<p class="mt-4 text-gray-600 dark:text-gray-400">Cargando reseñas...</p>
			</div>

			<div v-else class="space-y-4">
				<div class="flex justify-between items-center mb-4">
					<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
						Todas las Reseñas ({{ reviews.length }})
					</h2>
					<button
						@click="showCreateForm = !showCreateForm"
						class="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
					>
						+ Nueva Reseña
					</button>
				</div>

				<div
					v-for="review in reviews"
					:key="review.id"
					class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
				>
					<div class="flex items-start justify-between mb-3">
						<div>
							<div class="flex items-center gap-2 mb-1">
								<span class="font-semibold text-gray-900 dark:text-white">
									{{ review.customerName }}
								</span>
								<span
									v-if="review.verified"
									class="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded"
								>
									Verificado
								</span>
							</div>
							<div class="flex items-center gap-2">
								<div class="flex text-yellow-400">
									<span
										v-for="i in 5"
										:key="i"
										:class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
									>
										★
									</span>
								</div>
								<span class="text-sm text-gray-600 dark:text-gray-400">
									{{ formatDate(review.date) }}
								</span>
							</div>
						</div>
					</div>
					<p class="text-gray-700 dark:text-gray-300 mb-3">{{ review.comment }}</p>
					<div
						v-if="review.orderItems && review.orderItems.length > 0"
						class="text-sm text-gray-600 dark:text-gray-400 mb-3"
					>
						<strong>Pedido:</strong> {{ review.orderItems.join(', ') }}
					</div>
					<div
						v-if="review.response"
						class="mt-4 pt-4 border-t border-primary-300 dark:border-gray-700"
					>
						<p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
							Respuesta del restaurante:
						</p>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							{{ review.response }}
						</p>
					</div>
					<div class="flex items-center gap-4 mt-4">
						<button
							@click="toggleHelpful(review.id)"
							class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
						>
							<i class="ri-thumb-up-line"></i>
							Útil ({{ review.helpfulCount }})
						</button>
					</div>
				</div>

				<div v-if="reviews.length === 0" class="text-center py-12">
					<p class="text-gray-600 dark:text-gray-400">
						No hay reseñas aún. ¡Sé el primero en dejar una!
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import {
	getRestaurantReviews,
	createReview,
	getRestaurants,
	type Restaurant,
} from '@/features/customer/services/customer.service';
import type { Review } from '@/features/customer/types';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const reviews = ref<Review[]>([]);
const restaurants = ref<Restaurant[]>([]);
const loading = ref(true);
const showCreateForm = ref(false);
const submitting = ref(false);
const newReview = ref({
	restaurantId: 0,
	orderId: '',
	rating: 0,
	comment: '',
});

const canSubmitReview = computed(() => {
	return (
		newReview.value.restaurantId > 0 &&
		newReview.value.rating > 0 &&
		newReview.value.comment.trim().length > 0
	);
});

const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString('es-MX', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

const loadReviews = async () => {
	try {
		loading.value = true;
		// Load reviews for first restaurant as example
		const restaurantList = await getRestaurants();
		restaurants.value = restaurantList;
		if (restaurantList.length > 0) {
			const restaurantReviews = await getRestaurantReviews(restaurantList[0].id);
			reviews.value = restaurantReviews;
		}
	} catch (error) {
		toast.error('Error al cargar reseñas');
	} finally {
		loading.value = false;
	}
};

const submitReview = async () => {
	if (!canSubmitReview.value) return;

	submitting.value = true;
	try {
		const review = await createReview({
			restaurantId: newReview.value.restaurantId,
			orderId: newReview.value.orderId || `ORD-${Date.now()}`,
			rating: newReview.value.rating,
			comment: newReview.value.comment,
		});

		reviews.value.unshift(review);
		showCreateForm.value = false;
		newReview.value = {
			restaurantId: 0,
			orderId: '',
			rating: 0,
			comment: '',
		};
		toast.success('¡Reseña publicada exitosamente!');
	} catch (error) {
		toast.error('Error al publicar reseña');
	} finally {
		submitting.value = false;
	}
};

const toggleHelpful = (reviewId: string) => {
	const review = reviews.value.find((r: Review) => r.id === reviewId);
	if (review) {
		review.helpfulCount += 1;
		toast.info('Gracias por tu feedback');
	}
};

onMounted(async () => {
	const orderId = route.query.orderId as string;
	if (orderId) {
		newReview.value.orderId = orderId;
		showCreateForm.value = true;
	}
	await loadReviews();
});
</script>
