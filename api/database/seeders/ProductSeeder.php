<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();

        if ($categories->isEmpty()) {
            return;
        }

        $productNames = [
            'Notebook Gamer', 'Smartphone Android', 'iPhone', 'Monitor 24"', 'Teclado Mecânico',
            'Mouse Gamer', 'Cadeira Ergonômica', 'Fone Bluetooth', 'Smart TV 50"', 'Tablet',
            'Camiseta Básica', 'Calça Jeans', 'Jaqueta', 'Tênis Esportivo', 'Boné',
            'Panela Antiaderente', 'Liquidificador', 'Cafeteira', 'Air Fryer', 'Microondas',
            'Bola de Futebol', 'Bicicleta', 'Luva de Boxe', 'Raquete de Tênis', 'Halter',
            'Relógio Digital', 'Óculos de Sol', 'Mochila', 'Carteira', 'Perfume',
            'Drone', 'Câmera DSLR', 'Tripé', 'Ring Light', 'Webcam',
            'Console Gamer', 'Controle Wireless', 'Headset', 'Placa de Vídeo', 'SSD 1TB',
            'HD Externo', 'Carregador', 'Cabo USB', 'Power Bank', 'Echo Dot',
            'Google Nest', 'Ventilador', 'Aspirador', 'Ar Condicionado', 'Luminária'
        ];

        foreach (range(1, 80) as $i) {
            $name = $productNames[array_rand($productNames)];

            Product::create([
                'name' => $name . ' ' . Str::random(5),
                'description' => 'Produto de alta qualidade: ' . $name . ', ideal para uso no dia a dia.',
                'price' => rand(50, 5000) + (rand(0, 99) / 100),
                'image_url' => 'https://placehold.co/600x600?text=' . urlencode($name),
                'category_id' => $categories->random()->id,
            ]);
        }
    }
}