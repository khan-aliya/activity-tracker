<?php

namespace Tests\Feature;

use Tests\TestCase;

class SimpleTest extends TestCase
{
    public function test_encryption_works()
    {
        // Test that encryption is configured
        $encrypted = encrypt('test-value');
        $decrypted = decrypt($encrypted);
        
        $this->assertEquals('test-value', $decrypted);
        $this->assertEquals('testing', app()->environment());
    }
    
    public function test_database_connection()
    {
        // Test MongoDB connection
        try {
            $databaseName = \Illuminate\Support\Facades\DB::connection('mongodb')->getDatabaseName();
            $this->assertNotEmpty($databaseName);
            echo "Database connected: " . $databaseName . "\n";
        } catch (\Exception $e) {
            $this->markTestSkipped('MongoDB not connected: ' . $e->getMessage());
        }
    }
}