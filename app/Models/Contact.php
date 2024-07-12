<?php
namespace App\Models;

use Illuminate\Support\Str;

class Contact extends AbstractModel implements ContactModelInterface
{
    protected $table = 'contact';

    public static function boot()
    {
        parent::boot();

        static::retrieved(fn($self) => $self->buildRawText());
    }

        /**
     * Build raw text to show resume of context
     *
     * @return string
     */
    public function buildRawText(): string
    {
        $this->message_raw = strip_tags(
            html_entity_decode(
                str_replace(['\r', '\n'], [' ', '<br>'], $this->message)
            )
        );

        if (!static::$searchedText) {
            $this->message_raw = Str::limit($this->message_raw, 50);
            return $this->message_raw;
        }

        $stringBeforeSearchedText = Str::beforeInsensitive($this->message_raw, static::$searchedText);
        $stringAfterSearchedText = Str::afterInsensitive($this->message_raw, static::$searchedText);
        
        $this->searched_text = static::$searchedText;

        $truncatedText = (strlen($stringBeforeSearchedText) > 20 ? '...' : '') 
            . substr($stringBeforeSearchedText, -20)
            . " <strong>" . static::$searchedText . "</strong> "
            . Str::limit($stringAfterSearchedText, 20, "...");

        $this->message_raw = $truncatedText;

        return $this->message_raw;
    }

    /**
     * Handle each line of csv
     *
     * @return self
     */
    public function handleCsvItem(): self
    {
        parent::handleCsvItem();
        
        $this->mensagem_html = $this->mensagem;
        $this->mensagem = strip_tags($this->mensagem);
        $this->mensagem = iconv("ISO-8859-1", "UTF-8", $this->mensagem);

        unset($this->message_raw);

        return $this;
    }
}