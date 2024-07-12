<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public const FILTERABLE_FIELDS = [];

    protected const SEARCH_OPERATOR_EQUAL = "=";

    protected const SEARCH_OPERATOR_LIKE = "like";

    protected const SEARCH_OPERATOR_GTE = ">=";

    protected const SEARCH_OPERATOR_GT = ">";

    protected const SEARCH_OPERATOR_LTE = "<=";

    protected const SEARCH_OPERATOR_LT = "<";

    protected const SEARCH_OPERATOR_NOT_EQUAL = "!=";

    protected const SEARCH_OPERATOR_BOOLEAN = "BOOL";

    /**
     * Build default query
     *
     * @param Request $request
     * @param Builder $query
     * @param string $alias
     * @return Builder
     */
    protected function searchFrom(Request $request, Builder $query, string $alias): Builder
    {
        foreach (static::FILTERABLE_FIELDS as $filter) {
            $filterValue = $request->input($filter["name"], null);

            if (
                $filterValue
                && self::SEARCH_OPERATOR_LIKE === $filter["operator"]
            ) {
                $filterValue = "%{$filterValue}%";
            }

            if (
                !is_null($filterValue)
                && self::SEARCH_OPERATOR_BOOLEAN === $filter["operator"]
            ) {
                $filterValue = match($filterValue) {
                    false, 0, '0', 'false', '', [], 0.0 => '0',
                    default => '1',
                };
                
                $query->where("{$alias}.{$filter['name']}", self::SEARCH_OPERATOR_EQUAL, $filterValue);
                continue;
            }

            $query->when(
                $filterValue,
                fn () => $query->where("{$alias}.{$filter['name']}", $filter["operator"], $filterValue)
            );      
        }

        $orderBy = $request->get('order_by', 'id');
        $orderByDirection = $request->get('order_by_direction', 'asc');

        $query->orderBy("{$alias}.$orderBy", $orderByDirection);

        return $query;
    }
}
