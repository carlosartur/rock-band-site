<?php
namespace App\Http\Controllers;

use Throwable;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;
use App\Services\ErrorDefaultResponseService;
use Closure;

class UsersController extends Controller implements CrudControllerInterface
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
    ];

    /**
     * Store a new record on "users" table.
     *
     * @param Request $request
     * @param null|string|int $primaryKey
     * @return JsonResponse
     */
    public function store(Request $request, null|string|int $primaryKey = null): JsonResponse
    {
        try {
            $this->validateRequest($request);

            $primaryKey ??= $request->input('id', false);

            /** @var User */
            $users = $primaryKey 
                ? $this->getQueryBuilder()->where("id", $primaryKey)->first()
                : new User();

            $users->name = $request->input('name');
            $users->email = $request->input('email');

            if ($request->input('password')) {
                $users->password = Hash::make($request->input('password'));
            }

            $users->setDates();
            
            $users->save();

            return response()->json(['message' => 'Success!', 'data' => $users], $request->isMethod('post') ? 201 : 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    /**
     * Search for users
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $alias = User::getAlias();
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
            'email' => [
                'required',
                'max:255',
                'email:rfc,dns',
                function (string $attribute, mixed $value, Closure $fail) use ($request) {
                    $currentUser = User::where('email', $value)->first();
                    $userIdGiven = $request->input('id', false);

                    if (
                        (!$userIdGiven)
                        || (!$currentUser)
                        || $currentUser->id == $userIdGiven
                    ) {
                        return true;
                    }

                    $fail($attribute, __("validation.unique", compact('attribute')));
                }
            ],
            "password" => ($request->input('id', false) ? "" : "required|") . "min:8|max:255|confirmed|strong_password",
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
        $alias = User::getAlias();

        return User::from($addAlias ? "users as {$alias}" : "users");
    }

    public static function getTableName(): string
    {
        return User::getTableName();
    }
}