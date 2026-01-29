import { ref } from 'vue';

export interface UseRetryOptions {
	/** Max retries (default 1). */
	maxRetries?: number;
}

/**
 * Wraps an async function with error state and retry. Use for load/refresh actions.
 */
export function useRetry<T extends (...args: any[]) => Promise<any>>(
	fn: T,
	options: UseRetryOptions = {}
) {
	const { maxRetries = 1 } = options;
	const error = ref<Error | null>(null);
	const loading = ref(false);
	const retryCount = ref(0);

	async function execute(...args: Parameters<T>): Promise<ReturnType<T> | undefined> {
		error.value = null;
		loading.value = true;
		try {
			const result = await fn(...args);
			retryCount.value = 0;
			return result;
		} catch (e) {
			error.value = e instanceof Error ? e : new Error(String(e));
			retryCount.value += 1;
			return undefined;
		} finally {
			loading.value = false;
		}
	}

	function retry(...args: Parameters<T>) {
		return execute(...args);
	}

	function clearError() {
		error.value = null;
	}

	const canRetry = () => retryCount.value < maxRetries;

	return { execute, retry, error, loading, clearError, canRetry };
}
