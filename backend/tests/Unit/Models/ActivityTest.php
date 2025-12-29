<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Activity;
use App\Models\User;

class ActivityTest extends TestCase
{
    /** @test */
    public function it_can_create_activity()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ]);

        $activity = Activity::create([
            'user_id' => $user->id,
            'title' => 'Test Activity',
            'category' => 'Self-care',
            'sub_category' => 'Workout',
            'duration' => 30,
            'date' => '2024-01-15',
            'feeling' => 5
        ]);

        $this->assertInstanceOf(Activity::class, $activity);
        $this->assertEquals('Test Activity', $activity->title);
        $this->assertEquals('Self-care', $activity->category);
        $this->assertEquals(30, $activity->duration);
    }

    /** @test */
    public function it_has_required_attributes()
    {
        $activity = new Activity([
            'title' => 'Test',
            'category' => 'Self-care',
            'duration' => 30,
            'date' => '2024-01-15'
        ]);

        $this->assertEquals('Test', $activity->title);
        $this->assertEquals('Self-care', $activity->category);
        $this->assertEquals(30, $activity->duration);
        $this->assertEquals('2024-01-15', $activity->date);
    }

    /** @test */
    public function it_can_have_notes_and_feeling()
    {
        $activity = new Activity([
            'title' => 'Test',
            'category' => 'Self-care',
            'duration' => 30,
            'date' => '2024-01-15',
            'feeling' => 4,
            'notes' => 'Had a good day'
        ]);

        $this->assertEquals(4, $activity->feeling);
        $this->assertEquals('Had a good day', $activity->notes);
    }
}