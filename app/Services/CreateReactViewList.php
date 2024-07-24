<?php

namespace App\Services;

use App\Models\TablePropertyData;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Str;
use Throwable;

class CreateReactViewList extends AbstractCreateCodeService
{
    /**
     * @param string $tableName
     * @param TablePropertyData[] $tablePropertyData
     * @return void
     */
    public function create(string $tableName, array $tablePropertyData): void
    {
        try {
            $tableCamel = ucfirst(Str::camel($tableName));
        
            $viewListContent = View::make(
                    'create-code-by-tables.react-view-list', 
                    compact('tableCamel', 'tableName', 'tablePropertyData')
                )
                ->render();

            $path = realpath(__DIR__ . "/../../frontend/src/admin/views") . "/{$tableName}";

            if (!is_dir($path)) {
                mkdir($path, 0777, true);
            }

            $viewPath = $path . "/{$tableCamel}.js";

            file_put_contents($viewPath, $viewListContent);
        } catch(Throwable $t) {
            dd($t);
        }
    }
}
