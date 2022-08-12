<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Cache;
use Config;
use DB;

class ArticleValue extends Model
{
    protected $primaryKey = 'hash';

    protected $table = "article_values";

    /**
     * Get article from db
     * @param string $hash
     * @return string
     */
    public static function getArticle(string $hash) : string
    {     
        $key = 'object_'.$hash;
        $value = Cache::get($key);
        if(!$value)
        {
            $valueRow = self::find($hash);
            $value = $valueRow ? $valueRow->value : null;
            Cache::forever($key, $value);
        }
        return $value ? $value : '';
    }

    /**
     * Save article to DB
     * @param string $value
     * @return string
     */
    public static function createArticle(string $value) : string
    {   
        $valueHash = md5($value);
        $object = self::find($valueHash);
        if(!$object) {
            $object = new ArticleValue;
            $object->hash = $valueHash;
            $object->value = $value;
            $object->save();
        }
        return $valueHash;
    }
}
