<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_categories(): void
    {
        Category::factory()->create(['name' => 'Eletrônicos']);
        Category::factory()->create(['name' => 'Roupas']);

        $response = $this->getJson('/api/categories');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data',
            ]);
    }

    public function test_requires_auth_to_create_category(): void
    {
        $response = $this->postJson('/api/categories', [
            'name' => 'Categoria Teste',
        ]);

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_create_category(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/categories', [
            'name' => 'Categoria Teste',
        ]);

        $response
            ->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Categoria criada com sucesso.',
            ]);

        $this->assertDatabaseHas('categories', [
            'name' => 'Categoria Teste',
        ]);
    }

    public function test_authenticated_user_can_update_category(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create([
            'name' => 'Categoria Antiga',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson("/api/categories/{$category->id}", [
            'name' => 'Categoria Nova',
        ]);

        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Categoria atualizada com sucesso.',
            ]);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Categoria Nova',
        ]);
    }

    public function test_authenticated_user_can_delete_category(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/categories/{$category->id}");

        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Categoria removida com sucesso.',
            ]);

        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
        ]);
    }
}