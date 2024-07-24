<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use stdClass;

class TablePropertyData extends Model
{
    public const NUMERIC_TYPES = [
        'TINYINT',
        'SMALLINT',
        'MEDIUMINT',
        'INT',
        'INTEGER',
        'BIGINT',
        'FLOAT',
        'DOUBLE',
        'DECIMAL',
        'NUMERIC',
        'FIXED',
        'BIT',
        'BOOL',
        'BOOLEAN',
        'SERIAL'
    ];

    public ?string $Field = null;
    
    public ?string $Type = null;
    
    public ?string $Null = null;
    
    public ?string $Key = null;
    
    public ?string $Default = null;
    
    public ?string $Extra = null;

    public function __construct(stdClass $data)
    {
        foreach ($data as $key => $value) {
            $this->{$key} = $value;
        }
    }

    public function createValidationString(): ?string
    {
        $validations = [];

        if ("PRI" == $this->Key) {
            return "";
        }

        if ("NO" == $this->Null) {
            $validations[] = 'required';
        }
        
        if (preg_match('/\d+/', $this->Type, $matches)) {
            $firstMatch = $matches[0]; 
            $validations[] = "max:{$firstMatch}";
        }

        if (str_contains($this->Field, 'email')) {
            $validations[] = "email:rfc,dns";
        }

        if ("timestamp" == $this->Type) {
            $validations[] = "date";
        }

        $numericTypes = array_filter(self::NUMERIC_TYPES, fn ($type) => str_contains($this->Type, $type));

        if (count($numericTypes)) {
            $validations[] = "numeric";
        }

        return implode("|", $validations);
    }
}
