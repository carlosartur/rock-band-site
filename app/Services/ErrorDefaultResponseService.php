<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Throwable;

class ErrorDefaultResponseService
{
    public static function responseByException(Throwable $throwable, int $httpCode = 400): JsonResponse
    {
        $response = [
            'message' => $throwable->getMessage(),
            'success' => false
        ];

        if ($throwable instanceof ValidationException) {
            $response['inputs'] = $throwable->errors();
        }

        if (!app()->environment('production')) {
            $response['error_data'] = [
                'line' => $throwable->getLine(),
                'file' => $throwable->getFile(),
                'trace' => explode(PHP_EOL, $throwable->getTraceAsString())
            ];
        }

        return response()->json($response, $httpCode);
    }
}
