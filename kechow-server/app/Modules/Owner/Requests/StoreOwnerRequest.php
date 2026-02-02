<?php

namespace App\Modules\Owner\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

/**
 * Form request for creating an owner (user with role owner).
 * Admin only. Role is fixed to owner.
 *
 * @see Docs/VALIDATION_OWNER.md for full validation rules documentation
 */
class StoreOwnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'admin';
    }

    /**
     * Validation rules. For i18n: use lang/validation.php or lang/owner/validation.php
     * and replace message strings with __('validation.required'), __('owner::validation.email_taken'), etc.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // Required: display name
            'name' => 'required|string|max:255',  // i18n: validation.required, validation.max.string

            // Required: unique email
            'email' => 'required|string|email|max:255|unique:users,email',  // i18n: validation.unique

            // Required: strong password with confirmation
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()->mixedCase()],  // i18n: validation.password, validation.confirmed

            // Role fixed to owner (enforced in controller; validated here for API consistency)
            'role' => 'required|in:owner',  // i18n: validation.in

            // Optional: contact and location
            'phone' => 'nullable|string|max:50',    // i18n: validation.max.string
            'address' => 'nullable|string|max:500', // i18n: validation.max.string
            'latitude' => 'nullable|numeric|between:-90,90',   // i18n: validation.numeric, validation.between.numeric
            'longitude' => 'nullable|numeric|between:-180,180', // i18n: validation.between.numeric
        ];
    }

    /**
     * Custom attribute names for validation messages (i18n-friendly).
     * Replace values with __('owner::attributes.name'), etc. when adding lang files.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'name',      // i18n: owner::attributes.name
            'email' => 'email',   // i18n: owner::attributes.email
            'password' => 'password',
            'password_confirmation' => 'password confirmation',
            'role' => 'role',
            'phone' => 'phone',
            'address' => 'address',
            'latitude' => 'latitude',
            'longitude' => 'longitude',
        ];
    }

    /**
     * Custom messages. Uncomment and use __() for i18n when adding translations.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            // 'name.required' => __('owner::validation.name_required'),
            // 'email.required' => __('owner::validation.email_required'),
            // 'email.unique' => __('owner::validation.email_taken'),
            // 'password.required' => __('owner::validation.password_required'),
            // 'password.confirmed' => __('owner::validation.password_confirmed'),
            // 'password.min' => __('owner::validation.password_min'),
            // 'role.required' => __('owner::validation.role_required'),
            // 'role.in' => __('owner::validation.role_must_owner'),
        ];
    }
}
