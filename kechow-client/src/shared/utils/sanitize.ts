/**
 * Sanitization utilities for user-supplied and API content.
 * Use before rendering into HTML (e.g. v-html or innerHTML) to prevent XSS.
 * For normal text binding ({{ }}) Vue escapes by default; use these when
 * you must output raw HTML or build HTML strings.
 */

const HTML_ENTITIES: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'`': '&#96;',
	'/': '&#x2F;',
	'=': '&#x3D;',
};

const RE_HTML = /[&<>"'`/=]/g;

/**
 * Escapes HTML special characters in a string so it can be safely inserted
 * into HTML context (e.g. attribute values or element text when building HTML).
 * Prevents XSS when rendering user or API content.
 */
export function escapeHtml(value: unknown): string {
	if (value == null) return '';
	const s = String(value);
	return s.replace(RE_HTML, (ch) => HTML_ENTITIES[ch] ?? ch);
}

/**
 * Sanitizes a string for safe display: escapes HTML and optionally truncates.
 * Use for user/API text shown in the UI when you need a length limit.
 */
export function sanitizeForDisplay(
	value: unknown,
	maxLength?: number
): string {
	const safe = escapeHtml(value);
	if (maxLength != null && maxLength > 0 && safe.length > maxLength) {
		return safe.slice(0, maxLength) + '…';
	}
	return safe;
}
