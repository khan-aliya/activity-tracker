<?php

namespace Tests;

use MongoDBTestCase;

abstract class TestCase extends MongoDBTestCase
{
    protected function createUser($attributes = [])
    {
        return \App\Models\User::factory()->create(array_merge([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ], $attributes));
    }

    protected function authenticate($user = null)
    {
        if (!$user) {
            $user = $this->createUser();
        }
        
        $token = $user->createToken('test-token')->plainTextToken;
        
        return [
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json'
        ];
    }
}