<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductService
{
    public function __construct(
        protected ProductRepositoryInterface $productRepository
    ) {
    }

    public function listProducts(array $filters): LengthAwarePaginator
    {
        return $this->productRepository->paginateWithFilters($filters);
    }

    public function getProductById(int $id): ?Product
    {
        return $this->productRepository->findById($id);
    }
}