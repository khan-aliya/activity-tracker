<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\DB;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();

        // Reset MongoDB before each test
        try {
            DB::connection('mongodb')->getMongoDB()->drop();
        } catch (\Exception $e) {
            // Ignore if MongoDB not ready
        }
    }
}
