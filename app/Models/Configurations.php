<?php
namespace App\Models;

use App\Enums\ConfigurationTypes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;

class Configurations extends AbstractModel
{
    protected $table = 'configurations';

    public static function boot()
    {
        parent::boot();

        static::retrieved(function ($self) { 
            $self->buildValue();
        });

        static::saving(function ($model) {
            unset(
                $model->value_translated,
                $model->default_value_translated
            );
        });

        static::updating(function ($model) {
            unset(
                $model->value_translated,
                $model->default_value_translated
            );
        });
    }

    public function buildValue() 
    {
        /** @var ConfigurationTypes $type */
        $type = ConfigurationTypes::tryFrom($this->type) ?? ConfigurationTypes::TextType;
                
        /** @var callable $callable */
        $callable = $type->getValueCallback();

        $this->value_translated = $callable($this->value);
        $this->default_value_translated = $callable($this->default_value);
    }

    public function name(): Attribute
    {
        return Attribute::make(
            set: fn (string $name) => [
                'name' => $name,
                'slug' => Str::slug($name),
            ],
        );
    }

    public static function getOneBySlug(string $slug): ?self
    {
        return self::where('slug', $slug)->first();
    }

    /**
     * Returns the value of configuration
     *
     * @return null|string|Gallery
     */
    public function getValue(): null|string|Gallery
    {
        /** @var ConfigurationTypes $type */
        $type = ConfigurationTypes::tryFrom($this->type) ?? ConfigurationTypes::TextType;

        if ($type == ConfigurationTypes::tryFrom("gallery")) {
            return Gallery::find($this->value);
        }

        return $this->value;
    }
}