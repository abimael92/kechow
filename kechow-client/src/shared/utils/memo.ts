/**
 * Memoizes a function by caching its result keyed by the stringified arguments.
 * Use for expensive pure functions (e.g. formatting, filtering) when the same
 * inputs are used repeatedly. For reactive caching, prefer Vue's computed().
 */

const defaultKey = (args: unknown[]): string =>
	args.length === 0 ? '' : JSON.stringify(args);

/**
 * Returns a memoized version of fn. Cache is keyed by JSON.stringify(args).
 * Only use for pure functions; cache is unbounded (no eviction).
 */
export function memo<T extends (...args: unknown[]) => unknown>(
	fn: T,
	keyFn: (args: unknown[]) => string = defaultKey
): T {
	const cache = new Map<string, ReturnType<T>>();
	return ((...args: Parameters<T>) => {
		const key = keyFn(args);
		if (cache.has(key)) return cache.get(key) as ReturnType<T>;
		const result = fn(...args) as ReturnType<T>;
		cache.set(key, result);
		return result;
	}) as T;
}
