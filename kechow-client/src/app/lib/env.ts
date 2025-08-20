export function getEnv(key: string, defaultValue = ''): string {
	const value = import.meta.env[key as keyof ImportMetaEnv];
	if (value === undefined || value === null) {
		console.warn(
			`⚠️ Missing env variable: ${key}, using default: ${defaultValue}`
		);
		return defaultValue;
	}
	return value;
}
