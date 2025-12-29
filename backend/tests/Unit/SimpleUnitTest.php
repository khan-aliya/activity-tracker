<?php

namespace Tests\Unit;

use Tests\TestCase;

class SimpleUnitTest extends TestCase
{
    /** @test */
    public function test_basic_math()
    {
        $this->assertEquals(4, 2 + 2);
        $this->assertEquals(6, 3 * 2);
        $this->assertEquals(3, 9 / 3);
    }
    
    /** @test */
    public function test_string_operations()
    {
        $name = "John";
        $this->assertEquals("John", $name);
        $this->assertEquals(4, strlen($name));
    }
    
    /** @test */
    public function test_array_operations()
    {
        $array = [1, 2, 3];
        $this->assertCount(3, $array);
        $this->assertContains(2, $array);
        $this->assertEquals(6, array_sum($array));
    }
}