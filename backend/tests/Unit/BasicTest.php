<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class BasicTest extends TestCase
{
    public function test_basic_math(): void
    {
        $this->assertEquals(2, 1 + 1);
    }
    
    public function test_string_operations(): void
    {
        $string = "Hello World";
        $this->assertEquals('Hello World', $string);
        $this->assertStringContainsString('Hello', $string);
    }
}