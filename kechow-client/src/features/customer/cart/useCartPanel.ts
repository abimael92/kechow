import { ref } from 'vue';

const cartPanelOpen = ref(false);

export function useCartPanel() {
	function openCartPanel() {
		cartPanelOpen.value = true;
	}
	function closeCartPanel() {
		cartPanelOpen.value = false;
	}
	function toggleCartPanel() {
		cartPanelOpen.value = !cartPanelOpen.value;
	}
	return {
		cartPanelOpen,
		openCartPanel,
		closeCartPanel,
		toggleCartPanel,
	};
}
