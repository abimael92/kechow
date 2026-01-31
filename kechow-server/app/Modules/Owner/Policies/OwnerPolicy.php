<?php

namespace App\Modules\Owner\Policies;

use App\Models\User;

/**
 * Policy for owner-management actions (admin only).
 * Restricts list/show/create/update/delete of owners (users with role owner).
 * Ensures owners cannot manipulate other roles' data (customers, delivery, other owners);
 * only admin can manage owner users.
 *
 * @see Docs/OWNER_POLICY_RULES.md
 */
class OwnerPolicy
{
    /**
     * Determine whether the user can view any owners (list).
     * Admin only.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can view the given owner.
     * Admin only; target must be a user with role owner (prevents viewing other roles).
     */
    public function view(User $user, User $owner): bool
    {
        return $user->role === 'admin' && $owner->role === 'owner';
    }

    /**
     * Determine whether the user can create owners.
     * Admin only.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the given owner.
     * Admin only; target must be a user with role owner (prevents updating other roles).
     */
    public function update(User $user, User $owner): bool
    {
        return $user->role === 'admin' && $owner->role === 'owner';
    }

    /**
     * Determine whether the user can delete (soft delete) the given owner.
     * Admin only; target must be a user with role owner (prevents deleting other roles).
     */
    public function delete(User $user, User $owner): bool
    {
        return $user->role === 'admin' && $owner->role === 'owner';
    }
}
