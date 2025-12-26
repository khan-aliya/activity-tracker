<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Generate simple token
        $token = hash('sha256', $user->email . time() . rand(1000, 9999));
        $user->api_token = $token;
        $user->save();

        return response()->json([
            'user' => [
                'id' => $user->_id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'token' => $token,
            'token_type' => 'Bearer',
            'message' => 'Registration successful'
        ], 201);
    }

   public function login(Request $request)
{
    try {
        // Debug: Log what's being received
        \Log::info('Login attempt:', $request->all());
        
        // Simple validation - just check if fields exist
        if (!$request->email || !$request->password) {
            return response()->json([
                'success' => false,
                'message' => 'Email and password are required'
            ], 422);
        }

        // Find user
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Check password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Generate new token
        $token = hash('sha256', $user->email . time() . rand(1000, 9999));
        $user->api_token = $token;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user->_id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'token' => $token,
            'token_type' => 'Bearer'
        ]);

    } catch (\Exception $e) {
        \Log::error('Login error:', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Login failed: ' . $e->getMessage()
        ], 500);
    }
}

    public function logout(Request $request)
    {
        // Get user from token (since we're using simple token auth)
        $token = $request->bearerToken();
        $user = User::where('api_token', $token)->first();
        
        if ($user) {
            $user->api_token = null;
            $user->save();
        }

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request)
    {
        // Get user from token
        $token = $request->bearerToken();
        $user = User::where('api_token', $token)->first();
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        return response()->json([
            'user' => [
                'id' => $user->_id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);
    }
}