<?php
namespace App\Http\Controllers;

use Throwable;
use App\Models\Configurations;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;
use App\Services\ErrorDefaultResponseService;

class ConfigurationsController extends Controller implements CrudControllerInterface
{

    use CrudUtilitiesTrait;

    public const FILTERABLE_FIELDS = [
        [
            'name' => 'name',
            'operator' => self::SEARCH_OPERATOR_LIKE,
        ],
        [
            'name' => 'value',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
        [
            'name' => 'type',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
    ];

    /**
     * Store a new record on "configurations" table.
     *
     * @param Request $request
     * @param [null|string|int] $primaryKey
     * @return JsonResponse
     */
    public function store(Request $request, null|string|int $primaryKey = null): JsonResponse
    {
        try {
            $this->validateRequest($request);

            $primaryKey ??= $request->input('id', false);

            $configurations = $this->getQueryBuilder()->where("id", $primaryKey)->first();

            $configurations->value = $request->input('value');
            
            if (!is_scalar($configurations->value)) {
                $values = [];
                
                foreach ($configurations->value as $value) {
                    $values[$value["key"]] = $value["value"];
                }

                $configurations->value = json_encode($values);
            }
            
            unset(
                $configurations->value_translated,
                $configurations->default_value_translated
            );
                        
            $configurations->setDates();

            $configurations->save();

            return response()->json(['message' => 'Success!', 'data' => $configurations], $request->isMethod('post') ? 201 : 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    /**
     * Search for configurations
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $alias = Configurations::getAlias();
        $query = $this->searchFrom($request, $this->getQueryBuilder(), $alias);

        $pagination = $query->paginate()
            ->onEachSide(1)
            ->appends(request()->query());

        return response()->json($pagination, 200);
    }

    /**
     * Validate a put/post request
     *
     * @param Request $request
     * @return array
     */
    public function validateRequest(Request $request): array
    {
        return Validator::make($request->all(), [
            "value" => "required",
            "created_at" => "date",
            "updated_at" => "date",
        ])->validate();
    }

    /**
     * Get query
     *
     * @param boolean $addAlias
     * @return Builder
     */
    public function getQueryBuilder(bool $addAlias = true): Builder
    {
        $alias = Configurations::getAlias();

        return Configurations::from($addAlias ? "configurations as {$alias}" : "configurations");
    }
}