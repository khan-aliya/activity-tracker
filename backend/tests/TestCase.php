<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Disable middleware that might interfere with testing
        // $this->withoutMiddleware();
        
        // Use SQLite for testing instead of MongoDB for simplicity
        // We'll mock the MongoDB behavior
    }
}