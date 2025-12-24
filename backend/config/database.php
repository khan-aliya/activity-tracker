<?php

return [
    'default' => env('DB_CONNECTION', 'mongodb'),
    
    'connections' => [
        'mongodb' => [
            'driver' => 'mongodb',
            'dsn' => env('MONGODB_URI', 'mongodb://127.0.0.1:27017/activity_tracker'),
            'database' => 'activity_tracker',
        ],
        
        'testing' => [
            'driver' => 'mongodb',
            'dsn' => env('MONGODB_URI', 'mongodb://127.0.0.1:27017/activity_tracker_test'),
            'database' => 'activity_tracker_test',
        ],
    ],
    
    'migrations' => 'migrations',
];