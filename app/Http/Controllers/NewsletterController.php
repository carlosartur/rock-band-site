<?php
namespace App\Http\Controllers;

use Throwable;
use App\Models\Newsletter;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;
use App\Services\ErrorDefaultResponseService;

class NewsletterController extends Controller implements CrudControllerInterface
{

    use CrudUtilitiesTrait;

    public const FILTERABLE_FIELDS = [
        [
            'name' => 'name',
            'operator' => self::SEARCH_OPERATOR_LIKE,
        ],
        [
            'name' => 'email',
            'operator' => self::SEARCH_OPERATOR_LIKE,
        ],
        [
            'name' => 'enabled',
            'operator' => self::SEARCH_OPERATOR_BOOLEAN,
        ],
    ];

    public const EXPORT_INFO = [
        'select' => [
            "newsletter.id as id",
            "newsletter.name as nome",
            "newsletter.enabled as habilitado",
            "newsletter.created_at as criado_em",
            "newsletter.updated_at as atualizado_em"
        ]
    ];

    /**
     * Store a new record on "newsletter" table.
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

            $newsletter = $primaryKey 
                ? $this->getQueryBuilder()->where("id", $primaryKey)->first()
                : new Newsletter();

            $newsletter->name = $request->input('name');
            $newsletter->email = $request->input('email');
            $newsletter->enabled = $request->input('enabled');
            $newsletter->disable_token = $newsletter->disable_token ?? Str::random(40);
                        
            $newsletter->setDates();

            $newsletter->save();

            return response()->json(['message' => 'Success!', 'data' => $newsletter], $request->isMethod('post') ? 201 : 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    /**
     * Search for newsletter
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $alias = Newsletter::getAlias();
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
            "name" => "required|max:255",
            "email" => "required|max:255|email:rfc,dns",
            "enabled" => "max:1",
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
        $alias = Newsletter::getAlias();

        return Newsletter::from($addAlias ? "newsletter as {$alias}" : "newsletter");
    }

    public static function getTableName(): string
    {
        return Newsletter::getTableName();
    }
}