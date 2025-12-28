<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class GuaranteedTest extends TestCase
{
    public function test_addition()
    {
        $this->assertEquals(4, 2 + 2);
    }
    
    public function test_subtraction() 
    {
        $this->assertEquals(1, 3 - 2);
    }
    
    public function test_multiplication()
    {
        $this->assertEquals(6, 2 * 3);
    }
}
