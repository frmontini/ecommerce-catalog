<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {
    }

    public function index(Request $request): ProductCollection
    {
        $products = $this->productService->listProducts([
            'search' => $request->query('search'),
            'category' => $request->query('category'),
            'per_page' => $request->query('per_page', 10),
        ]);

        return new ProductCollection($products);
    }

    public function show(int $id): JsonResponse|ProductResource
    {
        $product = $this->productService->getProductById($id);

        if (! $product) {
            return response()->json([
                'success' => false,
                'message' => 'Produto não encontrado.',
            ], 404);
        }

        return new ProductResource($product);
    }
}