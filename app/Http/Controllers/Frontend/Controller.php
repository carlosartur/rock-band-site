<?php

namespace App\Http\Controllers\Frontend;

use App\Models\AbstractModel;
use Illuminate\Routing\Controller as BaseController;
use App\Services\ErrorDefaultResponseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

abstract class Controller extends BaseController
{
    public $with = [];

    /**
     * Get model to query
     * @return \App\Models\AbstractModel
     */
    protected abstract function getModel(): AbstractModel;

    /**
     * Get all registers
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAll(Request $request): JsonResponse
    {
        try {
            $model = $this->getModel();
            $builder = $model->from($model->getTable());

            if ($this->with) {
                $builder->with($this->with);
            }

            $all = $builder->get();

            return response()->json(['message' => 'Success!', 'data' => $all], $request->isMethod('post') ? 201 : 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }
}
