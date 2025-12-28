<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\DB;

abstract class MongoDBTestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        // Clear MongoDB collections before each test
        if (DB::connection('mongodb')->getDatabaseName() === 'activity_tracker_test') {
            $collections = ['users', 'activities'];
            foreach ($collections as $collection) {
                DB::connection('mongodb')->collection($collection)->delete();
            }
        }
    }

    protected function tearDown(): void
    {
        // Clear collections after each test
        if (DB::connection('mongodb')->getDatabaseName() === 'activity_tracker_test') {
            $collections = ['users', 'activities'];
            foreach ($collections as $collection) {
                DB::connection('mongodb')->collection($collection)->delete();
            }
        }
        
        parent::tearDown();
    }
}