<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    /**
     * List addresses for the authenticated user.
     * GET /api/customer/addresses
     */
    public function index(Request $request): JsonResponse
    {
        $addresses = $request->user()
            ->addresses()
            ->orderByDesc('is_default')
            ->orderBy('created_at')
            ->get();

        return response()->json([
            'data' => $addresses->map(fn (UserAddress $a) => $this->formatAddress($a)),
        ]);
    }

    /**
     * Store a new address.
     * POST /api/customer/addresses
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'label' => 'required|string|max:100',
            'street' => 'required|string|max:500',
            'city' => 'nullable|string|max:120',
            'state' => 'nullable|string|max:120',
            'zip_code' => 'nullable|string|max:20',
            'zipCode' => 'nullable|string|max:20',
            'is_default' => 'boolean',
            'isDefault' => 'boolean',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $address = $request->user()->addresses()->create([
            'label' => $validated['label'],
            'street' => $validated['street'],
            'city' => $validated['city'] ?? null,
            'state' => $validated['state'] ?? null,
            'zip_code' => $validated['zip_code'] ?? $validated['zipCode'] ?? null,
            'is_default' => $validated['is_default'] ?? $validated['isDefault'] ?? false,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
        ]);

        return response()->json($this->formatAddress($address), 201);
    }

    /**
     * Update an address.
     * PUT /api/customer/addresses/{address}
     */
    public function update(Request $request, UserAddress $address): JsonResponse
    {
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'label' => 'sometimes|string|max:100',
            'street' => 'sometimes|string|max:500',
            'city' => 'nullable|string|max:120',
            'state' => 'nullable|string|max:120',
            'zip_code' => 'nullable|string|max:20',
            'zipCode' => 'nullable|string|max:20',
            'is_default' => 'boolean',
            'isDefault' => 'boolean',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $payload = [];
        if (array_key_exists('label', $validated)) $payload['label'] = $validated['label'];
        if (array_key_exists('street', $validated)) $payload['street'] = $validated['street'];
        if (array_key_exists('city', $validated)) $payload['city'] = $validated['city'];
        if (array_key_exists('state', $validated)) $payload['state'] = $validated['state'];
        if (array_key_exists('zip_code', $validated) || array_key_exists('zipCode', $validated)) {
            $payload['zip_code'] = $validated['zip_code'] ?? $validated['zipCode'] ?? null;
        }
        if (array_key_exists('is_default', $validated) || array_key_exists('isDefault', $validated)) {
            $payload['is_default'] = $validated['is_default'] ?? $validated['isDefault'];
        }
        if (array_key_exists('latitude', $validated)) $payload['latitude'] = $validated['latitude'];
        if (array_key_exists('longitude', $validated)) $payload['longitude'] = $validated['longitude'];

        $address->update($payload);

        return response()->json($this->formatAddress($address->fresh()));
    }

    /**
     * Delete an address.
     * DELETE /api/customer/addresses/{address}
     */
    public function destroy(Request $request, UserAddress $address): JsonResponse
    {
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $address->delete();

        return response()->json(null, 204);
    }

    /**
     * Set address as default.
     * PATCH /api/customer/addresses/{address}/default
     */
    public function setDefault(Request $request, UserAddress $address): JsonResponse
    {
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $address->user->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return response()->json($this->formatAddress($address->fresh()));
    }

    private function formatAddress(UserAddress $a): array
    {
        return [
            'id' => (string) $a->id,
            'label' => $a->label,
            'street' => $a->street,
            'city' => $a->city ?? '',
            'state' => $a->state ?? '',
            'zipCode' => $a->zip_code ?? '',
            'isDefault' => $a->is_default,
        ];
    }
}
