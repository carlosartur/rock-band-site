<?php

namespace App\Http\Controllers;

use App\Models\AbstractModel;
use DateTime;
use Throwable;
use ReflectionClass;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;
use App\Services\ErrorDefaultResponseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

trait CrudUtilitiesTrait
{
    /**
     * Get one item by id
     *
     * @param integer $id
     * @return JsonResponse
     */
    public function getOneById(int $id): JsonResponse
    {
        try {

            $query = $this->getQueryBuilder()
                ->where("id", $id);

            if (property_exists($this, 'with') && $this->with) {
                $query->with($this->with);
            }

            return response()->json($query->first(), 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    /**
     * Delete airline
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function delete(Request $request): JsonResponse
    {
        try {
            $this->getQueryBuilder(false)
                ->where("id", $request->input('id'))
                ->delete();

            return response()->json(['message' => 'Success!'], 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    /**
     * @return JsonResponse
     */
    public function getAll(): JsonResponse
    {
        $query = $this->getQueryBuilder(false);

        if (property_exists($this, 'with') && $this->with) {
            $query->with($this->with);
        }

        $all = $query->get();

        return response()->json([
            'message' => 'Success!', 
            'data' => $all
        ], 200);
    }

    /**
     * Export to csv
     *
     * @param Request $request
     * @return Response
     */
    public function exportToCsv(Request $request): Response
    {
        $query = $this->getQueryBuilderForExport();

        $this->searchFrom($request, $query, static::getTableName());
        
        $csvFileName = static::getCSVExportFileName();
        $storagePath = Storage::disk('public')->path($csvFileName);

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$csvFileName",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0",
        ];

        $first = $query->first();

        if (!$first) {
            return response(
                sprintf("Aviso%sNenhum registro encontrado", PHP_EOL),
                200,
                $headers
            );
        }

        $handle = fopen($storagePath, 'w');

        $csvFirstLine = array_keys($first->handleCsvItem()->toArray());

        fputcsv(
            $handle,
            $csvFirstLine
        );

        $currentPage = 1;

        /** @var LengthAwarePaginator $currentPageLines */
        while (
            $currentPageLines = $query->paginate(perPage:100, page: $currentPage)
        ) {
            $pageItems = $currentPageLines->items();

            if (!count($pageItems)) {
                break;
            }

            /** @var AbstractModel $item */
            foreach ($currentPageLines->items() as $item) {
                $csvRow = array_map(
                    fn ($value) => str_replace(["\r", "\n", "\\r", "\\n"], [""], str_replace('"', '""', $value)),
                    $item->handleCsvItem()->toArray()
                );

                fputcsv(
                    $handle,
                    $csvRow
                );
            }
            $currentPage++;
        }

        return response(
            Storage::disk('public')->get($csvFileName),
            200,
            $headers
        );
    }

    /**
     * Build query from request to export csv
     *
     * @return Builder
     */
    public function getQueryBuilderForExport(): Builder
    {
        /** @var Builder $query */
        $query = $this->getQueryBuilder(false);

        if (!defined('static::EXPORT_INFO')) {
            return $query;
        }

        if (array_key_exists('joins', static::EXPORT_INFO)) {
            foreach(static::EXPORT_INFO['joins'] as $join) {
                $query->join($join['table'], $join['foreign_key'], $join['condition'], $join['table_key']);
            }
        }

        if (array_key_exists('leftJoins', static::EXPORT_INFO)) {
            foreach(static::EXPORT_INFO['leftJoins'] as $join) {
                $query->leftJoin($join['table'], $join['foreign_key'], $join['condition'], $join['table_key']);
            }
        }
        if (array_key_exists('select', static::EXPORT_INFO)) {
            $query->select(static::EXPORT_INFO['select']);
        }

        return $query;
    }

    /**
     * Get export file name
     *
     * @return string
     */
    public static function getCSVExportFileName(): string
    {
        $className = str_replace('controller', '', strtolower((new ReflectionClass(static::class))->getShortName()));
        $date = (new DateTime())->format('y-m-d-h-i-s');
        $rand = dechex(rand());

        return "{$className}-{$date}-{$rand}.csv";
    }

}
