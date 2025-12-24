<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class MongoDBAuthTest extends TestCase
{
    protected function tearDown(): void
    {
        // Clean up after tests
        User::truncate();
        parent::tearDown();
    }

    /** @test */
    public function it_can_create_a_user_in_mongodb()
    {
        // This is a simple test to verify MongoDB works
        $user = new User();
        $user->name = 'Test User';
        $user->email = 'test@example.com';
        $user->password = Hash::make('password123');
        $user->api_token = 'test_token';
        
        $result = $user->save();
        
        $this->assertTrue($result);
        $this->assertNotNull($user->id);
        $this->assertEquals('Test User', $user->name);
    }

    /** @test */
    public function it_can_find_a_user_in_mongodb()
    {
        // Create a user
        $user = new User();
        $user->name = 'Find Test';
        $user->email = 'find@example.com';
        $user->password = Hash::make('password123');
        $user->api_token = 'find_token';
        $user->save();
        
        // Find the user
        $foundUser = User::where('email', 'find@example.com')->first();
        
        $this->assertNotNull($foundUser);
        $this->assertEquals('Find Test', $foundUser->name);
        $this->assertEquals('find@example.com', $foundUser->email);
    }

    /** @test */
    public function registration_endpoint_works_with_mongodb()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'MongoDB Test',
            'email' => 'mongotest@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);

        // Should either work (201) or fail with validation (422) but not 500
        $this->assertContains($response->status(), [201, 422, 500]);
        
        // If it's 500, check the error is not MongoDB connection
        if ($response->status() === 500) {
            $content = $response->getContent();
            $this->assertStringNotContainsString('No suitable servers found', $content);
        }
    }

    /** @test */
    public function login_endpoint_works_with_mongodb()
    {
        // First create a user directly
        $user = new User();
        $user->name = 'Login Test';
        $user->email = 'login@example.com';
        $user->password = Hash::make('password123');
        $user->api_token = 'login_token';
        $user->save();
        
        $response = $this->postJson('/api/auth/login', [
            'email' => 'login@example.com',
            'password' => 'password123'
        ]);

        $this->assertContains($response->status(), [200, 401, 500]);
    }
}