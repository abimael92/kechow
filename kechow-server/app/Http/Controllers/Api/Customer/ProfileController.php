<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Get current user profile with addresses (for customer frontend).
     * GET /api/customer/profile
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json($this->profileResponse($request->user()));
    }

    /**
     * Update current user profile (name, email, phone). Addresses are managed via AddressController.
     * PUT /api/customer/profile
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email',
            'phone' => 'nullable|string|max:50',
        ]);

        $user = $request->user();
        $user->update($validated);

        return response()->json($this->profileResponse($user->fresh()));
    }

    private function profileResponse($user): array
    {
        $addresses = $user->addresses()
            ->orderByDesc('is_default')
            ->orderBy('created_at')
            ->get();

        return [
            'id' => (string) $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? '',
            'addresses' => $addresses->map(fn (UserAddress $a) => [
                'id' => (string) $a->id,
                'label' => $a->label,
                'street' => $a->street,
                'city' => $a->city ?? '',
                'state' => $a->state ?? '',
                'zipCode' => $a->zip_code ?? '',
                'isDefault' => $a->is_default,
            ]),
        ];
    }
}
