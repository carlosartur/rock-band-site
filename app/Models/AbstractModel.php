<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Model;

abstract class AbstractModel extends Model
{
    public static ?string $searchedText = null;

    /**
     * Get alias to query
     *
     * @return string
     */
    public static function getAlias(): string
    {
        $className = static::class;

        $className = substr($className, strrpos($className, '\\') + 1);
        
        $className = preg_replace('/[^A-Z]/', '', $className);

        $className = strtolower($className);

        return $className;
    }

    public function setDates(): void
    {
        if (!$this->created_at) {
            $this->created_at = new DateTime();
        }

        $this->updated_at = new DateTime();
    }

    /**
     * Set the value of searchedText
     *
     * @return void
     */ 
    public static function setSearchedText(?string $searchedText)
    {
        self::$searchedText = $searchedText;
    }

    /**
     * Get table name
     *
     * @return string
     */
    public static function getTableName(): string
    {
        return (new static())->table;
    }
}
