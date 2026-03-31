<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_products(): void
    {
        $category = Category::factory()->create();

        Product::factory()->create([
            'name' => 'Produto Teste',
            'category_id' => $category->id,
        ]);

        $response = $this->getJson('/api/products');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data',
                'meta',
            ]);
    }

    public function test_requires_auth_to_create_product(): void
    {
        $response = $this->postJson('/api/products', []);

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_create_product(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/products', [
            'name' => 'Produto Teste',
            'description' => 'Teste',
            'price' => 99.90,
            'category_id' => $category->id,
        ]);

        $response
            ->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);
    }
}