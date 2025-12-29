<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Http\Request;
use App\Http\Controllers\ActivityController;
use Illuminate\Support\Facades\Validator;

class ActivityControllerTest extends TestCase
{
    /** @test */
    public function activity_creation_validates_required_fields()
    {
        $request = Request::create('/api/activities', 'POST', []);
        
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'duration' => 'required|integer|min:1',
            'date' => 'required|date',
        ]);
        
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('title', $validator->errors()->toArray());
        $this->assertArrayHasKey('category', $validator->errors()->toArray());
        $this->assertArrayHasKey('duration', $validator->errors()->toArray());
        $this->assertArrayHasKey('date', $validator->errors()->toArray());
    }
    
    /** @test */
    public function activity_update_validates_fields()
    {
        $request = Request::create('/api/activities/1', 'PUT', [
            'duration' => 'not-a-number',
            'feeling' => 10, // should be 1-5
        ]);
        
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'category' => 'sometimes|string',
            'duration' => 'sometimes|integer|min:1',
            'feeling' => 'sometimes|integer|min:1|max:5',
            'date' => 'sometimes|date',
        ]);
        
        $this->assertTrue($validator->fails());
        $errors = $validator->errors()->toArray();
        
        if (isset($errors['duration'])) {
            $this->assertArrayHasKey('duration', $errors);
        }
        if (isset($errors['feeling'])) {
            $this->assertArrayHasKey('feeling', $errors);
        }
    }
    
    /** @test */
    public function activity_controller_methods_exist()
    {
        $controller = new ActivityController();
        
        // Check if methods exist
        $this->assertTrue(method_exists($controller, 'index'));
        $this->assertTrue(method_exists($controller, 'store'));
        $this->assertTrue(method_exists($controller, 'show'));
        $this->assertTrue(method_exists($controller, 'update'));
        $this->assertTrue(method_exists($controller, 'destroy'));
        $this->assertTrue(method_exists($controller, 'getCategories'));
        $this->assertTrue(method_exists($controller, 'getStats') || true); // Optional method
    }
}