<?php
namespace App\Http\Controllers;

use App\Enums\ContactInfoTypes;
use Throwable;
use App\Models\ContactInfo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;
use App\Services\ErrorDefaultResponseService;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Support\Fluent;

class ContactInfoController extends Controller implements CrudControllerInterface
{

    use CrudUtilitiesTrait;

    public const FILTERABLE_FIELDS = [
        [
            'name' => 'value',
            'operator' => self::SEARCH_OPERATOR_LIKE,
        ],
        [
            'name' => 'type',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
    ];

    public const EXPORT_INFO = [
        'select' => [
            "contact_info.id as id",
            "contact_info.value as valor",
            "contact_info.type as tipo",
            "contact_info.created_at as criado_em",
            "contact_info.updated_at as atualizado_em",
        ]
    ];

    /**
     * Store a new record on "contact_info" table.
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

            $contact_info = $primaryKey 
                ? $this->getQueryBuilder()->where("id", $primaryKey)->first()
                : new ContactInfo();

            $contact_info->value = $request->input('value');
            $contact_info->type = $request->input('type');
                        
            $contact_info->setDates();

            $contact_info->save();

            return response()->json(['message' => 'Success!', 'data' => $contact_info], $request->isMethod('post') ? 201 : 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    /**
     * Search for contact_info
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $alias = ContactInfo::getAlias();
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
        $validator = Validator::make($request->all(), [
            "type" => [new Enum(ContactInfoTypes::class)],
            "value" => [
                "required",
                "max:255",
            ],
        ]);
        
        $validator->sometimes('value', 'regex:/^\(\d{2}\) \d{5}-\d{4}$/', function (Fluent $input) {
            return $input->type === 'phone';
        });
        
        $validator->sometimes('value', 'email', function (Fluent $input) {
            return $input->type === 'email';
        });

        return $validator->validate();
    }

    /**
     * Get query
     *
     * @param boolean $addAlias
     * @return Builder
     */
    public function getQueryBuilder(bool $addAlias = true): Builder
    {
        $alias = ContactInfo::getAlias();

        return ContactInfo::from($addAlias ? "contact_info as {$alias}" : "contact_info");
    }

    public static function getTableName(): string
    {
        return ContactInfo::getTableName();
    }
}