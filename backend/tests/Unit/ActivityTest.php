<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Activity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ActivityTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_an_activity()
    {
        // Create a user first
        $user = User::factory()->create();

        $activity = Activity::create([
            'user_id' => $user->_id,
            'title' => 'Test Activity',
            'description' => 'This is a test description.',
            'type' => 'exercise',
            'duration' => 30,
            'date' => now()->format('Y-m-d'),
            'status' => 'completed'
        ]);

        $this->assertInstanceOf(Activity::class, $activity);
        $this->assertEquals('Test Activity', $activity->title);
        $this->assertEquals('exercise', $activity->type);
        $this->assertEquals($user->_id, $activity->user_id);
    }

    /** @test */
    public function activity_belongs_to_a_user()
    {
        $user = User::factory()->create();
        $activity = Activity::factory()->create(['user_id' => $user->_id]);

        $this->assertInstanceOf(User::class, $activity->user);
        $this->assertEquals($user->_id, $activity->user->_id);
    }

    /** @test */
    public function activity_has_required_fields()
    {
        $user = User::factory()->create();
        
        $this->expectException(\Exception::class);
        
        Activity::create([
            'user_id' => $user->_id,
            // Missing required fields
        ]);
    }
}