<?php
namespace App\Models;

class ContactInfo extends AbstractModel
{
    protected $table = 'contact_info';

    /**
     * Handle each line of csv
     *
     * @return self
     */
    public function handleCsvItem(): self
    {
        parent::handleCsvItem();
        
        $this->tipo = [
            "phone" => "Telefone",
            "whats" => "Whatsapp",
            "email" => "Email",
        ][$this->tipo];

        return $this;
    }
}