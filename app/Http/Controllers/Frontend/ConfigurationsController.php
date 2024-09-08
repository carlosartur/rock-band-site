<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\AbstractModel;
use App\Models\Configurations;
use App\Services\ErrorDefaultResponseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ConfigurationsController extends Controller
{

    /**
     * @inheritDoc
     */
    protected function getModel(): AbstractModel
    {
        return new Configurations();
    }

    /**
     * Get all configurations
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAll(Request $request): JsonResponse
    {
        try {
            $configurations = Configurations::where('hide_to_frontend', '=', 0)->get();

            $configResponse = [];

            foreach ($configurations as $config) {
                $configResponse[$config->slug] = $config;
            }

            return response()->json(['message' => 'Success!', 'data' => $configResponse], $request->isMethod('post') ? 201 : 200);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }
}
