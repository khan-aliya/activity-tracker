<?php

namespace Tests;

use PHPUnit\Framework\TestCase;

class SimpleTest extends TestCase
{
    public function test_addition()
    {
        $this->assertEquals(2, 1 + 1);
    }
    
    public function test_string()
    {
        $this->assertEquals('hello', 'hello');
    }
    
    public function test_true()
    {
        $this->assertTrue(true);
    }
}
