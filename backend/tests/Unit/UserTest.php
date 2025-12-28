<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Activity;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_be_created()
    {
        $user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ]);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('John Doe', $user->name);
        $this->assertEquals('john@example.com', $user->email);
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    /** @test */
    public function user_has_many_activities()
    {
        $user = User::factory()->create();
        $activity1 = Activity::factory()->create(['user_id' => $user->_id]);
        $activity2 = Activity::factory()->create(['user_id' => $user->_id]);

        $this->assertCount(2, $user->activities);
        $this->assertInstanceOf(Activity::class, $user->activities->first());
    }

    /** @test */
    public function user_can_generate_auth_token()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $this->assertIsString($token);
        $this->assertNotEmpty($token);
    }

    /** @test */
    public function user_password_is_hashed()
    {
        $user = User::factory()->create([
            'password' => 'plainpassword'
        ]);

        $this->assertNotEquals('plainpassword', $user->password);
        $this->assertTrue(Hash::check('plainpassword', $user->password));
    }
}