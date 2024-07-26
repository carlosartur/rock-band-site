<?php

namespace App\Responses;

class DashboardCardDatasetInternalResponse
{
    public string $label = '';

    public string $backgroundColor = '';

    public string $borderColor = '';

    public string $color = '';
        
    public string $pointBackgroundColor = "#321FDB";

    public array $data = [];

    public function __construct(array $config = [])
    {
        $this->label = $config["label"] ?? "";
        $this->color = $config["color"] ?? "";
        $this->backgroundColor = $config["backgroundColor"] ?? "";
        $this->borderColor = $config["borderColor"] ?? "";
        $this->pointBackgroundColor = $config["pointBackgroundColor"] ?? "";
    }
}
