<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;

Route::get('/ping', function () {
    return response()->json([
        'success' => true,
        'message' => 'API ok',
    ]);
});

Route::get('/categories', [CategoryController::class, 'index']);