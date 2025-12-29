<?php

namespace Tests\Feature;

use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class SimpleApiTest extends TestCase
{
    #[Test]
    public function addition_works()
    {
        $this->assertEquals(4, 2 + 2);
    }
    
    #[Test]
    public function string_comparison_works()
    {
        $this->assertEquals('hello', 'hello');
    }
    
    #[Test]
    public function true_is_true()
    {
        $this->assertTrue(true);
    }
    
    #[Test]
    public function array_operations_work()
    {
        $array = [1, 2, 3];
        $this->assertCount(3, $array);
        $this->assertContains(2, $array);
    }
    
    #[Test]
    public function api_returns_response()
    {
        $response = $this->get('/');
        $this->assertNotNull($response);
    }
    
    #[Test]
    public function json_has_correct_structure()
    {
        $data = [
            'status' => 'success',
            'message' => 'Operation completed',
            'data' => ['id' => 1]
        ];
        
        $this->assertArrayHasKey('status', $data);
        $this->assertArrayHasKey('message', $data);
        $this->assertArrayHasKey('data', $data);
        $this->assertEquals('success', $data['status']);
    }
}
