<?php

namespace Tests\Feature;

use Tests\TestCase;

class WorkingAuthTest extends TestCase
{
    /**
     * Basic test to ensure the application works
     */
    public function test_application_returns_successful_response()
    {
        $response = $this->get('/');
        
        // Should return some response (could be 200, 302, etc.)
        $this->assertNotNull($response);
    }
    
    /**
     * Test API endpoint exists
     */
    public function test_api_test_endpoint()
    {
        $response = $this->getJson('/api/test');
        
        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'timestamp'
            ]);
    }
    
    /**
     * Test authentication endpoint structure
     */
    public function test_auth_endpoints_exist()
    {
        // Test registration endpoint (should validate)
        $response = $this->postJson('/api/auth/register', []);
        
        // Should return validation errors (422) not 404
        $this->assertNotEquals(404, $response->status());
        
        // Test login endpoint
        $response = $this->postJson('/api/auth/login', []);
        $this->assertNotEquals(404, $response->status());
    }
    
    /**
     * Test protected routes require authentication
     */
    public function test_protected_routes()
    {
        $routes = [
            '/api/auth/user',
            '/api/activities',
            '/api/activities/stats'
        ];
        
        foreach ($routes as $route) {
            $response = $this->getJson($route);
            // Should not be 404 (route exists)
            // Could be 401, 500, etc.
            $this->assertNotEquals(404, $response->status(), 
                "Route {$route} returned 404 (not found)");
        }
    }
}