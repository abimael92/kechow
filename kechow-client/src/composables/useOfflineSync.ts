import { ref, onMounted, onUnmounted } from 'vue';

export function useOfflineSync() {
  const isOnline = ref(navigator.onLine);

  const syncOfflineActions = async () => {
    const actions = localStorage.getItem('offlineActions');
    if (actions) {
      const parsedActions = JSON.parse(actions);
      // Process each action
      for (const action of parsedActions) {
        try {
          // Send to server
          await fetch('/api/sync', {
            method: 'POST',
            body: JSON.stringify(action),
          });
        } catch (error) {
          console.error('Sync failed:', error);
        }
      }
      // Clear after successful sync
      localStorage.removeItem('offlineActions');
    }
  };

  const handleOnline = () => {
    isOnline.value = true;
    syncOfflineActions();
  };

  const handleOffline = () => {
    isOnline.value = false;
  };

  onMounted(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  });

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  });

  return {
    isOnline,
    syncOfflineActions,
  };
}
