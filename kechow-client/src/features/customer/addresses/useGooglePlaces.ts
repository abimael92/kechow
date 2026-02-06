/**
 * Load Google Places script and init autocomplete on an input.
 * Uses VITE_GOOGLE_PLACES_API_KEY. If missing, autocomplete is skipped (form still works).
 */

interface PlaceAddressComponent {
	long_name: string;
	short_name: string;
	types: string[];
}

interface PlaceResult {
	address_components?: PlaceAddressComponent[];
	name?: string;
	formatted_address?: string;
}

declare global {
	interface Window {
		google?: {
			maps: {
				places: {
					Autocomplete: new (
						input: HTMLInputElement,
						opts?: { types?: string[]; componentRestrictions?: { country: string | string[] }; fields?: string[] }
					) => {
						addListener: (event: string, fn: () => void) => void;
						getPlace: () => PlaceResult;
					};
				};
			};
		};
		initGooglePlaces?: () => void;
	}
}

export interface ParsedPlace {
	street: string;
	city: string;
	state: string;
	zipCode: string;
}

const SCRIPT_ID = 'google-places-script';
const MEXICO = 'mx';

function getApiKey(): string {
	return (import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string) || '';
}

function loadScript(): Promise<void> {
	const key = getApiKey();
	if (!key) return Promise.resolve();

	if (document.getElementById(SCRIPT_ID)) {
		return typeof window.google !== 'undefined'
			? Promise.resolve()
			: new Promise((resolve) => {
					window.initGooglePlaces = resolve;
				});
	}

	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.id = SCRIPT_ID;
		script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=initGooglePlaces`;
		script.async = true;
		script.defer = true;
		window.initGooglePlaces = () => {
			resolve();
		};
		script.onerror = () => reject(new Error('Error al cargar Google Places'));
		document.head.appendChild(script);
	});
}

function parseAddressComponents(place: PlaceResult): ParsedPlace {
	const streetParts: string[] = [];
	let city = '';
	let state = '';
	let zipCode = '';

	const components = place.address_components || [];
	for (const c of components) {
		const types = c.types || [];
		if (types.includes('street_number')) streetParts.push(c.long_name);
		if (types.includes('route')) streetParts.push(c.long_name);
		if (types.includes('locality') || types.includes('sublocality')) city = c.long_name;
		if (types.includes('administrative_area_level_1')) state = c.short_name || c.long_name;
		if (types.includes('postal_code')) zipCode = c.long_name;
	}

	const street = streetParts.length ? streetParts.join(' ') : (place.name || place.formatted_address || '');

	return { street, city, state, zipCode };
}

export function useGooglePlaces() {
	const isAvailable = !!getApiKey();

	async function attachAutocomplete(
		inputEl: HTMLInputElement | null,
		onPlaceSelect: (parsed: ParsedPlace) => void
	): Promise<void> {
		if (!inputEl || !getApiKey()) return;
		await loadScript();
		if (!window.google?.maps?.places?.Autocomplete) return;

		const autocomplete = new window.google.maps.places.Autocomplete(inputEl, {
			types: ['address'],
			componentRestrictions: { country: MEXICO },
			fields: ['address_components', 'formatted_address', 'name'],
		});

		autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace();
			if (place.address_components) {
				onPlaceSelect(parseAddressComponents(place));
			}
		});
	}

	return { isAvailable, attachAutocomplete, loadScript };
}
