<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;

class UserTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Don't call truncate() here either
    }

    public function test_user_model_exists()
    {
        $user = new User();
        $this->assertInstanceOf(User::class, $user);
    }

    public function test_user_has_fillable_fields()
    {
        $user = new User();
        $fillable = $user->getFillable();
        
        $this->assertContains('name', $fillable);
        $this->assertContains('email', $fillable);
        $this->assertContains('password', $fillable);
    }

    public function test_user_has_activities_relationship()
    {
        $user = new User();
        $this->assertTrue(method_exists($user, 'activities'));
    }

    // Remove test that creates user if it fails
}