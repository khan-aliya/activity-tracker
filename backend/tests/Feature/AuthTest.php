<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;

class AuthTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        // Clear users collection before each test
        User::truncate();
    }
    
    /** 
     * Test that user can register
     */
    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);
        
        // Check we get a 201 response
        $response->assertStatus(201);
        
        // Check response structure
        $response->assertJsonStructure([
            'user' => ['name', 'email'],
            'token',
            'message'
        ]);
        
        // Check user was created
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com'
        ]);
    }
    
    /** 
     * Test that registration requires valid email
     */
    public function test_registration_requires_valid_email(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test',
            'email' => 'not-an-email',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);
        
        $response->assertStatus(422);
    }
    
    /** 
     * Test that user can login
     */
    public function test_user_can_login(): void
    {
        // First create a user
        $user = User::create([
            'name' => 'Test User',
            'email' => 'login@test.com',
            'password' => bcrypt('password123')
        ]);
        
        $response = $this->postJson('/api/auth/login', [
            'email' => 'login@test.com',
            'password' => 'password123'
        ]);
        
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'user' => ['name', 'email'],
            'token'
        ]);
    }
    
    /** 
     * Test API test route works
     */
    public function test_api_test_route_works(): void
    {
        $response = $this->get('/api/test');
        $response->assertStatus(200)
                 ->assertJson(['message' => 'API is working']);
    }
}
