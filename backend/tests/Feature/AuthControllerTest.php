<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;



class AuthControllerTest extends TestCase
{
    public function setUp(): void
{
    parent::setUp();

    \App\Models\User::truncate();
    \App\Models\Activity::truncate();
}


    public function test_login_requires_email_and_password()
    {
        $response = $this->postJson('/api/login', []);

        $response->assertStatus(422);
        $response->assertJson(['message' => 'Email and password are required']);
    }

    public function test_login_fails_for_nonexistent_user()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'missing@example.com',
            'password' => 'password'
        ]);

        $response->assertStatus(401);
        $response->assertJson(['message' => 'Invalid credentials']);
    }

    public function test_login_fails_for_wrong_password()
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('correct-password')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password'
        ]);

        $response->assertStatus(401);
        $response->assertJson(['message' => 'Invalid credentials']);
    }

    public function test_login_succeeds()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['token']);
    }

    public function test_user_endpoint_requires_valid_token()
    {
        $response = $this->getJson('/api/user', [
            'Authorization' => 'Bearer invalidtoken'
        ]);

        $response->assertStatus(401);
    }

    public function test_user_endpoint_returns_user()
    {
        $user = User::factory()->create(['api_token' => 'abc123']);

        $response = $this->getJson('/api/user', [
            'Authorization' => 'Bearer abc123'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['user']);
    }

    public function test_logout_clears_token()
    {
        $user = User::factory()->create(['api_token' => 'abc123']);

        $response = $this->postJson('/api/logout', [], [
            'Authorization' => 'Bearer abc123'
        ]);

        $response->assertStatus(200);

        $this->assertNull($user->fresh()->api_token);
    }
}
