<?php

// Final test runner with correct paths
require __DIR__.'/vendor/autoload.php';

echo "=========================================\n";
echo "Activity Tracker - Day 6 Final Test Suite\n";
echo "=========================================\n\n";

$passed = 0;
$failed = 0;

function test($name, $condition, $successMsg = null, $failMsg = null) {
    global $passed, $failed;
    
    if ($condition) {
        echo "   ✅ " . ($successMsg ?: $name) . "\n";
        $passed++;
        return true;
    } else {
        echo "   " . ($failMsg ? "⚠️  {$failMsg}" : "❌ {$name} failed") . "\n";
        $failed++;
        return false;
    }
}

echo "1. BACKEND INFRASTRUCTURE:\n";

// MongoDB connection
try {
    $mongo = new MongoDB\Client('mongodb://127.0.0.1:27017');
    $dbs = $mongo->listDatabases();
    $hasDb = false;
    foreach ($dbs as $db) {
        if ($db->getName() === 'activity_tracker') {
            $hasDb = true;
            break;
        }
    }
    test('MongoDB Connection', $hasDb, 'MongoDB connected with activity_tracker database');
} catch (Exception $e) {
    test('MongoDB Connection', false, null, 'MongoDB connection failed: ' . $e->getMessage());
}

// Laravel app
test('Laravel Application', file_exists(__DIR__.'/bootstrap/app.php'), 'Laravel application structure exists');

// Routes
test('API Routes', file_exists(__DIR__.'/routes/api.php'), 'API routes file exists');

// Models
test('User Model', class_exists('App\Models\User'), 'User model exists');
test('Activity Model', class_exists('App\Models\Activity'), 'Activity model exists');

// Controllers
test('AuthController', class_exists('App\Http\Controllers\Api\AuthController'), 'AuthController exists');
test('ActivityController', class_exists('App\Http\Controllers\Api\ActivityController'), 'ActivityController exists');

echo "\n2. FRONTEND STRUCTURE:\n";

$frontendPath = __DIR__.'/../frontend';
if (file_exists($frontendPath)) {
    test('Frontend Directory', true, 'Frontend directory exists');
    
    // Check your actual structure
    $actualPaths = [
        'LoginForm' => 'src/components/LoginForm.jsx',
        'RegisterForm' => 'src/components/RegisterForm.jsx',
        'ProtectedRoute' => 'src/components/ProtectedRoute.jsx', 
        'AuthContext' => 'src/context/AuthContext.jsx', // singular 'context'
    ];
    
    foreach ($actualPaths as $component => $path) {
        $fullPath = $frontendPath . '/' . $path;
        test($component, file_exists($fullPath), "{$component} at {$path}");
    }
    
    // Check App.jsx
    $appPath = $frontendPath . '/src/App.jsx';
    if (file_exists($appPath)) {
        test('App.jsx', true, 'App.jsx file exists');
        
        $content = file_get_contents($appPath);
        $hasReactRouter = str_contains($content, 'react-router-dom');
        $hasBootstrap = str_contains($content, 'bootstrap') || str_contains($content, 'Bootstrap');
        
        test('React Router', $hasReactRouter, 'App.jsx uses React Router');
        test('Bootstrap', $hasBootstrap, 'App.jsx uses Bootstrap');
    }
} else {
    test('Frontend Directory', false, null, 'Frontend directory not found');
}

echo "\n3. AUTHENTICATION SYSTEM:\n";

// Check backend auth methods
if (class_exists('App\Http\Controllers\Api\AuthController')) {
    $methods = get_class_methods('App\Http\Controllers\Api\AuthController');
    $requiredMethods = ['register', 'login', 'logout', 'user'];
    
    foreach ($requiredMethods as $method) {
        test("AuthController::{$method}", in_array($method, $methods), "AuthController has {$method} method");
    }
}

// Check middleware
test('ApiAuth Middleware', class_exists('App\Http\Middleware\ApiAuth'), 'ApiAuth middleware exists');

// Check routes in api.php
if (file_exists(__DIR__.'/routes/api.php')) {
    $content = file_get_contents(__DIR__.'/routes/api.php');
    $requiredRoutes = ['/auth/register', '/auth/login', '/activities'];
    
    foreach ($requiredRoutes as $route) {
        test("Route {$route}", str_contains($content, $route), "API route {$route} defined");
    }
}

echo "\n=========================================\n";
echo "TEST RESULTS SUMMARY:\n";
echo "✅ Passed: {$passed}\n";
echo "❌ Failed: {$failed}\n";
echo "Total Tests: " . ($passed + $failed) . "\n";

$percentage = round(($passed / ($passed + $failed)) * 100, 1);

if ($percentage >= 90) {
    echo "\n🎉 EXCELLENT! {$percentage}% tests passed\n";
    echo "Day 6 Authentication System is COMPLETE!\n";
} elseif ($percentage >= 70) {
    echo "\n👍 GOOD! {$percentage}% tests passed\n";
    echo "Day 6 Authentication System is mostly complete.\n";
} else {
    echo "\n⚠️  NEEDS WORK: {$percentage}% tests passed\n";
    echo "Some Day 6 requirements need attention.\n";
}

echo "=========================================\n";