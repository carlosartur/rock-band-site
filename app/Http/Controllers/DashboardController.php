<?php

namespace App\Http\Controllers;

use Throwable;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Responses\DashboardCardResponse;
use App\Services\ErrorDefaultResponseService;

class DashboardController extends Controller
{
    public function getDasboardInfo(): JsonResponse
    {

        try {
            $responseData = [
                new DashboardCardResponse($this->getDataToCard("Contact")),
                new DashboardCardResponse($this->getDataToCard("Newsletter")),
                new DashboardCardResponse($this->getDataToCard("Access")),
            ];
            
            return response()->json(['message' => 'Success!', 'data' => $responseData]);
        } catch (Throwable $throwable) {
            return ErrorDefaultResponseService::responseByException($throwable);
        }
    }

    public function getDataToCard(string $type): object
    {
        $query = DB::table(match ($type) {
            'Contact' => 'contact',
            'Newsletter' => 'newsletter',
            'Access' => 'access_logs',
        });

        $total = $query->count();

        $lastSevenMonths = $query->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count'),
            )
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->limit(7)
            ->get();

        return (object) [
            'queryResults' => $lastSevenMonths,
            'count' => $total,
            'title' => match ($type) {
                'Contact' => 'Contatos',
                'Newsletter' => 'Newsletters',
                'Access' => 'Acessos',
            }
        ];
    }
}
