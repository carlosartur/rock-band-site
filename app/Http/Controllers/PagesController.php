<?php
namespace App\Http\Controllers;

use Throwable;
use App\Models\Pages;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;
use App\Services\ErrorDefaultResponseService;
use Illuminate\Support\Facades\Storage;

class PagesController extends Controller implements CrudControllerInterface
{

    use CrudUtilitiesTrait;

    public $with = ['banner',];

    public const FILTERABLE_FIELDS = [
        [
            'name' => 'slug',
            'operator' => self::SEARCH_OPERATOR_LIKE,
        ],
        [
            'name' => 'title',
            'operator' => self::SEARCH_OPERATOR_LIKE,
        ],
        [
            'name' => 'text',
            'operator' => self::SEARCH_OPERATOR_LIKE,
        ],
        [
            'name' => 'home',
            'operator' => self::SEARCH_OPERATOR_BOOLEAN,
        ],
    ];

    public const EXPORT_INFO = [
        'select' => [
            "pages.id",
            "pages.slug as url",
            "pages.title as titulo",
            "pages.text as html",
            "pages.home as aparece_na_home",
            "pages.order as ordenacao",
            "pages.created_at as criado_em",
            "pages.updated_at as criado_em",
        ]
    ];

    /**
     * Store a new record on "pages" table.
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

            $pages = $primaryKey 
                ? $this->getQueryBuilder()->where("id", $primaryKey)->first()
                : new Pages();

            $pages->slug = $this->generateSlug($request->input('slug') ?? "", $primaryKey);
            $pages->title = $request->input('title');
            $pages->text = $request->input('text');
            $pages->home = $request->input('home');
            $pages->order = $request->input('order');
            $pages->gallery_id = $request->input('gallery_id');
            unset($pages->text_raw);
                    
            $pages->setDates();

            $pages->save();

            return response()->json(['message' => 'Success!', 'data' => $pages], $request->isMethod('post') ? 201 : 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    /**
     * Generate a slug for page, avoiding duplicates
     *
     * @param string $currentSlug
     * @param null|string|integer|null $primaryKey
     * @return string
     */
    public function generateSlug(string $currentSlug, null|string|int $primaryKey = null): string
    {
        $count = 1;
        $newSlug = $currentSlug;
        do {
            if (!$currentSlug) {
                $newSlug = $currentSlug = "page";
            }

            $pageFound = Pages::where("slug", $newSlug)->first();

            if (!$pageFound) {
                return $newSlug;
            }

            if ($pageFound->id == $primaryKey) {
                return $newSlug;
            }

            $newSlug = "{$currentSlug}-{$count}";
            $count++;
        } while(true);
    }

    /**
     * Search for pages
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $alias = Pages::getAlias();
        Pages::setSearchedText($request->get('text'));
        $query = $this->searchFrom($request, $this->getQueryBuilder(), $alias)
            ->with('banner');

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
            "slug" => "required|max:255",
            "title" => "required|max:512",
            "text" => "required",
            "order" => "required|max:11",
            "gallery_id" => "max:20",
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
        $alias = Pages::getAlias();

        return Pages::from($addAlias ? "pages as {$alias}" : "pages");
    }

        /**
     * Get one item by id
     *
     * @param integer $id
     * @return JsonResponse
     */
    public function getOneById(int $id): JsonResponse
    {
        try {

            $query = $this->getQueryBuilder()
                ->where("id", $id);

            if (property_exists($this, 'with') && $this->with) {
                $query->with($this->with);
            }

            $page = $query->first();

            if ($page->banner) {
                $page->banner->path = Storage::url($page->banner->path);
            }

            return response()->json($page, 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }
    
    public static function getTableName(): string
    {
        return Pages::getTableName();
    }
}