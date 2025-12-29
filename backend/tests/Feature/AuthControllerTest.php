<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Validator;

class AuthControllerTest extends TestCase
{
    /** @test */
    public function registration_validates_required_fields()
    {
        $request = Request::create('/api/register', 'POST', []);
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);
        
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('name', $validator->errors()->toArray());
        $this->assertArrayHasKey('email', $validator->errors()->toArray());
        $this->assertArrayHasKey('password', $validator->errors()->toArray());
    }
    
    /** @test */
    public function login_validates_required_fields()
    {
        $request = Request::create('/api/login', 'POST', []);
        
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);
        
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('email', $validator->errors()->toArray());
        $this->assertArrayHasKey('password', $validator->errors()->toArray());
    }
    
    /** @test */
    public function auth_controller_methods_exist()
    {
        $controller = new AuthController();
        
        // Check if methods exist
        $this->assertTrue(method_exists($controller, 'register'));
        $this->assertTrue(method_exists($controller, 'login'));
        $this->assertTrue(method_exists($controller, 'logout'));
        $this->assertTrue(method_exists($controller, 'user'));
    }
}