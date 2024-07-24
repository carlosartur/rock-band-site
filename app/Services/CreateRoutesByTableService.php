<?php

namespace App\Services;

use App\Models\TablePropertyData;
use Illuminate\Support\Str;

class CreateRoutesByTableService extends AbstractCreateCodeService
{
    /**
     * @param string $tableName
     * @param TablePropertyData[] $tablePropertyData
     * @return void
     */
    public function create(string $tableName, array $tablePropertyData): void
    {
        $tableCamel = ucfirst(Str::camel($tableName));

        echo "\nRoute::controller({$tableCamel}Controller::class)->prefix('$tableName')->group(function () {
            Route::get('/', 'search');
            Route::get('/{id}', 'getOneById');
            Route::put('/{id?}', 'store');
            Route::post('/', 'store');
            Route::delete('/', 'delete');
        });\n";
    }
}
