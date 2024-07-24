<?php

namespace Database\Seeders;

use DateTime;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CitiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        (new StatesSeeder())->run();

        $cities = json_decode(file_get_contents(__DIR__ . "/cities.json"));

        foreach ($cities as $city) {
            $stateId = DB::table('states')->where('acronym', $city->uf)->first()->id;
            
            if (DB::table('cities')->where('code', $city->codigo)->get()->count()) {
                continue;
            }

            DB::table('cities')->insert([
                'name' => $city->nome,
                'code' => $city->codigo,
                'state_id' => $stateId,
                'created_at' => (new DateTime())->format("Y-m-d H:i:s"),
                'updated_at' => (new DateTime())->format("Y-m-d H:i:s"),
                'postcode_start' => $city->ceps->cepMin,
                'postcode_end' => $city->ceps->cepMax,
            ]);            
        }
        
    }
}
