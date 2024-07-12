<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cities;
use App\Models\States;
use App\Services\ErrorDefaultResponseService;
use Exception;
use Throwable;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Builder;


class CitiesController extends Controller implements CrudControllerInterface
{

    use CrudUtilitiesTrait;

    public const FILTERABLE_FIELDS = [
        [
            'name' => 'id',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
        [
            'name' => 'name',
            'operator' => self::SEARCH_OPERATOR_LIKE,
        ],
        [
            'name' => 'code',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
        [
            'name' => 'state_id',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
        [
            'name' => 'created_at',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
        [
            'name' => 'updated_at',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
        [
            'name' => 'postcode_start',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
        [
            'name' => 'postcode_end',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
    ];

    public const EXPORT_INFO = [
        'joins' => [
            [
                'table' => 'states', 
                'foreign_key' => 'cities.state_id', 
                'condition' => '=', 
                'table_key' => 'states.id'
            ]
        ],
        'leftJoins' => [],
        'select' => [
            "cities.id as id",
            "cities.name as nome",
            "cities.code as codigo_ibge",
            "cities.created_at as criado_em",
            "cities.updated_at as atualizado_em",
            "cities.postcode_start as cep_inicial",
            "cities.postcode_end as cep_final",
            "states.name as estado",
            "states.acronym as sigla_estado",
        ]
    ];

    /**
     * Store a new record on "cities" table.
     */
    public function store(Request $request, null|string|int $primaryKey = null): JsonResponse
    {
        return response()->json(['message' => 'Cidades só podem ser adicionadas ou editadas diretamente no banco de dados!'], 400);
    }

    /**
     * Search cities
     *
     * @param Request $request
     * @return void
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $alias = Cities::getAlias();
            $query = $this->searchFrom($request, Cities::from("cities as {$alias}"), $alias);

            $query->when(
                    $request->input('postcode', false),
                    fn () => $query
                        ->where('postcode_start', '<=', $request->input('postcode'))
                        ->where('postcode_end', '>=', $request->input('postcode'))
                )
                ->with('state');

            $pagination = $query
                ->paginate()
                ->onEachSide(1)
                ->appends(request()->query());

            return response()->json($pagination, 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    /**
     * Get all cities by state
     *
     * @param Request $request
     * @param string|null $acronym
     * @return void
     */
    public function getAllCitiesByState(Request $request, ?string $acronym): JsonResponse
    {
        try {

            $state = States::where("acronym", $acronym)
                ->with("cities")
                ->first();

            if (!$state) {
                throw new Exception("Estado [{$acronym}] não encontrado.");
            }

            $result = $state
                ->cities
                ->toArray();

            usort($result, fn($a, $b) => strcmp($a['name'], $b['name']));

            return response()->json($result, 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    /**
     * Delete a city
     *
     * @param Request $request
     * @return void
     */
    public function delete(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Cidades só podem ser removidas diretamente no banco de dados!'], 400);
    }

    /**
     * Validate city request. Nowadays, useless.
     *
     * @param Request $request
     * @return array
     */
    public function validateRequest(Request $request): array
    {
        return [];
    }

    /**
     * Get query builder
     *
     * @param boolean $addAlias
     * @return Builder
     */
    public function getQueryBuilder(bool $addAlias = true): Builder
    {
        $alias = Cities::getAlias();
        
        return Cities::from($addAlias ? "cities as {$alias}" : "cities");
    }

    public static function getTableName(): string
    {
        return Cities::getTableName();
    }
}