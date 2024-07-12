<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cities extends AbstractModel
{
    protected $table = 'cities';

    public function state(): BelongsTo
    {
        return $this->belongsTo(States::class, 'state_id', 'id');
    }
}