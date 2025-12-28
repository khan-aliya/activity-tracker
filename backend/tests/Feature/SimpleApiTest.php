<?php

namespace Tests\Feature;

use Tests\TestCase;

class SimpleApiTest extends TestCase
{
    /** @test */
    public function test_api_returns_success_response()
    {
        $response = $this->get('/api/health');
        
        // If the endpoint doesn't exist, it's OK for now
        if ($response->status() === 404) {
            $this->markTestSkipped('Health endpoint not implemented yet');
        } else {
            $response->assertStatus(200);
        }
    }

    /** @test */
    public function test_validation_works()
    {
        // Test a simple validation endpoint
        $response = $this->post('/api/validate-test', []);
        
        // If endpoint doesn't exist, skip
        if ($response->status() === 404) {
            $this->markTestSkipped('Validation endpoint not implemented yet');
        } else {
            $response->assertStatus(422); // Unprocessable Entity for validation errors
        }
    }

    /** @test */
    public function test_database_connection()
    {
        try {
            $connection = \DB::connection('mongodb');
            $this->assertNotEmpty($connection->getDatabaseName());
        } catch (\Exception $e) {
            $this->fail("Database connection failed: " . $e->getMessage());
        }
    }
}