<?php
namespace App\Http\Controllers;

use Throwable;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;
use App\Services\ErrorDefaultResponseService;
use App\Services\SendNewsletters;

class NewsController extends Controller implements CrudControllerInterface
{

    use CrudUtilitiesTrait;

    public const FILTERABLE_FIELDS = [
        [
            'name' => 'subject',
            'operator' => self::SEARCH_OPERATOR_LIKE,
        ],
        [
            'name' => 'content',
            'operator' => self::SEARCH_OPERATOR_LIKE,
        ],
    ];

    /**
     * Store a new record on "news" table.
     *
     * @param Request $request
     * @param [null|string|int] $primaryKey
     * @return JsonResponse
     */
    public function store(Request $request, null|string|int $primaryKey = null): JsonResponse
    {
        try {
            $validator = $this->validateRequest($request);

            $primaryKey ??= $request->input('id', false);

            $news = $primaryKey 
                ? $this->getQueryBuilder()->where("id", $primaryKey)->first()
                : new News();

            $news->subject = $request->input('subject');
            $news->content = $request->input('content');
            $news->content_raw = strip_tags($request->input('content'));
                        
            $news->setDates();

            $news->save();

            if (!$primaryKey) {
                (new SendNewsletters($news))->send();
            }

            return response()->json(['message' => 'Success!', 'data' => $news], $request->isMethod('post') ? 201 : 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    /**
     * Search for news
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $alias = News::getAlias();
        News::setSearchedText($request->get('content'));
        
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
            "subject" => "required|max:255",
            "content" => "required",
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
        $alias = News::getAlias();

        return News::from($addAlias ? "news as {$alias}" : "news");
    }

    public static function getTableName(): string
    {
        return News::getTableName();
    }
}