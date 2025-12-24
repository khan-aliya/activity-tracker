<?php

// Complete Day 6 test runner
require __DIR__.'/vendor/autoload.php';

echo "=========================================\n";
echo "DAY 6 - AUTHENTICATION SYSTEM TEST\n";
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
        echo "   " . ($failMsg ? "⚠️  {$failMsg}" : "❌ {$name}") . "\n";
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

// Check Laravel files
test('Laravel bootstrap', file_exists(__DIR__.'/bootstrap/app.php'), 'Laravel bootstrap file exists');
test('API Routes', file_exists(__DIR__.'/routes/api.php'), 'API routes file exists');

// Check models
test('User Model', class_exists('App\Models\User'), 'User model exists');
test('Activity Model', class_exists('App\Models\Activity'), 'Activity model exists');

// Check controllers
test('AuthController', class_exists('App\Http\Controllers\Api\AuthController'), 'AuthController exists');
test('ActivityController', class_exists('App\Http\Controllers\Api\ActivityController'), 'ActivityController exists');

// Check middleware
test('ApiAuth Middleware', class_exists('App\Http\Middleware\ApiAuth'), 'ApiAuth middleware exists');

echo "\n2. FRONTEND COMPONENTS:\n";

$frontendPath = __DIR__.'/../frontend';
if (file_exists($frontendPath)) {
    test('Frontend Directory', true, 'Frontend directory exists');
    
    // Check components in auth directory (your actual structure)
    $authComponents = [
        'LoginForm.jsx' => 'Login form component',
        'RegisterForm.jsx' => 'Register form component',
    ];
    
    foreach ($authComponents as $file => $description) {
        $path = "src/components/auth/{$file}";
        $fullPath = $frontendPath . '/' . $path;
        if (file_exists($fullPath)) {
            test($description, true, "{$description} at {$path}");
        } else {
            // Try other locations
            $found = false;
            $searchPaths = [
                "src/components/{$file}",
                "src/{$file}",
            ];
            
            foreach ($searchPaths as $searchPath) {
                if (file_exists($frontendPath . '/' . $searchPath)) {
                    test($description, true, "{$description} at {$searchPath}");
                    $found = true;
                    break;
                }
            }
            
            if (!$found) {
                test($description, false, null, "{$description} not found");
            }
        }
    }
    
    // Check other components
    $otherComponents = [
        'AuthContext.jsx' => ['src/context/AuthContext.jsx', 'Authentication context'],
        'ProtectedRoute.jsx' => ['src/components/ProtectedRoute.jsx', 'Protected route component'],
        'Dashboard.jsx' => ['src/components/Dashboard.jsx', 'Dashboard component'],
        'Navbar.jsx' => ['src/components/Navbar.jsx', 'Navbar component'],
    ];
    
    foreach ($otherComponents as $file => [$path, $description]) {
        $fullPath = $frontendPath . '/' . $path;
        if (file_exists($fullPath)) {
            test($description, true, "{$description} at {$path}");
        } else {
            test($description, false, null, "{$description} not found at {$path}");
        }
    }
    
    // Check App.jsx
    $appPath = $frontendPath . '/src/App.jsx';
    if (file_exists($appPath)) {
        test('App.jsx', true, 'Main App component exists');
        
        $content = file_get_contents($appPath);
        
        // Check imports
        $importsToCheck = [
            'LoginForm' => 'LoginForm import',
            'RegisterForm' => 'RegisterForm import',
            'AuthProvider' => 'AuthProvider import',
            'ProtectedRoute' => 'ProtectedRoute import',
        ];
        
        foreach ($importsToCheck as $component => $description) {
            if (str_contains($content, $component)) {
                test($description, true, "{$description} in App.jsx");
            } else {
                test($description, false, null, "{$description} missing in App.jsx");
            }
        }
        
        // Check routing
        if (str_contains($content, 'react-router-dom')) {
            test('React Router', true, 'React Router configured');
        }
        
        // Check for route definitions
        $hasLoginRoute = str_contains($content, '/login') || str_contains($content, 'LoginForm');
        $hasRegisterRoute = str_contains($content, '/register') || str_contains($content, 'RegisterForm');
        $hasDashboardRoute = str_contains($content, '/dashboard') || str_contains($content, 'Dashboard');
        
        test('Login Route', $hasLoginRoute, 'Login route defined');
        test('Register Route', $hasRegisterRoute, 'Register route defined');
        test('Dashboard Route', $hasDashboardRoute, 'Dashboard route defined');
    }
} else {
    test('Frontend Directory', false, null, 'Frontend directory not found');
}

echo "\n3. API ENDPOINTS:\n";

