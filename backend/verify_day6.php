<?php

echo "DAY 6 VERIFICATION - QUICK CHECK\n";
echo "===============================\n\n";

$checks = [];

// 1. Check backend
echo "Backend:\n";
$checks[] = ['Laravel', file_exists(__DIR__.'/bootstrap/app.php')];
$checks[] = ['API Routes', file_exists(__DIR__.'/routes/api.php')];
$checks[] = ['User Model', class_exists('App\Models\User')];
$checks[] = ['AuthController', class_exists('App\Http\Controllers\Api\AuthController')];

// 2. Check frontend  
$frontendPath = __DIR__.'/../frontend';
echo "\nFrontend:\n";
$checks[] = ['Frontend dir', file_exists($frontendPath)];

if (file_exists($frontendPath)) {
    // Check in auth directory (your structure)
    $checks[] = ['LoginForm', file_exists($frontendPath . '/src/components/auth/LoginForm.jsx')];
    $checks[] = ['RegisterForm', file_exists($frontendPath . '/src/components/auth/RegisterForm.jsx')];
    $checks[] = ['AuthContext', file_exists($frontendPath . '/src/context/AuthContext.jsx')];
    $checks[] = ['ProtectedRoute', file_exists($frontendPath . '/src/components/ProtectedRoute.jsx')];
    $checks[] = ['App.jsx', file_exists($frontendPath . '/src/App.jsx')];
}

// 3. Check MongoDB - Skip if class not found, but check via other means
echo "\nDatabase:\n";
$checks[] = ['MongoDB config', file_exists(__DIR__.'/.env')];

// Check .env for MongoDB config
if (file_exists(__DIR__.'/.env')) {
    $envContent = file_get_contents(__DIR__.'/.env');
    $hasMongoConfig = str_contains($envContent, 'DB_CONNECTION=mongodb');
    $checks[] = ['MongoDB in .env', $hasMongoConfig];
}

// Check via system command
$mongoCheck = shell_exec('mongosh --eval "db.runCommand({ping:1})" 2>/dev/null');
$checks[] = ['MongoDB service', !empty($mongoCheck)];

// Check if we can connect via PHP (try-catch)
try {
    // Try to use the MongoDB class if available
    if (class_exists('MongoDB\Client')) {
        $mongo = new MongoDB\Client('mongodb://127.0.0.1:27017');
        $dbs = $mongo->listDatabases();
        $hasDb = false;
        foreach ($dbs as $db) {
            if ($db->getName() === 'activity_tracker') {
                $hasDb = true;
                break;
            }
        }
        $checks[] = ['MongoDB PHP class', true];
        $checks[] = ['activity_tracker DB', $hasDb];
    } else {
        $checks[] = ['MongoDB PHP class', false];
        $checks[] = ['activity_tracker DB', 'skipped - check manually'];
    }
} catch (Exception $e) {
    $checks[] = ['MongoDB PHP class', false];
    $checks[] = ['activity_tracker DB', false];
}

// Display results
echo "\nRESULTS:\n";
echo str_repeat("-", 40) . "\n";

$passed = 0;
$total = count($checks);

foreach ($checks as $check) {
    list($name, $result) = $check;
    if ($result === true || $result === 'skipped - check manually') {
        $icon = "✅";
        echo "{$icon} {$name}\n";
        if ($result === true) $passed++;
    } else {
        $icon = "❌";
        echo "{$icon} {$name}\n";
    }
}

echo str_repeat("-", 40) . "\n";
echo "Passed: {$passed}/{$total}\n";

$percentage = round(($passed / $total) * 100, 1);
echo "Score: {$percentage}%\n\n";

// Manual MongoDB check
echo "Manual MongoDB check:\n";
echo shell_exec('mongosh --eval "db.getCollectionNames()" activity_tracker 2>/dev/null') . "\n";

if ($percentage >= 90) {
    echo "🎉 DAY 6 COMPLETE! Ready for submission.\n";
} elseif ($percentage >= 70) {
    echo "👍 Good progress. Minor fixes needed.\n";
} else {
    echo "⚠️  Needs more work.\n";
}