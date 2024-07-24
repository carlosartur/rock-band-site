<?php

namespace App\Services;

use App\Models\TablePropertyData;

abstract class AbstractCreateCodeService
{
    /**
     * @param string $tableName
     * @param TablePropertyData[] $tablePropertyData
     * @return void
     */
    abstract public function create(string $tableName, array $tablePropertyData): void;
}
