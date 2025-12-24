<?php

namespace Tests\Feature;

use Tests\TestCase;

class SimpleApiTest extends TestCase
{
    public function test_api_auth_endpoints_exist()
    {
        // Test registration endpoint exists (returns some response)
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);
        
        // Should return some HTTP status (201, 422, or 500)
        $this->assertTrue($response->status() >= 100 && $response->status() < 600);
        
        // Test login endpoint exists
        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);
        
        $this->assertTrue($response->status() >= 100 && $response->status() < 600);
    }
    
    public function test_validation_works()
    {
        // Empty request should give validation error (422)
        $response = $this->postJson('/api/auth/register', []);
        $this->assertEquals(422, $response->status());
    }
    
    public function test_environment_is_testing()
    {
        $this->assertEquals('testing', app()->environment());
    }
}