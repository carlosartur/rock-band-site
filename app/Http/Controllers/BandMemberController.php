<?php
namespace App\Http\Controllers;

use Throwable;
use App\Models\BandMember;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;
use App\Services\ErrorDefaultResponseService;

class BandMemberController extends Controller implements CrudControllerInterface
{

    use CrudUtilitiesTrait;

    public $with = ['photo'];

    public const FILTERABLE_FIELDS = [
        [
            'name' => 'id',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
        [
            'name' => 'name',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
        [
            'name' => 'position',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],        
        [
            'name' => 'order',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
        [
            'name' => 'description',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
        [
            'name' => 'gallery_id',
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
    ];

    /**
     * Store a new record on "band_member" table.
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

            $band_member = $primaryKey 
                ? $this->getQueryBuilder()->where("id", $primaryKey)->first()
                : new BandMember();

            $band_member->name = $request->input('name');
            $band_member->position = $request->input('position');
            $band_member->description = $request->input('description');
            $band_member->gallery_id = $request->input('gallery_id');
            $band_member->order = $request->input('order');
                        
            $band_member->setDates();

            $band_member->save();

            return response()->json(['message' => 'Success!', 'data' => $band_member], $request->isMethod('post') ? 201 : 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    /**
     * Search for band_member
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $alias = BandMember::getAlias();
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
            "position" => "required|max:255",
            "description" => "required",
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
        $alias = BandMember::getAlias();

        return BandMember::from($addAlias ? "band_member as {$alias}" : "band_member");
    }
}