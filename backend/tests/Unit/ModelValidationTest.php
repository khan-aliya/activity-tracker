<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Activity;

class ModelValidationTest extends TestCase
{
    /** @test */
    public function user_model_has_correct_fillable_fields()
    {
        $fillable = ['name', 'email', 'password', 'api_token'];
        $user = new User();
        
        $this->assertEquals($fillable, $user->getFillable());
    }
    
    /** @test */
    public function activity_model_has_correct_fillable_fields()
    {
        $fillable = [
            'user_id',
            'title',
            'category',
            'sub_category',
            'duration',
            'date',
            'feeling',
            'notes',
            'status'
        ];
        $activity = new Activity();
        
        $this->assertEquals($fillable, $activity->getFillable());
    }
    
    /** @test */
    public function activity_model_has_correct_casts()
    {
        $casts = [
            'duration' => 'integer',
            'feeling' => 'integer',
            'date' => 'date'
        ];
        $activity = new Activity();
        
        $this->assertEquals($casts, $activity->getCasts());
    }
}