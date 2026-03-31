<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface CategoryRepositoryInterface
{
    public function getAll(): Collection;
}