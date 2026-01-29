import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Reactive online status. Use to show network UI and disable unsafe actions when offline.
 */
export function useOnline() {
	const isOnline = ref(
		typeof navigator !== 'undefined' ? navigator.onLine : true
	);

	function updateStatus() {
		isOnline.value = navigator.onLine;
	}

	onMounted(() => {
		window.addEventListener('online', updateStatus);
		window.addEventListener('offline', updateStatus);
	});

	onUnmounted(() => {
		window.removeEventListener('online', updateStatus);
		window.removeEventListener('offline', updateStatus);
	});

	return { isOnline };
}
