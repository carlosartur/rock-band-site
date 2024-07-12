<?php
namespace App\Http\Controllers;

use Throwable;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rules\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;
use App\Services\ErrorDefaultResponseService;

class GalleryController extends Controller implements CrudControllerInterface
{

    use CrudUtilitiesTrait { delete as private deleteFromDatabase; }

    public const FILTERABLE_FIELDS = [
        [
            'name' => 'name',
            'operator' => self::SEARCH_OPERATOR_LIKE,
        ],
        [
            'name' => 'path',
            'operator' => self::SEARCH_OPERATOR_LIKE,
        ],
        [
            'name' => 'proportion',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
        [
            'name' => 'height',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
        [
            'name' => 'width',
            'operator' => self::SEARCH_OPERATOR_EQUAL,
        ],
    ];

    /**
     * Store a new record on "gallery" table.
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

            /** @var UploadedFile $file  */
            foreach($request->file('file') as $file) {
                $path = $file->hashName();

                $file->storeAs('public', $path);

                $gallery = new Gallery();

                $gallery->name = $file->getClientOriginalName();
                $gallery->path = $path;

                $gallery->buildProportion();
                            
                $gallery->setDates();

                $gallery->save();
            }

            return response()->json(['message' => 'Success!', 'data' => $gallery], $request->isMethod('post') ? 201 : 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    /**
     * Search for gallery
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $alias = Gallery::getAlias();
        $query = $this->searchFrom($request, $this->getQueryBuilder(), $alias);

        $pagination = $query->paginate()
            ->onEachSide(1)
            ->appends(request()->query());

        $pagination->transform(function ($item) {
            $item->path = Storage::url($item->path);
            return $item;
        });

        return response()->json($pagination, 200);
    }

    /**
     * Get all proportions from gallery table.
     *
     * @return JsonResponse
     */
    public function getAllProportions(): JsonResponse
    {
        $uniqueValues = Gallery::select('proportion')
            ->groupBy('proportion')
            ->get()
            ->pluck('proportion');

        $values = array_values(array_filter($uniqueValues->toArray(), fn($item) => !!$item));

        usort($values, function($a, $b) {
            $partsA = explode(':', $a);
            $partsB = explode(':', $b);

            $comparation = $partsA[0] - $partsB[0];

            if ($comparation == 0) {
                $comparation = $partsA[1] - $partsB[1];
            }
        
            return $comparation;
        });

        return response()->json(
            $values,
            200
        );
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
            'file.*' => [
                'required',
                File::image()
                    ->min('1kb')
                    ->max('5mb')
            ]
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
        $alias = Gallery::getAlias();

        return Gallery::from($addAlias ? "gallery as {$alias}" : "gallery");
    }

    /**
     * Delete airline
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function delete(Request $request): JsonResponse
    {
        try {
            $fileData = $this->getQueryBuilder(false)
                ->where("id", $request->input('id'))
                ->first();

            Storage::delete(Storage::url($fileData->path));

            return $this->deleteFromDatabase($request);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    public static function getTableName(): string
    {
        return Gallery::getTableName();
    }
}