<?php
namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Events extends AbstractModel
{
    protected $table = 'events';

    /**
     * City of event
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(Cities::class, 'city_id', 'id');
    }

    /**
     * Banner of event
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function banner(): BelongsTo
    {
        return $this->belongsTo(Gallery::class, 'gallery_id', 'id');
    }

    /**
     * Get future events
     * @return Collection|\Illuminate\Database\Eloquent\Builder[]
     */
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