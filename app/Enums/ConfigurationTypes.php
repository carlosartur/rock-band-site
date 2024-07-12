<?php

namespace App\Enums;

use App\Models\Gallery;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

enum ConfigurationTypes: string
{
    case GalleryType = 'gallery';
    case StringType = 'string';
    case TextType = 'text';
    case MultiValues = 'multivalues';

    public function getValueCallback(): callable
    {
        return match ($this) {
            ConfigurationTypes::MultiValues => fn($value) => json_decode($value) ?? [],
            ConfigurationTypes::StringType => fn($value) => $value, 
            ConfigurationTypes::TextType => fn($value) => Str::limit(
                trim(
                    strip_tags(
                        html_entity_decode(
                            str_replace(['\\r', '\\n', '<br>'], [' '], html_entity_decode($value))
                        )
                    )
                )
            ),
            ConfigurationTypes::GalleryType => function($value): string {
                if (!$value) {
                    return "";
                }
                
                $path = Gallery::find($value)?->path ?? "";
                if (!$path) {
                    return "";
                }

                return Storage::url($path);
            },
        };
    }
}
