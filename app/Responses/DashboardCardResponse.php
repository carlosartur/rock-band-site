<?php

namespace App\Responses;

class DashboardCardResponse
{

    public const CARD_DISPLAY_INFO = [
        "Contatos" => [
            "label" => "Contatos",
            "color" => "primary",
            "backgroundColor" => "transparent",
            "borderColor" => "rgba(255,255,255,.55)",
            "pointBackgroundColor" => "#321FDB",
            "actions" => [
                [
                    "href" => "#/admin/contact",
                    "name" => "Contatos",
                ]
            ]
        ],
        "Newsletters" => [
            "label" => "Newsletters",
            "color" => "warning",
            "backgroundColor" => "transparent",
            "borderColor" => "rgba(255,255,255,.55)",
            "pointBackgroundColor" => "#F9B115",
            "actions" => [
                [
                    "href" => "#/admin/newsletters",
                    "name" => "Newsletters",
                ]
            ]
        ],
        "Acessos" => [
            "label" => "Acessos",
            "color" => "success",
            "backgroundColor" => "transparent",
            "borderColor" => "rgba(255,255,255,.55)",
            "pointBackgroundColor" => "#2EB85C",
            "actions" => [
                [
                    "href" => "#/admin/dashboard",
                    "name" => "Acessos",
                ]
            ]
        ],
    ];

    public const PORTUGUESE_MONTHS = [
        1 => 'Janeiro',
        2 => 'Fevereiro',
        3 => 'Março',
        4 => 'Abril',
        5 => 'Maio',
        6 => 'Junho',
        7 => 'Julho',
        8 => 'Agosto',
        9 => 'Setembro',
        10 => 'Outubro',
        11 => 'Novembro',
        12 => 'Dezembro',
    ];

    public string $total;

    public string $typeArrow = "up";

    public string $color = "primary";

    public string $percentVariation = "0";
    
    public ?int $max = null;

    public ?int $min = null;

    public string $title;

    public array $labels = [];

    public array $actions = [];

    /** @var DashboardCardDatasetInternalResponse[] */
    public array $datasets = [];

    public function __construct(?object $data = null)
    {
        if (!$data) {
            return $this;
        }

        $queryResults = $data->queryResults;
        $count = $data->count;
        $cardDisplayInfo = self::CARD_DISPLAY_INFO[$data->title];
        
        $this->title = $data->title;
        $this->color = $cardDisplayInfo["color"];

        $dataset = new DashboardCardDatasetInternalResponse($cardDisplayInfo);
        $dataset->label = $data->title;

        foreach ($queryResults as $result) {
            if (is_null($this->max) || ($this->max < $result->count)) {
                $this->max = $result->count;
            }

            if (is_null($this->min) || ($this->min > $result->count)) {
                $this->min = $result->count;
            }

            $this->labels[] = self::PORTUGUESE_MONTHS[$result->month] . "/" . $result->year;
            $dataset->data[] = $result->count;
        }

        $dataset->data = array_reverse($dataset->data);
        $this->labels = array_reverse($this->labels);

        $datasetCount = count($dataset->data);

        if ($datasetCount >= 2) {
            $this->calculatePercentVariation(
                lastValue: $dataset->data[$datasetCount - 1],
                penultimateValue: $dataset->data[$datasetCount - 2]
            );
        }

        $this->total = number_format(
            num: (float) $count,
            decimal_separator: ',',
            thousands_separator: '.'
        );

        $this->actions = $cardDisplayInfo["actions"];

        $this->max = ceil($this->max + ($this->max / 5));
        $this->min = floor($this->min - ($this->min / 5));

        $this->datasets[] = $dataset;
    }

    /**
     * Calculate percent variation and put type arrow, based on value of percent variation
     *
     * @param float $lastValue
     * @param float $penultimateValue
     * @return void
     */
    public function calculatePercentVariation(float $lastValue, float $penultimateValue): void
    {
        $percentVariation = (($lastValue - $penultimateValue) / $penultimateValue) * 100;

        $this->percentVariation = number_format(
            num: (float) $percentVariation,
            decimal_separator: ',',
            thousands_separator: '.'
        );

        $this->typeArrow = $percentVariation < 0 ? "down" : "up";
    }
}
