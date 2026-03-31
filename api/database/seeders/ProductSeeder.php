<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();

        if ($categories->isEmpty()) {
            return;
        }

        $products = [
            [
                'name' => 'Notebook Dell Inspiron',
                'description' => 'Notebook com 16GB de RAM e SSD de 512GB.',
                'price' => 4299.90,
                'image_url' => 'https://via.placeholder.com/300x300.png?text=Notebook',
                'category_id' => $categories->firstWhere('name', 'Eletrônicos')?->id ?? $categories->first()->id,
            ],
            [
                'name' => 'Camiseta Básica Preta',
                'description' => 'Camiseta de algodão, confortável para uso diário.',
                'price' => 59.90,
                'image_url' => 'https://via.placeholder.com/300x300.png?text=Camiseta',
                'category_id' => $categories->firstWhere('name', 'Roupas')?->id ?? $categories->first()->id,
            ],
            [
                'name' => 'Panela Antiaderente',
                'description' => 'Panela ideal para preparo rápido e fácil limpeza.',
                'price' => 129.90,
                'image_url' => 'https://via.placeholder.com/300x300.png?text=Panela',
                'category_id' => $categories->firstWhere('name', 'Casa')?->id ?? $categories->first()->id,
            ],
            [
                'name' => 'Bola de Futebol',
                'description' => 'Bola oficial para treino e lazer.',
                'price' => 89.90,
                'image_url' => 'https://via.placeholder.com/300x300.png?text=Bola',
                'category_id' => $categories->firstWhere('name', 'Esportes')?->id ?? $categories->first()->id,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}