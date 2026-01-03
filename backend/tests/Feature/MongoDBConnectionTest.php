<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\DB;

class MongoDBConnectionTest extends TestCase
{
    /** @test */
    public function it_can_connect_to_mongodb()
    {
        try {
            $connection = DB::connection('mongodb');
            $this->assertEquals(env('DB_DATABASE'), $connection->getDatabaseName());

            echo "✓ MongoDB connected successfully to: " . $connection->getDatabaseName() . "\n";
        } catch (\Exception $e) {
            $this->fail("Could not connect to MongoDB: " . $e->getMessage());
        }
    }
}