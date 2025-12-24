<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ActivityController;

// Test route
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working',
        'timestamp' => now()->toDateTimeString(),
        'version' => '1.0',
        'status' => 'active'
    ]);
});

// Public auth routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware(['auth:api'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    
    Route::apiResource('activities', ActivityController::class);
    Route::get('/activities/stats', [ActivityController::class, 'stats']);
});

// Fallback for testing
Route::fallback(function () {
    return response()->json([
        'error' => 'Route not found',
        'available_routes' => [
            'GET /api/test',
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/activities',
            'POST /api/activities',
            'GET /api/activities/{id}',
            'PUT /api/activities/{id}',
            'DELETE /api/activities/{id}',
            'GET /api/activities/stats'
        ]
    ], 404);
});