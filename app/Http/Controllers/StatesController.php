<?php

namespace App\Http\Controllers;

use App\Models\Cities;
use App\Models\States;
use Illuminate\Http\Request;

class StatesController extends Controller
{
    public function getAll()
    {
        return response()->json(States::all(), 200); 
    }

    public function getCityAndStateByPostcode(Request $request, string $postcode)
    {
        $postcode = substr(
            string: preg_replace("/\D/", "", $postcode),
            offset: 0,
            length: 8
        );

        $postcodeStateData = States::with("cities")->whereHas("cities", fn ($query) => $query
                ->where('postcode_start', '<=', $postcode)
                ->where('postcode_end', '>=', $postcode)
            )
            ->get()
            ->first();

        $postcodeStateData->cities->transform(function ($item) use ($postcode) {
            $selected = $item->postcode_start <= $postcode
                && $item->postcode_end >= $postcode;

            $item->selected = $selected;
            
            return $item;
        });

        return response()->json($postcodeStateData, 200);
    }

    public function getAllCities(Request $request, int $id)
    {
        $cities = Cities::where("state_id", $id)->orderBy("name", "asc")->get();
        return response()->json(
            $cities,
            200
        );
    }
}
