<?php
namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Events extends AbstractModel
{
    protected $table = 'events';

    public function city(): BelongsTo
    {
        return $this->belongsTo(Cities::class, 'city_id', 'id');
    }

    public function photos(): HasManyThrough
    {
        return $this->hasManyThrough(
            Gallery::class,
            GalleryEvents::class,
            'event_id', // Chave estrangeira da tabela intermediária
            'id', // Chave primária da tabela de destino (Galery)
            'id', // Chave primária da tabela de origem (Hotels)
            'gallery_id' // Chave estrangeira da tabela de destino
        );
    }

    public static function getFutureEvents(): ?Collection
    {
        $events = self::where(
                "date_end", 
                ">=", 
                (new DateTime())->format("Y-m-d 00:00:00"))
            ->where("enabled", 1)
            ->with("photos")
            ->get();

        foreach ($events as $event) {
            $event->photos->transform(function (Gallery $photo) {
                $photo->path = $photo->getPhotoUrl();
                $photo->isBase64 = false;
                return $photo;
            });

            if (!$event->photos->count()) {
                $event->photos = collect([
                    (object)[
                        "path" => Gallery::getColourBase64("015E87"),
                        "isBase64" => true,
                    ]
                ]);
            }

            $event->banners = $event->photos;
        }

        return $events;
    }
}