<?php

namespace App\Repositories\Contracts;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface
{
    public function paginateWithFilters(array $filters): LengthAwarePaginator;

    public function findById(int $id): ?Product;
}