import { computed, ref } from 'vue';

export function useFilteredRestaurants(
	restaurants: any[],
	search: string,
	selectedCategory: string
) {
	const filtered = computed(() => {
		return restaurants.filter((r) => {
			const searchLower = search.toLowerCase();
			const matchesSearch =
				r.name.toLowerCase().includes(searchLower) ||
				r.description.toLowerCase().includes(searchLower);
			const matchesCategory =
				!selectedCategory || r.categoryId === selectedCategory; // or adjust logic to category name matching
			return matchesSearch && matchesCategory;
		});
	});

	return { filtered };
}
