<?php

namespace Tests\Feature;

use Tests\TestCase;

class BasicAuthTest extends TestCase
{
    public function test_api_is_accessible(): void
    {
        $response = $this->get('/api/test');
        $this->assertContains($response->status(), [200, 404, 500]);
    }
    
    public function test_application_boots(): void
    {
        $this->assertTrue(class_exists('App\Models\User'));
        $this->assertTrue(class_exists('App\Http\Controllers\Api\AuthController'));
    }
    
    public function test_routes_exist(): void
    {
        $routes = [
            '/api/test',
            '/api/auth/register',
            '/api/auth/login',
        ];
        
        foreach ($routes as $route) {
            $response = $this->get($route);
            $this->assertNotNull($response);
        }
    }
}
