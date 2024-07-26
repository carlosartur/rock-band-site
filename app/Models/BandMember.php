<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BandMember extends AbstractModel
{
    protected $table = 'band_member';

    /**
     * @return BelongsTo
     */
    public function photo(): BelongsTo
    {
        return $this->belongsTo(Gallery::class, 'gallery_id', 'id');
    }
}