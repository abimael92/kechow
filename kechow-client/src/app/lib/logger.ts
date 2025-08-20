export const logger = {
	//* Info messages – general application info
	info: (...args: unknown[]) => console.info('[INFO]', ...args),

	//? Warnings – use when something unexpected happens but app can continue
	warn: (...args: unknown[]) => console.warn('[WARN]', ...args),

	//! Errors – critical issues
	error: (...args: unknown[]) => console.error('[ERROR]', ...args),

	//? Debug – only logs in development mode
	debug: (...args: unknown[]) =>
		import.meta.env.DEV && console.debug('[DEBUG]', ...args),
};
