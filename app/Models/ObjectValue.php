<?php

namespace App\Models;

use Cache;
use Config;
use DB;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ObjectValue
 * @package App\Models
 */
class ObjectValue extends Model
{
    protected $primaryKey = 'hash';

    /**
     * @param string $objectsId
     * @return array|null
     */
    public static function getObject($objectsId)
    {     
        $key = 'object_'.$objectsId;
        $object = Cache::get($key);            
        if (!$object)
        {
            $valueRow = self::find($objectsId);
	        $value = $valueRow ? $valueRow->value : null;
            $object = $value ? json_decode($value, true) : null;
            Cache::forever($key, $object);   
        }
        return $object;       
    }

    /**
     * @param array $value
     * @return string
     */
    public static function createObject($value)
    {
        $objectJson = json_encode($value);
        $valueHash = md5($objectJson);
        $object = self::find($valueHash);
        if (!$object) {
            $object = new ObjectValue;
            $object->hash = $valueHash;
            $object->value = $objectJson;
            $object->save();
        }
        return $valueHash;
    }
}
