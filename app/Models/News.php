<?php
namespace App\Models;

use Illuminate\Support\Str;

class News extends AbstractModel
{
    protected $table = 'news';

    public static function boot()
    {
        parent::boot();

        static::retrieved(fn($self) => $self->buildRawContent());
    }

    /**
     * Build raw text to show resume of context
     *
     * @return string
     */
    public function buildRawContent(): self
    {
        if (!static::$searchedText) {
            $this->content_raw = Str::limit($this->content_raw, 80);
            return $this;
        }

        $stringBeforeSearchedText = Str::beforeInsensitive($this->content_raw, static::$searchedText);
        $stringAfterSearchedText = Str::afterInsensitive($this->content_raw, static::$searchedText);
        
        $this->searched_text = static::$searchedText;

        $truncatedText = (strlen($stringBeforeSearchedText) > 25 ? '...' : '') 
            . substr($stringBeforeSearchedText, -25)
            . " <strong>" . static::$searchedText . "</strong> "
            . Str::limit($stringAfterSearchedText, 25, "...");

        $this->content_raw = $truncatedText;

        return $this;
    }
}