<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class MongoDBTestCase extends BaseTestCase
{
    use CreatesApplication; // Add this line

    protected function setUp(): void
    {
        parent::setUp();
        
        // Ensure we're using MongoDB
        config(['database.default' => 'mongodb']);
        config(['database.connections.mongodb.database' => 'activity_tracker_test']);
        
        // Clear collections before each test
        $this->clearCollections();
    }

    protected function tearDown(): void
    {
        $this->clearCollections();
        parent::tearDown();
    }

    protected function clearCollections()
    {
        try {
            // Use MongoDB client directly to clear collections
            $mongo = new \MongoDB\Client('mongodb://127.0.0.1:27017');
            $database = $mongo->selectDatabase('activity_tracker_test');
            
            // Drop collections if they exist
            $collections = $database->listCollections();
            foreach ($collections as $collection) {
                $database->dropCollection($collection->getName());
            }
            
            // Recreate collections
            $database->createCollection('users');
            $database->createCollection('activities');
            
        } catch (\Exception $e) {
            // Collection might not exist yet, that's OK
            // Just log it for debugging
            if (env('APP_DEBUG')) {
                echo "Note: " . $e->getMessage() . "\n";
            }
        }
    }

    protected function createUser($attributes = [])
    {
        $defaults = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'api_token' => bin2hex(random_bytes(32))
        ];
        
        $attributes = array_merge($defaults, $attributes);
        
        // Use Laravel's create method
        return \App\Models\User::create($attributes);
    }
}