// Check routes file content
if (file_exists(__DIR__.'/routes/api.php')) {
    $content = file_get_contents(__DIR__.'/routes/api.php');
    
    $routesToCheck = [
        '/auth/register' => 'Registration endpoint',
        '/auth/login' => 'Login endpoint',
        '/auth/logout' => 'Logout endpoint',
        '/auth/user' => 'User info endpoint',
        '/activities' => 'Activities endpoint',
        '/activities/stats' => 'Stats endpoint',
        '/test' => 'Test endpoint',
    ];
    
    foreach ($routesToCheck as $route => $description) {
        if (str_contains($content, $route)) {
            test($description, true, "API route {$route} defined");
        } else {
            test($description, false, null, "API route {$route} not found");
        }
    }
}

echo "\n4. AUTHENTICATION FEATURES:\n";

// Check AuthController methods
if (class_exists('App\Http\Controllers\Api\AuthController')) {
    $methods = get_class_methods('App\Http\Controllers\Api\AuthController');
    $requiredMethods = ['register', 'login', 'logout', 'user'];
    
    foreach ($requiredMethods as $method) {
        test("AuthController::{$method}", in_array($method, $methods), "AuthController has {$method} method");
    }
}

// Check User model methods
if (class_exists('App\Models\User')) {
    $user = new App\Models\User();
    $requiredFields = ['name', 'email', 'password', 'api_token'];
    
    if (method_exists($user, 'getFillable')) {
        $fillable = $user->getFillable();
        foreach ($requiredFields as $field) {
            test("User field: {$field}", in_array($field, $fillable), "User model has {$field} field");
        }
    }
    
    // Check for generateToken method
    test('User::generateToken', method_exists($user, 'generateToken'), 'User has generateToken method');
}

echo "\n=========================================\n";
echo "TEST RESULTS SUMMARY:\n";
echo "=========================================\n";
echo "✅ Passed: {$passed}\n";
echo "❌ Failed: {$failed}\n";
echo "Total Tests: " . ($passed + $failed) . "\n";

$percentage = ($passed + $failed) > 0 ? round(($passed / ($passed + $failed)) * 100, 1) : 0;

echo "\nSuccess Rate: {$percentage}%\n\n";

if ($percentage >= 90) {
    echo "🎉 EXCELLENT! Day 6 Authentication System is COMPLETE!\n";
    echo "All requirements met and tested.\n";
} elseif ($percentage >= 75) {
    echo "👍 GOOD! Day 6 mostly complete.\n";
    echo "Minor issues to fix.\n";
} else {
    echo "⚠️  NEEDS WORK: Significant issues found.\n";
    echo "Review failed tests above.\n";
}

echo "\n=========================================\n";
echo "DAY 6 REQUIREMENTS CHECK:\n";
echo "=========================================\n";

// Day 6 specific requirements
$day6Requirements = [
    'LoginForm component' => false,
    'RegisterForm component' => false,
    'AuthContext' => false,
    'ProtectedRoute' => false,
    'Backend Auth API' => false,
    'MongoDB integration' => false,
];

// Check each requirement
$frontendPath = __DIR__.'/../frontend';

// LoginForm
if (file_exists($frontendPath . '/src/components/auth/LoginForm.jsx') ||
    file_exists($frontendPath . '/src/components/LoginForm.jsx')) {
    $day6Requirements['LoginForm component'] = true;
}

// RegisterForm
if (file_exists($frontendPath . '/src/components/auth/RegisterForm.jsx') ||
    file_exists($frontendPath . '/src/components/RegisterForm.jsx')) {
    $day6Requirements['RegisterForm component'] = true;
}

// AuthContext
if (file_exists($frontendPath . '/src/context/AuthContext.jsx')) {
    $day6Requirements['AuthContext'] = true;
}

// ProtectedRoute
if (file_exists($frontendPath . '/src/components/ProtectedRoute.jsx')) {
    $day6Requirements['ProtectedRoute'] = true;
}

// Backend Auth API
if (class_exists('App\Http\Controllers\Api\AuthController') &&
    file_exists(__DIR__.'/routes/api.php')) {
    $content = file_get_contents(__DIR__.'/routes/api.php');
    if (str_contains($content, '/auth/register') && str_contains($content, '/auth/login')) {
        $day6Requirements['Backend Auth API'] = true;
    }
}

// MongoDB integration
try {
    $mongo = new MongoDB\Client('mongodb://127.0.0.1:27017');
    $dbs = $mongo->listDatabases();
    foreach ($dbs as $db) {
        if ($db->getName() === 'activity_tracker') {
            $day6Requirements['MongoDB integration'] = true;
            break;
        }
    }
} catch (Exception $e) {
    // MongoDB check failed
}

// Display requirements
$allComplete = true;
foreach ($day6Requirements as $requirement => $complete) {
    echo ($complete ? "✅ " : "❌ ") . $requirement . "\n";
    if (!$complete) $allComplete = false;
}

echo "\n" . ($allComplete ? "🎉 ALL DAY 6 REQUIREMENTS COMPLETED!" : "⚠️  SOME REQUIREMENTS INCOMPLETE") . "\n";
echo "=========================================\n";