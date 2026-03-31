<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Fernando Teste',
            'email' => 'fernando_teste@example.com',
            'password' => '12345678',
            'password_confirmation' => '12345678',
        ]);

        $response
            ->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user' => [
                        'id',
                        'name',
                        'email',
                    ],
                    'token',
                ],
            ]);
    }

    public function test_user_can_login(): void
    {
        $this->postJson('/api/register', [
            'name' => 'Fernando Teste',
            'email' => 'fernando_teste@example.com',
            'password' => '12345678',
            'password_confirmation' => '12345678',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'fernando_teste@example.com',
            'password' => '12345678',
        ]);

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user' => [
                        'id',
                        'name',
                        'email',
                    ],
                    'token',
                ],
            ]);
    }
}