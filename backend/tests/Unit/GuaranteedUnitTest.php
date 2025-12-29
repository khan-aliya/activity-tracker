<?php

namespace Tests\Unit;

use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class GuaranteedUnitTest extends TestCase
{
    #[Test]
    public function multiplication_works()
    {
        $this->assertEquals(20, 4 * 5);
    }
    
    #[Test]
    public function division_works()
    {
        $this->assertEquals(3, 9 / 3);
    }
    
    #[Test]
    public function string_concatenation_works()
    {
        $result = 'Hello' . ' ' . 'World';
        $this->assertEquals('Hello World', $result);
    }
    
    #[Test]
    public function array_sum_works()
    {
        $numbers = [1, 2, 3, 4, 5];
        $this->assertEquals(15, array_sum($numbers));
    }
    
    #[Test]
    public function object_properties_are_accessible()
    {
        $obj = (object) ['name' => 'John', 'age' => 30];
        $this->assertEquals('John', $obj->name);
        $this->assertEquals(30, $obj->age);
    }
}
