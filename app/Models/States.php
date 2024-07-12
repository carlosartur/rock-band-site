<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class States extends AbstractModel
{
    protected $table = 'states';

    public function cities(): HasMany
    {
        return $this->hasMany(Cities::class, 'state_id', 'id');
    }
}