<?php

namespace App\Modules\Owner\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\Owner\Requests\StoreOwnerRequest;
use App\Modules\Owner\Requests\UpdateOwnerRequest;
use App\Modules\Owner\Resources\OwnerResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Admin-only RESTful owner management.
 * Owners are users with role = owner. List / show / create / update / soft-delete.
 * Uses FormRequest for validation, OwnerResource for responses, transactions for create/update.
 * Authorization via OwnerPolicy (authorizeResource); route param {owner} bound to owner User.
 *
 * @see Docs/OWNER_MANAGEMENT_ROUTES.md
 * @see Docs/OWNER_API_BEHAVIOR_AND_ERRORS.md
 * @see Docs/OWNER_POLICY_RULES.md
 */
class OwnerManagementController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(User::class, 'owner');
    }

    /**
     * List all owners (users with role owner). Excludes soft-deleted by default.
     * 403 if not admin (OwnerPolicy::viewAny).
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::where('role', 'owner')->with('restaurants');

            if ($request->boolean('with_trashed')) {
                $query->withTrashed();
            }

            $owners = $query->orderBy('name')->get();

            return response()->json([
                'data' => OwnerResource::collection($owners),
                'meta' => ['total' => $owners->count()],
            ]);
        } catch (Throwable $e) {
            Log::error('OwnerManagementController@index', ['exception' => $e->getMessage()]);
            return response()->json(['message' => 'Error listing owners.'], 500);
        }
    }

    /**
     * Show owner by id with restaurants.
     * 404 if id not found or user is not an owner (route binding). 403 if not admin (OwnerPolicy::view).
     */
    public function show(User $owner): JsonResponse
    {
        try {
            $owner->load('restaurants');
            return response()->json(['data' => new OwnerResource($owner)]);
        } catch (Throwable $e) {
            Log::error('OwnerManagementController@show', ['id' => $owner->getKey(), 'exception' => $e->getMessage()]);
            return response()->json(['message' => 'Error loading owner.'], 500);
        }
    }

    /**
     * Create a new owner (user with role owner).
     * Uses transaction for relational integrity (e.g. if future logic creates default restaurant).
     * 201 on success, 422 on validation error (FormRequest), 403 if not admin.
     */
    public function store(StoreOwnerRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['password'] = Hash::make($data['password']);
            $data['role'] = 'owner';

            $owner = DB::transaction(function () use ($data) {
                $owner = User::create($data);
                return $owner->load('restaurants');
            });

            return response()->json(['data' => new OwnerResource($owner)], 201);
        } catch (Throwable $e) {
            Log::error('OwnerManagementController@store', ['exception' => $e->getMessage()]);
            return response()->json(['message' => 'Error creating owner.'], 500);
        }
    }

    /**
     * Update owner info. Only owners can be updated via this endpoint.
     * Uses transaction for relational integrity. 403 if not admin (OwnerPolicy::update).
     */
    public function update(UpdateOwnerRequest $request, User $owner): JsonResponse
    {
        try {
            $data = $request->validated();
            if (!empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            DB::transaction(function () use ($owner, $data) {
                $owner->update($data);
            });

            return response()->json(['data' => new OwnerResource($owner->fresh('restaurants'))]);
        } catch (Throwable $e) {
            Log::error('OwnerManagementController@update', ['id' => $owner->getKey(), 'exception' => $e->getMessage()]);
            return response()->json(['message' => 'Error updating owner.'], 500);
        }
    }

    /**
     * Soft delete owner. 403 if not admin (OwnerPolicy::delete).
     */
    public function destroy(User $owner): JsonResponse
    {
        try {
            $owner->delete();
            return response()->json(['message' => 'Owner soft deleted.'], 200);
        } catch (Throwable $e) {
            Log::error('OwnerManagementController@destroy', ['id' => $owner->getKey(), 'exception' => $e->getMessage()]);
            return response()->json(['message' => 'Error deleting owner.'], 500);
        }
    }
}
