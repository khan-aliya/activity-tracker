<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

abstract class MongoDBTestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Clear MongoDB collections
        $this->clearCollections();
    }

    protected function clearCollections()
    {
        // Skip if not using MongoDB
        if (config('database.default') !== 'mongodb') {
            return;
        }

        $collections = ['users', 'activities'];
        foreach ($collections as $collection) {
            DB::connection('mongodb')->collection($collection)->delete();
        }
    }

    protected function tearDown(): void
    {
        $this->clearCollections();
        parent::tearDown();
    }
}