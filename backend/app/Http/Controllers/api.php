<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ActivityController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/categories', [ActivityController::class, 'categories']);

// Test route
Route::get('/test-connection', function() {
    return response()->json([
        'status' => 'success',
        'message' => 'Laravel backend is working!',
        'timestamp' => now()
    ]);
});

// Protected routes with simple token middleware
Route::middleware('simple.token')->group(function () {
    Route::get('/debug-middleware', function (\Illuminate\Http\Request $request) {
        return response()->json([
            'message' => 'Middleware test',
            'user' => auth()->user() ? [
                'id' => auth()->user()->_id,
                'email' => auth()->user()->email,
                'has_api_token' => isset(auth()->user()->api_token)
            ] : null,
            'token' => $request->bearerToken()
        ]);
    });
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Activity routes
    Route::apiResource('activities', ActivityController::class);
});