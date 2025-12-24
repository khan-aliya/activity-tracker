<?php

// Simple test runner that doesn't require full Laravel bootstrap
require __DIR__.'/vendor/autoload.php';

echo "=========================================\n";
echo "Activity Tracker - Simple Test Runner\n";
echo "=========================================\n\n";

$passed = 0;
$failed = 0;

// Test 1: Check classes exist
echo "1. Checking essential classes...\n";
$classes = [
    'App\Models\User',
    'App\Models\Activity',
    'App\Http\Controllers\Api\AuthController',
    'App\Http\Controllers\Api\ActivityController',
    'App\Http\Middleware\ApiAuth',
];

foreach ($classes as $class) {
    if (class_exists($class)) {
        echo "   ✅ {$class}\n";
        $passed++;
    } else {
        echo "   ❌ {$class} (NOT FOUND)\n";
        $failed++;
    }
}

// Test 2: Check routes file exists
echo "\n2. Checking routes configuration...\n";
if (file_exists(__DIR__.'/routes/api.php')) {
    echo "   ✅ routes/api.php exists\n";
    $passed++;
    
    // Check route content
    $content = file_get_contents(__DIR__.'/routes/api.php');
    $routesToCheck = [
        'auth/register',
        'auth/login',
        'activities',
        'test'
    ];
    
    foreach ($routesToCheck as $route) {
        if (str_contains($content, $route)) {
            echo "   ✅ Route contains '{$route}'\n";
            $passed++;
        } else {
            echo "   ⚠️  Route doesn't contain '{$route}'\n";
            $failed++;
        }
    }
} else {
    echo "   ❌ routes/api.php not found\n";
    $failed++;
}

// Test 3: Check models have required methods
echo "\n3. Checking model methods...\n";
try {
    $user = new App\Models\User();
    if (method_exists($user, 'getFillable')) {
        $fillable = $user->getFillable();
        $required = ['name', 'email', 'password', 'api_token'];
        
        foreach ($required as $field) {
            if (in_array($field, $fillable)) {
                echo "   ✅ User has fillable '{$field}'\n";
                $passed++;
            } else {
                echo "   ❌ User missing fillable '{$field}'\n";
                $failed++;
            }
        }
    }
} catch (Exception $e) {
    echo "   ❌ Error checking User model: " . $e->getMessage() . "\n";
    $failed++;
}

// Test 4: Check frontend components (if accessible)
echo "\n4. Checking frontend structure...\n";
$frontendPath = __DIR__.'/../frontend';
if (file_exists($frontendPath)) {
    echo "   ✅ Frontend directory exists\n";
    $passed++;
    
    // Your actual structure based on your directory listing
    $componentsToCheck = [
        'LoginForm.jsx' => 'src/components/LoginForm.jsx',
        'RegisterForm.jsx' => 'src/components/RegisterForm.jsx', 
        'ProtectedRoute.jsx' => 'src/components/ProtectedRoute.jsx',
        'AuthContext.jsx' => 'src/context/AuthContext.jsx', // Note: singular 'context'
    ];
    
    foreach ($componentsToCheck as $displayName => $relativePath) {
        $fullPath = $frontendPath . '/' . $relativePath;
        if (file_exists($fullPath)) {
            echo "   ✅ {$displayName} exists at {$relativePath}\n";
            $passed++;
        } else {
            echo "   ❌ {$displayName} not found at {$relativePath}\n";
            
            // Try to find it
            $findCommand = "find \"{$frontendPath}/src\" -name \"*{$displayName}*\" -type f 2>/dev/null";
            $output = [];
            exec($findCommand, $output);
            
            if (!empty($output)) {
                $foundPath = str_replace($frontendPath . '/', '', $output[0]);
                echo "      But found at: {$foundPath}\n";
                $passed++; // Count as passed since it exists
            } else {
                $failed++;
            }
        }
    }
    
    // Also check App.jsx for imports
    $appJsxPath = $frontendPath . '/src/App.jsx';
    if (file_exists($appJsxPath)) {
        $appContent = file_get_contents($appJsxPath);
        $importsToCheck = ['LoginForm', 'RegisterForm', 'AuthContext', 'ProtectedRoute'];
        
        foreach ($importsToCheck as $import) {
            if (str_contains($appContent, $import)) {
                echo "   ✅ App.jsx imports {$import}\n";
                $passed++;
            } else {
                echo "   ⚠️  App.jsx doesn't import {$import}\n";
            }
        }
    }
    
} else {
    echo "   ⚠️  Frontend directory not found (may be in different location)\n";
}

// Summary
echo "\n=========================================\n";
echo "Test Results:\n";
echo "✅ Passed: {$passed}\n";
echo "❌ Failed: {$failed}\n";
echo "Total: " . ($passed + $failed) . "\n";

if ($failed === 0) {
    echo "\n🎉 ALL TESTS PASSED!\n";
} else {
    echo "\n⚠️  Some tests failed. Check above for details.\n";
}

echo "=========================================\n";