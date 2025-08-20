export const isEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

export const isPhone = (val: string) => /^\+?[0-9]{7,15}$/.test(val);

export const isPrice = (val: number) => val >= 0 && Number.isFinite(val);
