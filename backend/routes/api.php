<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ActivityController;

// Public routes
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Activity Tracker API v1.0',
        'database' => 'MongoDB connected',
        'timestamp' => now()->toDateTimeString()
    ]);
});

// Test route to check MongoDB
Route::get('/test-db', function () {
    try {
        $connection = DB::connection('mongodb');
        return response()->json([
            'database' => $connection->getDatabaseName(),
            'status' => 'connected',
            'server' => 'MongoDB'
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('activities', ActivityController::class);
    Route::get('/user', function (\Illuminate\Http\Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Fallback for undefined routes
Route::fallback(function () {
    return response()->json([
        'message' => 'API endpoint not found. Check /api/health for available routes.',
        'documentation' => 'See routes/api.php for endpoint definitions'
    ], 404);
});
