@php
$fillableByInputFields = array_filter($tablePropertyData, fn($item) => !in_array($item->Field, ["updated_at", "created_at", "deleted_at"]));

$primaryKeyField = array_filter($tablePropertyData, fn($item) => $item->Key == "PRI");
$primaryKeyField = reset($primaryKeyField);

echo "<?php"; 
@endphp

namespace App\Http\Controllers;

use Throwable;
use App\Models\{{ $tableCamel }};
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;
use App\Services\ErrorDefaultResponseService;

class {{ $tableCamel }}Controller extends Controller implements CrudControllerInterface
{

    use CrudUtilitiesTrait;

    public const FILTERABLE_FIELDS = [
        @foreach ($tablePropertyData as $tableProperty)
        [
            'name' => '{{ $tableProperty->Field }}',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
        @endforeach
    ];

    /**
     * Store a new record on "{{ $tableName }}" table.
     *
     * @param Request $request
     * @param [null|string|int] $primaryKey
     * @return JsonResponse
     */
    public function store(Request $request, null|string|int $primaryKey = null): JsonResponse
    {
        try {
            $validator = $this->validateRequest($request);

            $primaryKey ??= $request->input('{{ $primaryKeyField->Field }}', false);

            ${{ $tableName }} = $primaryKey 
                ? $this->getQueryBuilder()->where("{{ $primaryKeyField->Field }}", $primaryKey)->first()
                : new {{ $tableCamel }}();

            @foreach ($fillableByInputFields as $tableProperty) @if ($tableProperty->Field == $primaryKeyField->Field) @continue @endif
            ${{ $tableName }}->{{ $tableProperty->Field }} = $request->input('{{ $tableProperty->Field }}');
            @endforeach
            
            ${{ $tableName }}->setDates();

            ${{ $tableName }}->save();

            return response()->json(['message' => 'Success!', 'data' => ${{ $tableName }}], $request->isMethod('post') ? 201 : 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    /**
     * Search for {{ $tableName }}
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $alias = {{ $tableCamel }}::getAlias();
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
    @foreach ($tablePropertyData as $tableProperty)
        @if ($validationString = $tableProperty->createValidationString())
            "{{ $tableProperty->Field }}" => "{{ $validationString }}",
        @endif
    @endforeach
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
        $alias = {{ $tableCamel }}::getAlias();

        return {{ $tableCamel }}::from($addAlias ? "{{ $tableName }} as {$alias}" : "{{ $tableName }}");
    }
}