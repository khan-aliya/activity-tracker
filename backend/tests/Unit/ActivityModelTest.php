<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Activity;

class ActivityModelTest extends TestCase
{
    /** 
     * Test that an activity can be created
     */
    public function test_it_can_create_an_activity(): void
    {
        $activity = new Activity([
            'title' => 'Test Activity',
            'description' => 'Test Description',
            'category' => 'Work',
            'duration' => 60,
            'priority' => 'medium',
        ]);
        
        $this->assertEquals('Test Activity', $activity->title);
        $this->assertEquals('Work', $activity->category);
        $this->assertEquals(60, $activity->duration);
    }
    
    /** 
     * Test that activity has required fields
     */
    public function test_it_has_required_fields(): void
    {
        $activity = new Activity([
            'title' => 'Required Test',
            'category' => 'Test',
            'duration' => 30,
            'priority' => 'low',
        ]);
        
        $this->assertNotEmpty($activity->title);
        $this->assertNotEmpty($activity->category);
        $this->assertNotEmpty($activity->duration);
    }
}