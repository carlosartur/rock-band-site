<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\Builder;

interface CrudControllerInterface
{
    public function store(Request $request, null|string|int $primaryKey = null): JsonResponse;

    public function search(Request $request): JsonResponse;

    public function delete(Request $request): JsonResponse;

    public function getOneById(int $id): JsonResponse;

    public function exportToCsv(Request $request): ?Response;

    public function validateRequest(Request $request): array;

    public function getQueryBuilder(bool $addAlias = true): Builder;

    public function getQueryBuilderForExport(): Builder;
    
}
