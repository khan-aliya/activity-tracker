<?php

namespace Tests;

use Illuminate\Contracts\Foundation\Application;

trait CreatesApplication
{
    public function createApplication(): Application
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

        // Set encryption key if not set
        $app['config']->set('app.key', 'base64:74xd1gFpgfNHCtPnrikb95FHi5NdlKzMHlDv+I2AYNU=');
        
        // Force the cipher
        $app['config']->set('app.cipher', 'AES-256-CBC');

        return $app;
    }
}