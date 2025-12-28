<?php

namespace Tests;

use PHPUnit\Framework\TestCase;

class Day9Test extends TestCase
{
    public function test_example_one()
    {
        $this->assertTrue(1 === 1);
    }
    
    public function test_example_two()
    {
        $this->assertEquals(4, 2 * 2);
    }
    
    public function test_example_three()
    {
        $result = 'test' . ' ' . 'string';
        $this->assertSame('test string', $result);
    }
}
