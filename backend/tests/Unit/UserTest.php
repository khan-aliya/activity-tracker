<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Activity;
use Illuminate\Support\Facades\Hash;

class UserTest extends TestCase
{
    /** @test */
    public function user_can_be_created()
    {
        $user = User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
        ]);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('John Doe', $user->name);
        $this->assertEquals('john@example.com', $user->email);
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    /** @test */
    public function user_has_many_activities()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        Activity::create([
            'user_id' => $user->_id,
            'title' => 'A1',
            'category' => 'Self-care',
            'sub_category' => 'Workout',
            'duration' => 30,
            'date' => '2024-01-15',
            'feeling' => 5,
        ]);

        Activity::create([
            'user_id' => $user->_id,
            'title' => 'A2',
            'category' => 'Productivity',
            'sub_category' => 'Study',
            'duration' => 60,
            'date' => '2024-01-16',
            'feeling' => 7,
        ]);

        $activities = Activity::where('user_id', $user->_id)->get();

        $this->assertCount(2, $activities);
        $this->assertInstanceOf(Activity::class, $activities->first());
    }

    /** @test */
    public function user_password_is_hashed()
    {
        $user = User::create([
            'name' => 'Aliya',
            'email' => 'aliya@example.com',
            'password' => Hash::make('plainpassword'),
        ]);

        $this->assertNotEquals('plainpassword', $user->password);
        $this->assertTrue(Hash::check('plainpassword', $user->password));
    }
}
