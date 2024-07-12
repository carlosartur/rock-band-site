<?php
namespace App\Models;

use Illuminate\Support\Facades\Storage;

class Gallery extends AbstractModel
{
    protected $table = 'gallery';

    public static string $grayBase64 = "";

    /**
     * Get public url of gallery element
     *
     * @return string|null
     */
    public function getPhotoUrl($fullPath = true): ?string
    {
        if (!$this->path) {
            return null;
        }

        if (!$fullPath) {
            return Storage::url($this->path);
        }

        return str_replace("storage//storage","storage", get_env_direct_from_file("APP_URL") . Storage::url($this->path));
    }

    /**
     * @return string|null
     */
    public function base64(): ?string
    {
        $filePath = storage_path("app/public/{$this->path}");

        if (!file_exists($filePath)) {
            return null;
        }

        $fileContent = file_get_contents($filePath);
        $base64 = base64_encode($fileContent);
        $imageType = pathinfo($this->path, PATHINFO_EXTENSION);
        $imageData = "data:image/{$imageType};base64,{$base64}";
        return $imageData;
    }

    /**
     * Build image proportion
     *
     * @return self
     */
    public function buildProportion(): ?self
    {
        $filePath = storage_path("app/public/{$this->path}");

        if (!file_exists($filePath)) {
            return null;
        }

        $dimensions = getimagesize($filePath);

        [$width, $height] = $dimensions;

        if (!$width || (!$height)) {
            return null;
        }

        $this->width = $width;
        $this->height = $height;

        $greatestCommonDivisor = static function($width, $height) use (&$greatestCommonDivisor) {
            return ($width % $height) ? $greatestCommonDivisor($height, $width % $height) : $height;
        };

        $divisor = $greatestCommonDivisor($width, $height);

        $widthProportion = $width / $divisor;
        $heightDivisor = $height / $divisor;

        while (
            $widthProportion >= 100
            || $heightDivisor >= 100
        ) {
            $widthProportion = round($widthProportion / 10, 0);
            $heightDivisor = round($heightDivisor / 10, 0);
            
            $divisor = $greatestCommonDivisor($widthProportion, $heightDivisor);

            $widthProportion = $widthProportion / $divisor;
            $heightDivisor = $heightDivisor / $divisor;
        }

        $this->proportion = "{$widthProportion}:{$heightDivisor}";

        return $this;
    }

    /**
     * Get a base64 from a default gray color
     *
     * @return string
     */
    public static function getGrayBase64(): string
    {
        return self::getColourBase64('888888');
    }

    /**
     * Get a base64 from a given color 
     *
     * @param string $hexColour
     * @return string
     */
    public static function getColourBase64($hexColour = '888888'): string
    {
        if (!self::$grayBase64) {
            $base64Header = 'data:image/png;base64,';
            $imageWidth = 100;
            $imageHeight = 100;
            $image = imagecreatetruecolor($imageWidth, $imageHeight);

            $grayColor = imagecolorallocate($image, hexdec(substr($hexColour, 0, 2)), hexdec(substr($hexColour, 2, 2)), hexdec(substr($hexColour, 4, 2)));

            imagefill($image, 0, 0, $grayColor);
            ob_start();
            imagepng($image);

            $imageContent = ob_get_contents();
            ob_end_clean();
            
            $base64Image = base64_encode($imageContent);

            self::$grayBase64 = $base64Header . $base64Image;
            imagedestroy($image);
        }
        
        return self::$grayBase64;
    }
}