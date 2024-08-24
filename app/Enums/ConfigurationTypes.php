<?php

namespace App\Enums;

use App\Models\Gallery;
use App\Models\Pages;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use stdClass;

enum ConfigurationTypes: string
{
    case GalleryType = 'gallery';
    case StringType = 'string';
    case TextType = 'text';
    case PageType = 'page';
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
            ConfigurationTypes::PageType => function($value): stdClass|Pages {
                if (!$value) {
                    return Pages::getEmptyPage();
                }

                $page = Pages::where('id', $value)
                    ->orWhere('slug', $value)
                    ->first();

                if ($page) {
                    return $page;
                }

                return Pages::getEmptyPage();
            },
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
