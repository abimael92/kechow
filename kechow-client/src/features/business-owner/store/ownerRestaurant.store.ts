import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@app/lib/axios';
import { useAuthStore } from '@app/store/auth/auth.store';

/** API shape for a restaurant from GET /api/restaurants/owner/my-restaurants or GET /api/restaurants/{id} */
export interface ApiRestaurant {
	id: number;
	name: string;
	description?: string | null;
	address: string;
	city: string;
	state?: string | null;
	zip_code?: string | null;
	phone?: string | null;
	email?: string | null;
	website?: string | null;
	opening_time?: string | null;
	closing_time?: string | null;
	logo_url?: string | null;
	is_active?: boolean;
	is_open?: boolean;
}

export const useOwnerRestaurantStore = defineStore('ownerRestaurant', () => {
	const currentRestaurantId = ref<number | null>(null);
	const currentRestaurant = ref<ApiRestaurant | null>(null);

	const hasRestaurant = computed(() => currentRestaurantId.value != null);

	/** Ensures the owner has a restaurant (fetches list, creates one if empty). Returns restaurant id. */
	async function ensureMyRestaurant(): Promise<number> {
		if (currentRestaurantId.value != null) {
			return currentRestaurantId.value;
		}
		const authStore = useAuthStore();
		if (authStore.user?.role !== 'owner') {
			throw new Error('Only owners can manage restaurants');
		}
		const res = await api.get<{ data?: ApiRestaurant[] } | ApiRestaurant[]>('/api/restaurants/owner/my-restaurants');
		const raw = res.data;
		const restaurants = Array.isArray(raw) ? raw : (raw?.data ?? []);
		if (restaurants.length > 0) {
			currentRestaurantId.value = restaurants[0].id;
			currentRestaurant.value = restaurants[0];
			return currentRestaurantId.value;
		}
		const created = await createDefaultRestaurant(authStore.user.id, authStore.user.email ?? '');
		currentRestaurantId.value = created.id;
		currentRestaurant.value = created;
		return created.id;
	}

	/** Create a minimal first restaurant for the owner. */
	async function createDefaultRestaurant(ownerId: number, ownerEmail: string): Promise<ApiRestaurant> {
		const payload = {
			name: 'Mi Restaurante',
			address: 'Por definir',
			city: 'Jiménez',
			state: 'Chihuahua',
			zip_code: '33940',
			phone: '0000000000',
			email: `owner-${ownerId}@kechow.local`,
			opening_time: '09:00',
			closing_time: '22:00',
		};
		const { data } = await api.post<ApiRestaurant>('/api/restaurants', payload);
		return data;
	}

	function setRestaurant(id: number | null, restaurant?: ApiRestaurant | null) {
		currentRestaurantId.value = id;
		currentRestaurant.value = restaurant ?? null;
	}

	function clear() {
		currentRestaurantId.value = null;
		currentRestaurant.value = null;
	}

	return {
		currentRestaurantId,
		currentRestaurant,
		hasRestaurant,
		ensureMyRestaurant,
		setRestaurant,
		clear,
	};
});
