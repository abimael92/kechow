import { computed, type MaybeRefOrGetter, toValue } from 'vue';

export function useFilteredRestaurants(
	restaurants: MaybeRefOrGetter<any[]>,
	search: MaybeRefOrGetter<string>,
	selectedCategory: MaybeRefOrGetter<string>
) {
	const filtered = computed(() => {
		const list = toValue(restaurants);
		const searchVal = toValue(search);
		const categoryVal = toValue(selectedCategory);
		const searchLower = (searchVal ?? '').toLowerCase();
		return (list ?? []).filter((r) => {
			const matchesSearch =
				(r.name ?? '').toLowerCase().includes(searchLower) ||
				(r.description ?? '').toLowerCase().includes(searchLower);
			const matchesCategory =
				!categoryVal || r.categoryId === categoryVal;
			return matchesSearch && matchesCategory;
		});
	});

	return { filtered };
}
