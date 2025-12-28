<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class SimpleBackendTest extends TestCase
{
    public function test_basic_math()
    {
        $this->assertEquals(2, 1 + 1);
    }
    
    public function test_string_concatenation()
    {
        $result = 'Hello' . ' ' . 'World';
        $this->assertEquals('Hello World', $result);
    }
    
    public function test_array_operations()
    {
        $array = [1, 2, 3];
        $array[] = 4;
        $this->assertCount(4, $array);
        $this->assertEquals(4, $array[3]);
    }
}
