<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Newsletter extends AbstractModel
{
    protected $table = 'newsletter';

    public function state(): BelongsTo
    {
        return $this->belongsTo(States::class, 'state_id', 'id');
    }

    /**
     * Handle each line of csv
     *
     * @return self
     */
    public function handleCsvItem(): self
    {
        parent::handleCsvItem();
        $this->habilitado = $this->habilitado ? "Sim" : "Não";

        return $this;
    }
}