<?php

namespace App\Services;

use App\Models\TablePropertyData;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Str;

class CreateControllerByTableService extends AbstractCreateCodeService
{
    /**
     * @param string $tableName
     * @param TablePropertyData[] $tablePropertyData
     * @return void
     */
    public function create(string $tableName, array $tablePropertyData): void
    {
        $tableCamel = ucfirst(Str::camel($tableName));

        $controllerContent = View::make(
                'create-code-by-tables.controller', 
                compact('tableCamel', 'tableName', 'tablePropertyData')
            )
            ->render();

        $controllerPath = realpath(__DIR__ . "/../Http/Controllers") . "/{$tableCamel}Controller.php";

        file_put_contents($controllerPath, $controllerContent);
    }
}
