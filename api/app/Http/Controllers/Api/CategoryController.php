<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryCollection;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {
    }

    public function index(): CategoryCollection
    {
        $categories = $this->categoryService->listCategories();

        return new CategoryCollection($categories);
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->createCategory($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Categoria criada com sucesso.',
            'data' => new CategoryResource($category),
        ], 201);
    }

    public function update(UpdateCategoryRequest $request, int $id): JsonResponse
    {
        $category = $this->categoryService->getCategoryById($id);

        if (! $category) {
            return response()->json([
                'success' => false,
                'message' => 'Categoria não encontrada.',
            ], 404);
        }

        $category = $this->categoryService->updateCategory($category, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Categoria atualizada com sucesso.',
            'data' => new CategoryResource($category),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $category = $this->categoryService->getCategoryById($id);

        if (! $category) {
            return response()->json([
                'success' => false,
                'message' => 'Categoria não encontrada.',
            ], 404);
        }

        $this->categoryService->deleteCategory($category);

        return response()->json([
            'success' => true,
            'message' => 'Categoria removida com sucesso.',
        ]);
    }
}