<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use stdClass;

class Pages extends AbstractModel
{
    protected $table = 'pages';

    /**
     * @return BelongsTo
     */
    public function banner(): BelongsTo
    {
        return $this->belongsTo(Gallery::class, 'gallery_id', 'id');
    }

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
    public function buildRawText(): self
    {
        if ($this->html || $this->titulo) {
            $this->html = strip_tags(
                html_entity_decode(
                    str_replace(['\r', '\n'], [' ', '<br>'], $this->html)
                )
            );

            $this->aparece_na_home = $this->aparece_na_home ? "Sim" : "Não";
            
            return $this;
        }

        $this->text_raw = strip_tags(
            html_entity_decode(
                str_replace(['\r', '\n'], [' ', '<br>'], $this->text)
            )
        );

        if (!static::$searchedText) {
            $this->text_raw = Str::limit($this->text_raw, 80);
            return $this;
        }

        $stringBeforeSearchedText = Str::beforeInsensitive($this->text_raw, static::$searchedText);
        $stringAfterSearchedText = Str::afterInsensitive($this->text_raw, static::$searchedText);
        
        $this->searched_text = static::$searchedText;

        $truncatedText = (strlen($stringBeforeSearchedText) > 25 ? '...' : '') 
            . substr($stringBeforeSearchedText, -25)
            . " <strong>" . static::$searchedText . "</strong> "
            . Str::limit($stringAfterSearchedText, 25, "...");

        $this->text_raw = Str::removeInvalidUtf8($truncatedText);

        return $this;
    }

    /**
     * Build list data for frontend
     *
     * @return stdClass
     */
    public function buildListData(): stdClass
    {
        $obj = new stdClass();
        $data = $this->buildBannerData();

        $obj->img = $this->banner->getPhotoUrl();
        $obj->title = $data->title;
        $obj->content = $data->text_raw;
        $obj->price = "";
        $obj->btnName = "Acessar";
        $obj->btnLink = "/frontend/blog-page/{$data->slug}";

        return $obj;
    }

    /**
     * Build banner data
     *
     * @return self
     */
    public function buildBannerData(): self
    {
        if (
            !$this->banner 
            || (!$this->banner->base64())
        ) {
            $this->bannerData = (object) [
                "base64encoded" => Gallery::getColourBase64(),
            ];
            return $this;
        }

        $this->bannerData = (object) [
            "base64encoded" => $this->banner->base64(),
        ];

        unset($this->banner);

        return $this;
    }

    public static function getPagesForHome() {
        $blogPages = Pages::where("home", true)
            ->orderBy('created_at', 'desc')
            ->with("banner")
            ->limit(3)
            ->get();
    
        $blogPages->transform(fn(Pages $item) => $item->buildListData());

        return $blogPages;
    }

    public static function getEmptyPage(): stdClass
    {
        $date = (new DateTime())->format("Y-m-d H:i:s");

        $emptyPage = new stdClass();
        $emptyPage->id = 0;
        $emptyPage->slug = "";
        $emptyPage->title = "";
        $emptyPage->text = "";
        $emptyPage->home = 0;
        $emptyPage->order = 0;
        $emptyPage->gallery_id = null;
        $emptyPage->created_at = $date;
        $emptyPage->updated_at = $date;

        return $emptyPage;
    }

}