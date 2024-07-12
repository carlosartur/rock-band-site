<?php

namespace Database\Seeders;

use Illuminate\Support\Str;
use App\Models\Configurations;
use Illuminate\Database\Seeder;
use App\Enums\ConfigurationTypes;

class ConfigurationsSeeder extends Seeder
{

    private const CONFIGS = [
        [
            'name' => "Logo principal claro",
            'default_value' => "",
            "type" => ConfigurationTypes::GalleryType->value
        ],
        [
            'name' => "Chave ReCAPTCHA",
            'default_value' => "",
            "type" => ConfigurationTypes::StringType->value
        ],
        [
            'name' => "Chave Secreta ReCAPTCHA",
            'default_value' => "",
            "type" => ConfigurationTypes::StringType->value,
            "hide_to_frontend" => true
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (self::CONFIGS as $config) {
            $oldConfiguration = Configurations::getOneBySlug(Str::slug($config['name']));

            if ($oldConfiguration) {
                $oldConfiguration->type = $config['type'];
                $oldConfiguration->hide_to_frontend = $config['hide_to_frontend'] ?? false;
                $oldConfiguration->default_value = $config['default_value'];
                $oldConfiguration->save();
                continue;
            }

            $newConfig = new Configurations();
            $newConfig->name = $config['name'];
            $newConfig->default_value = $config['default_value'];
            $newConfig->value = $config['default_value'];
            $newConfig->type = $config['type'];
            $newConfig->hide_to_frontend = $config['hide_to_frontend'] ?? false;
            $newConfig->save();
        }
    }
}
