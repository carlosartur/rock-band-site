<?php

namespace App\Http\Controllers\Frontend;

use App\Models\AbstractModel;
use App\Models\Events;
use App\Services\ErrorDefaultResponseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class EventsController extends Controller
{    
   /**
    * @inheritDoc
    */
    protected function getModel(): AbstractModel
    {
        return new Events();
    }

    public function getFutureEvents(Request $request): JsonResponse
    {
        try {
            $response = $this->getModel()
                ->with('city.state', 'banner')
                ->where('enabled', true)
                ->where('date_start', '>', now())
                ->orderBy('date_start', 'ASC')
                ->get();

            return response()->json(['message' => 'Success!', 'data' => $response]);
        } catch(Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }
}
