<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Eletrônicos'],
            ['name' => 'Roupas'],
            ['name' => 'Casa'],
            ['name' => 'Esportes'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}