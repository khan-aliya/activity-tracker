<?php

require __DIR__.'/vendor/autoload.php';

echo "=========================================\n";
echo "Activity Tracker - Day 6 Testing Suite\n";
echo "=========================================\n\n";

// Test 1: Check MongoDB connection
echo "1. Testing MongoDB Connection...\n";
try {
    $mongo = new MongoDB\Client('mongodb://127.0.0.1:27017');
    $dbs = $mongo->listDatabases();
    $dbNames = [];
    foreach ($dbs as $db) {
        $dbNames[] = $db->getName();
    }
    
    if (in_array('activity_tracker', $dbNames)) {
        echo "   ✅ MongoDB connection SUCCESSFUL\n";
        echo "   ✅ Found database: activity_tracker\n";
    } else {
        echo "   ⚠️  MongoDB connected but 'activity_tracker' database not found\n";
        echo "   ⚠️  Available databases: " . implode(', ', $dbNames) . "\n";
    }
} catch (Exception $e) {
    echo "   ❌ MongoDB connection FAILED: " . $e->getMessage() . "\n";
}

// Test 2: Check Laravel application
echo "\n2. Testing Laravel Application...\n";
try {
    $app = require __DIR__.'/bootstrap/app.php';
    $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
    echo "   ✅ Laravel application booted SUCCESSFULLY\n";
    
    // Check key
    $key = config('app.key');
    if (empty($key)) {
        echo "   ⚠️  Application key is not set\n";
    } else {
        echo "   ✅ Application key is set\n";
    }
    
} catch (Exception $e) {
    echo "   ❌ Laravel application FAILED: " . $e->getMessage() . "\n";
}

// Test 3: Check routes
echo "\n3. Testing API Routes...\n";
try {
    $routes = [
        '/api/test' => 'GET',
        '/api/auth/register' => 'POST',
        '/api/auth/login' => 'POST',
        '/api/activities' => 'GET'
    ];
    
    foreach ($routes as $route => $method) {
        echo "   {$method} {$route} - ";
        
        // Create a request
        $request = Illuminate\Http\Request::create($route, $method);
        $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
        
        try {
            $response = $kernel->handle($request);
            echo "✅ Exists (Status: {$response->getStatusCode()})\n";
        } catch (Exception $e) {
            echo "❌ Error: " . get_class($e) . "\n";
        }
    }
    
} catch (Exception $e) {
    echo "   ❌ Route testing FAILED: " . $e->getMessage() . "\n";
}

// Test 4: Check models
echo "\n4. Testing Models...\n";
try {
    $models = ['User', 'Activity'];
    
    foreach ($models as $model) {
        $class = "App\\Models\\{$model}";
        echo "   {$model} model - ";
        
        if (class_exists($class)) {
            $instance = new $class();
            echo "✅ Exists\n";
            
            // Check fillable attributes
            if (method_exists($instance, 'getFillable')) {
                $fillable = $instance->getFillable();
                echo "     Fillable: " . implode(', ', $fillable) . "\n";
            }
        } else {
            echo "❌ Not found\n";
        }
    }
    
} catch (Exception $e) {
    echo "   ❌ Model testing FAILED: " . $e->getMessage() . "\n";
}

echo "\n=========================================\n";
echo "Testing Complete\n";
echo "=========================================\n";