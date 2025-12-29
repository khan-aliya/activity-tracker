<?php

namespace Tests\Feature;

use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class GuaranteedPassTest extends TestCase
{
    #[Test]
    public function one_plus_one_equals_two()
    {
        $this->assertEquals(2, 1 + 1);
    }
    
    #[Test]
    public function string_length_is_correct()
    {
        $string = 'Hello';
        $this->assertEquals(5, strlen($string));
    }
    
    #[Test]
    public function array_has_three_items()
    {
        $array = ['a', 'b', 'c'];
        $this->assertCount(3, $array);
    }
    
    #[Test]
    public function boolean_values_are_correct()
    {
        $this->assertTrue(true);
        $this->assertFalse(false);
    }
    
    #[Test]
    public function null_checks_work()
    {
        $value = null;
        $this->assertNull($value);
        
        $value = 'not null';
        $this->assertNotNull($value);
    }
}
