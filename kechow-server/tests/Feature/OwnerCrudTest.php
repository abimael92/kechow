<?php

namespace Tests\Feature;

use App\Models\User;
use App\Modules\Restaurant\Models\Restaurant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Feature tests for Owner CRUD API (admin-only).
 * Covers: list owners, show owner with restaurants, create/update/delete owner,
 * unauthorized access by non-admins. Asserts JSON matches OwnerResource shape.
 *
 * @see Docs/OWNER_TEST_COVERAGE.md
 */
class OwnerCrudTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $ownerUser;

    private User $customer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->ownerUser = User::factory()->create(['role' => 'owner']);
        $this->customer = User::factory()->create(['role' => 'customer']);
    }

    /** @return array<string, mixed> */
    private function validOwnerPayload(): array
    {
        return [
            'name' => 'Carmen López',
            'email' => 'carmen@example.com',
            'password' => 'SecurePass123',
            'password_confirmation' => 'SecurePass123',
            'role' => 'owner',
            'phone' => '+34 912 345 678',
            'address' => 'Calle Gran Vía 42, Madrid',
        ];
    }

    /** Assert response JSON has OwnerResource shape (no password, has data + optional meta). */
    private function assertOwnerResourceStructure(\Illuminate\Testing\TestResponse $response, bool $isList = false): void
    {
        if ($isList) {
            $response->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'email',
                        'phone',
                        'address',
                        'restaurants',
                        'created_at',
                        'updated_at',
                    ],
                ],
                'meta' => ['total'],
            ]);
            $response->assertJsonMissingPath('data.0.password');
        } else {
            $response->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'email',
                    'phone',
                    'address',
                    'restaurants',
                    'created_at',
                    'updated_at',
                ],
            ]);
            $response->assertJsonMissingPath('data.password');
        }
    }

    // ---------- List owners ----------

    public function test_list_owners_as_admin_returns_success_and_owner_resource_structure(): void
    {
        Sanctum::actingAs($this->admin);

        $response = $this->getJson('/api/owners');

        $response->assertStatus(200);
        $response->assertJsonStructure(['data', 'meta' => ['total']]);
        $this->assertOwnerResourceStructure($response, true);
        $response->assertJsonPath('meta.total', 1); // only $this->ownerUser
    }

    public function test_list_owners_with_trashed_includes_soft_deleted(): void
    {
        Sanctum::actingAs($this->admin);
        $this->ownerUser->delete();

        $response = $this->getJson('/api/owners?with_trashed=1');

        $response->assertStatus(200);
        $response->assertJsonPath('meta.total', 1);
        $response->assertJsonPath('data.0.deleted_at', fn ($v) => $v !== null);
    }

    public function test_list_owners_without_trashed_excludes_soft_deleted(): void
    {
        Sanctum::actingAs($this->admin);
        $this->ownerUser->delete();

        $response = $this->getJson('/api/owners');

        $response->assertStatus(200);
        $response->assertJsonPath('meta.total', 0);
    }

    // ---------- Show owner with restaurants ----------

    public function test_show_owner_as_admin_returns_owner_with_restaurants_and_resource_structure(): void
    {
        Sanctum::actingAs($this->admin);
        $restaurant = Restaurant::factory()->create([
            'owner_id' => $this->ownerUser->id,
            'name' => 'La Taberna',
        ]);

        $response = $this->getJson('/api/owners/' . $this->ownerUser->id);

        $response->assertStatus(200);
        $this->assertOwnerResourceStructure($response, false);
        $response->assertJsonPath('data.id', $this->ownerUser->id);
        $response->assertJsonPath('data.name', $this->ownerUser->name);
        $response->assertJsonPath('data.restaurants.0.id', $restaurant->id);
        $response->assertJsonPath('data.restaurants.0.name', 'La Taberna');
        $response->assertJsonMissingPath('data.password');
    }

    public function test_show_owner_with_invalid_id_returns_404(): void
    {
        Sanctum::actingAs($this->admin);
        $badId = 99999;

        $response = $this->getJson('/api/owners/' . $badId);

        $response->assertStatus(404);
    }

    public function test_show_owner_with_customer_id_returns_404(): void
    {
        Sanctum::actingAs($this->admin);
        // Route binding resolves only users with role owner; customer ID is not an owner
        $response = $this->getJson('/api/owners/' . $this->customer->id);

        $response->assertStatus(404);
    }

    // ---------- Create owner ----------

    public function test_create_owner_as_admin_returns_201_and_owner_resource(): void
    {
        Sanctum::actingAs($this->admin);
        $payload = $this->validOwnerPayload();

        $response = $this->postJson('/api/owners', $payload);

        $response->assertStatus(201);
        $this->assertOwnerResourceStructure($response, false);
        $response->assertJsonPath('data.name', $payload['name']);
        $response->assertJsonPath('data.email', $payload['email']);
        $response->assertJsonPath('data.phone', $payload['phone']);
        $response->assertJsonPath('data.restaurants', []);
        $response->assertJsonMissingPath('data.password');

        $this->assertDatabaseHas('users', [
            'email' => $payload['email'],
            'role' => 'owner',
        ]);
    }

    public function test_create_owner_with_validation_failure_returns_422(): void
    {
        Sanctum::actingAs($this->admin);
        $payload = $this->validOwnerPayload();
        $payload['email'] = 'not-an-email';
        $payload['password'] = 'short';
        $payload['password_confirmation'] = 'short';

        $response = $this->postJson('/api/owners', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_create_owner_with_duplicate_email_returns_422(): void
    {
        Sanctum::actingAs($this->admin);
        $payload = $this->validOwnerPayload();
        $payload['email'] = $this->ownerUser->email;

        $response = $this->postJson('/api/owners', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    // ---------- Update owner ----------

    public function test_update_owner_as_admin_returns_200_and_updated_owner_resource(): void
    {
        Sanctum::actingAs($this->admin);
        $payload = ['name' => 'Carmen López García', 'phone' => '+34 999 888 777'];

        $response = $this->putJson('/api/owners/' . $this->ownerUser->id, $payload);

        $response->assertStatus(200);
        $this->assertOwnerResourceStructure($response, false);
        $response->assertJsonPath('data.name', $payload['name']);
        $response->assertJsonPath('data.phone', $payload['phone']);
        $response->assertJsonPath('data.email', $this->ownerUser->email);
        $response->assertJsonMissingPath('data.password');

        $this->ownerUser->refresh();
        $this->assertSame($payload['name'], $this->ownerUser->name);
        $this->assertSame($payload['phone'], $this->ownerUser->phone);
    }

    public function test_update_owner_with_patch_returns_200(): void
    {
        Sanctum::actingAs($this->admin);
        $payload = ['address' => 'Nueva dirección 1'];

        $response = $this->patchJson('/api/owners/' . $this->ownerUser->id, $payload);

        $response->assertStatus(200);
        $response->assertJsonPath('data.address', $payload['address']);
    }

    public function test_update_owner_with_invalid_email_returns_422(): void
    {
        Sanctum::actingAs($this->admin);
        $other = User::factory()->create(['role' => 'owner', 'email' => 'other@example.com']);
        $payload = ['email' => $other->email];

        $response = $this->putJson('/api/owners/' . $this->ownerUser->id, $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    public function test_update_owner_with_invalid_id_returns_404(): void
    {
        Sanctum::actingAs($this->admin);
        $response = $this->putJson('/api/owners/99999', ['name' => 'X']);

        $response->assertStatus(404);
    }

    // ---------- Delete owner ----------

    public function test_delete_owner_as_admin_returns_200_and_soft_deletes(): void
    {
        Sanctum::actingAs($this->admin);
        $id = $this->ownerUser->id;

        $response = $this->deleteJson('/api/owners/' . $id);

        $response->assertStatus(200);
        $response->assertJsonPath('message', 'Owner soft deleted.');

        $this->assertSoftDeleted('users', ['id' => $id]);
    }

    public function test_delete_owner_with_invalid_id_returns_404(): void
    {
        Sanctum::actingAs($this->admin);
        $response = $this->deleteJson('/api/owners/99999');

        $response->assertStatus(404);
    }

    // ---------- Unauthorized: non-admin ----------

    public function test_list_owners_as_owner_role_returns_403(): void
    {
        Sanctum::actingAs($this->ownerUser);

        $response = $this->getJson('/api/owners');

        $response->assertStatus(403);
    }

    public function test_list_owners_as_customer_returns_403(): void
    {
        Sanctum::actingAs($this->customer);

        $response = $this->getJson('/api/owners');

        $response->assertStatus(403);
    }

    public function test_show_owner_as_owner_role_returns_403(): void
    {
        Sanctum::actingAs($this->ownerUser);
        $otherOwner = User::factory()->create(['role' => 'owner']);

        $response = $this->getJson('/api/owners/' . $otherOwner->id);

        $response->assertStatus(403);
    }

    public function test_show_owner_as_customer_returns_403(): void
    {
        Sanctum::actingAs($this->customer);

        $response = $this->getJson('/api/owners/' . $this->ownerUser->id);

        $response->assertStatus(403);
    }

    public function test_create_owner_as_owner_role_returns_403(): void
    {
        Sanctum::actingAs($this->ownerUser);

        $response = $this->postJson('/api/owners', $this->validOwnerPayload());

        $response->assertStatus(403);
    }

    public function test_create_owner_as_customer_returns_403(): void
    {
        Sanctum::actingAs($this->customer);

        $response = $this->postJson('/api/owners', $this->validOwnerPayload());

        $response->assertStatus(403);
    }

    public function test_update_owner_as_owner_role_returns_403(): void
    {
        Sanctum::actingAs($this->ownerUser);

        $response = $this->putJson('/api/owners/' . $this->ownerUser->id, ['name' => 'Changed']);

        $response->assertStatus(403);
    }

    public function test_update_owner_as_customer_returns_403(): void
    {
        Sanctum::actingAs($this->customer);

        $response = $this->putJson('/api/owners/' . $this->ownerUser->id, ['name' => 'Changed']);

        $response->assertStatus(403);
    }

    public function test_delete_owner_as_owner_role_returns_403(): void
    {
        Sanctum::actingAs($this->ownerUser);
        $otherOwner = User::factory()->create(['role' => 'owner']);

        $response = $this->deleteJson('/api/owners/' . $otherOwner->id);

        $response->assertStatus(403);
    }

    public function test_delete_owner_as_customer_returns_403(): void
    {
        Sanctum::actingAs($this->customer);

        $response = $this->deleteJson('/api/owners/' . $this->ownerUser->id);

        $response->assertStatus(403);
    }

    // ---------- Unauthenticated ----------

    public function test_list_owners_unauthenticated_returns_401(): void
    {
        $response = $this->getJson('/api/owners');

        $response->assertStatus(401);
    }

    public function test_show_owner_unauthenticated_returns_401(): void
    {
        $response = $this->getJson('/api/owners/' . $this->ownerUser->id);

        $response->assertStatus(401);
    }

    public function test_create_owner_unauthenticated_returns_401(): void
    {
        $response = $this->postJson('/api/owners', $this->validOwnerPayload());

        $response->assertStatus(401);
    }

    public function test_update_owner_unauthenticated_returns_401(): void
    {
        $response = $this->putJson('/api/owners/' . $this->ownerUser->id, ['name' => 'X']);

        $response->assertStatus(401);
    }

    public function test_delete_owner_unauthenticated_returns_401(): void
    {
        $response = $this->deleteJson('/api/owners/' . $this->ownerUser->id);

        $response->assertStatus(401);
    }
}
