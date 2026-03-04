<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeliveryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_delivery_availability_requires_auth(): void
    {
        $response = $this->getJson('/api/v1/delivery/availability');
        $response->assertStatus(401);
    }

    public function test_delivery_availability_returns_ok_for_delivery_user(): void
    {
        $user = User::factory()->create(['role' => 'delivery']);
        $response = $this->actingAs($user)->getJson('/api/v1/delivery/availability');
        $response->assertOk();
        $response->assertJsonPath('data.isOnline', false);
    }
}
