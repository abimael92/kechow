/**
 * Driver location tracking - updates every 30s when active
 */

import { onMounted, onUnmounted, watch } from 'vue';
import { useDriverStore } from '../store/useDriverStore';

const INTERVAL_MS = 30000;

export function useDriverLocation() {
	const driverStore = useDriverStore();
	let intervalId: ReturnType<typeof setInterval> | null = null;

	function updateLocation() {
		if (!navigator.geolocation) return;
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				driverStore.sendLocation(pos.coords.latitude, pos.coords.longitude);
			},
			() => {
				// Silent fail - GPS might be disabled
			},
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
		);
	}

	function startTracking() {
		if (!driverStore.hasActiveOrder) return;
		updateLocation();
		intervalId = setInterval(updateLocation, INTERVAL_MS);
	}

	function stopTracking() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	watch(
		() => driverStore.hasActiveOrder,
		(has) => {
			if (has) startTracking();
			else stopTracking();
		}
	);

	onMounted(() => {
		if (driverStore.hasActiveOrder) startTracking();
	});

	onUnmounted(() => {
		stopTracking();
	});

	return { updateLocation };
}
