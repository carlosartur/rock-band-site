@php
$fillableByInputFields = array_filter($tablePropertyData, fn($item) => !in_array($item->Field, ["updated_at", "created_at", "deleted_at"]));

$primaryKeyField = array_filter($tablePropertyData, fn($item) => $item->Key == "PRI");
$primaryKeyField = reset($primaryKeyField);

function mysqlToPhpType($mysqlType): string
{
    $typeMap = array(
        'tinyint' => 'int',
        'smallint' => 'int',
        'mediumint' => 'int',
        'int' => 'int',
        'integer' => 'int',
        'bigint' => 'int',
        'float' => 'float',
        'double' => 'float',
        'decimal' => 'float',
        'char' => 'string',
        'varchar' => 'string',
        'text' => 'string',
        'tinytext' => 'string',
        'mediumtext' => 'string',
        'longtext' => 'string',
        'date' => 'string',
        'datetime' => 'string',
        'timestamp' => 'string',
        'time' => 'string',
        'year' => 'int',
        'binary' => 'string',
        'varbinary' => 'string',
        'blob' => 'string',
        'tinyblob' => 'string',
        'mediumblob' => 'string',
        'longblob' => 'string',
        'enum' => 'string',
        'set' => 'string',
    );

    $mysqlType = strtolower($mysqlType);

    foreach ($typeMap as $key => $value) {
        if (str_contains($mysqlType, $key)) {
            return " ?{$value} ";
        }
    }

    return " ";
}

echo "<?php"; 
@endphp

namespace App\Models;

class {{ $tableCamel }} extends AbstractModel
{
    protected $table = '{{ $tableName }}';

{{-- @foreach ($tablePropertyData as $tableProperty)
    /** @var{{ mysqlToPhpType($tableProperty->Type) }}{{ $tableProperty->Field }} */
    public{{ mysqlToPhpType($tableProperty->Type) }}${{ $tableProperty->Field }};

@endforeach --}}
}