<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Events;
use App\Models\GalleryEvents;
use App\Services\ErrorDefaultResponseService;
use Throwable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;

class EventsController extends Controller implements CrudControllerInterface
{

    use CrudUtilitiesTrait;

    public $with = ['city', 'city.state', 'city.state.cities', 'banner'];

    public const FILTERABLE_FIELDS = [
        [
            'name' => 'name',
            'operator' => self::SEARCH_OPERATOR_LIKE,
        ],
        [
            'name' => 'organizer',
            'operator' => self::SEARCH_OPERATOR_LIKE,
        ],
        [
            'name' => 'enabled',
            'operator' => self::SEARCH_OPERATOR_BOOLEAN,
        ],
        [
            'name' => 'city',
            'operator' => self::SEARCH_OPERATOR_LIKE,
        ],
    ];

    public const EXPORT_INFO = [
        'joins' => [
            [
                'table' => 'cities', 
                'foreign_key' => 'events.city_id', 
                'condition' => '=', 
                'table_key' => 'cities.id'
            ],
            [
                'table' => 'states', 
                'foreign_key' => 'cities.state_id', 
                'condition' => '=', 
                'table_key' => 'states.id'
            ]
        ],
        'select' => [
            "events.id as id",
            "events.name as nome",
            "events.organizer as organizador",
            "events.date_start as data_inicio",
            "events.date_end as data_fim",
            "events.enabled as habilitado",
            "cities.name as cidade",
            "states.name as estado",
            "events.created_at as criado_em",
            "events.updated_at as atualizado_em",
        ]
    ];

    /**
     * Store a new record on "events" table.
     *
     * @param Request $request
     * @param [type] $primaryKey
     * @return JsonResponse
     */
    public function store(Request $request, null|string|int $primaryKey = null): JsonResponse
    {
        try {
            $this->validateRequest($request);

            $primaryKey ??= $request->input('id', false);

            $events = $primaryKey 
                ? $this->getQueryBuilder()->where("id", $primaryKey)->first()
                : new Events();

            $events->name = $request->input('name');
            $events->organizer = $request->input('organizer');
            $events->description = $request->input('description');
            $events->date_start = $request->input('date_start');
            $events->enabled = $request->input('enabled');
            $events->city_id = $request->input('city_id');
            $events->gallery_id = $request->input('gallery_id');

            $events->setDates();
            
            $events->save();

            return response()->json(['message' => 'Success!', 'data' => $events], $request->isMethod('post') ? 201 : 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    /**
     * Search for events
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $alias = Events::getAlias();
        $query = $this->searchFrom($request, $this->getQueryBuilder(), $alias)
            ->with(['city', 'city.state'])
            ->select("{$alias}.*");

        $city_name = $request->get('city_name');

        $query->when(
                $request->get('date_start_from'), 
                fn() => $query->where('date_start', self::SEARCH_OPERATOR_GTE, $request->get('date_start_from'))
            )
            ->when(
                $request->get('date_start_to'), 
                fn() => $query->where('date_start', self::SEARCH_OPERATOR_LTE, $request->get('date_start_to'))
            )
            ->when(
                $request->get('date_end_from'), 
                fn() => $query->where('date_end', self::SEARCH_OPERATOR_GTE, $request->get('date_end_from'))
            )
            ->when(
                $request->get('date_end_to'), 
                fn() => $query->where('date_end', self::SEARCH_OPERATOR_LTE, $request->get('date_end_to'))
            )
            ->when(
                $city_name,
                fn () => $query->join('cities as c', 'c.id', "=", "e.city_id")
                    ->where("c.name", "LIKE", "%{$city_name}%")
            );

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
            "organizer" => "required|max:255",
            "date_start" => "required",
            "enabled" => "required|max:1",
            "city_id" => "required|max:20",
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
        $alias = Events::getAlias();

        return Events::from($addAlias ? "events as {$alias}" : "events");
    }

    public static function getTableName(): string
    {
        return Events::getTableName();
    }
}