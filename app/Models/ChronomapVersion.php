<?php

namespace App\Models;

use Cache;
use Config;
use DB;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ChronomapVersion
 * @package App\Models
 */
class ChronomapVersion extends Model
{
    protected $primaryKey = ['map_id','version'];
    public $incrementing = false;
    
     /**
     * Set the keys for a save update query.
     *
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function setKeysForSaveQuery(\Illuminate\Database\Eloquent\Builder $query)
    {
        foreach ($this->getKeyName() as $key) {
            if ($this->$key)
                $query->where($key, '=', $this->$key);
            else
                throw new Exception(__METHOD__ . 'Missing part of the primary key: ' . $key);
        }

        return $query;
    }
    
    /**
     * 
     * @param int $mapId
     * @param int $version
     * @return ChronomapVersion
     */
    public static function getVersion($mapId, $version)
    {
        return self::where('map_id','=',$mapId)
            ->where('version','=',$version)            
            ->first();
    }

    /**
     * @return mixed
     */
    public function author()
    {
        return $this->belongsTo('App\Models\User','user_id');
    }

    /**
     * Get all objects of map version
     * @return array
     */
    public function getVersionObjects()
    {
        $key = $this->map_id."_".$this->version;
        $objects =  Cache::get($key);                   
        if(!$objects)
        {
            $objects = self::getVersionObjectsFromDB();                       
            Cache::forever($key, $objects);            
        }
        return $objects;   
    }

    /**
     * @param bool $onlyNames
     * @param array $onlyIds
     * @return array
     */
    public function getVersionObjectsFromDB($onlyNames=false, $onlyIds=[])
    {
        $query = DB::table('chronomap_objects')
            ->join('chronomap_versions', function($join) {
                $join->on('chronomap_objects.map_id', '=', 'chronomap_versions.map_id');
                $join->on('chronomap_objects.version','=','chronomap_versions.version');                            
            })
            ->where('chronomap_versions.map_id','=', $this->map_id)
            ->where('chronomap_versions.is_deleted','!=', true)
            ->where('chronomap_objects.version','>=', $this->base_version)
            ->where('chronomap_objects.version','<=', $this->version)
            ->orderBy('chronomap_objects.version')
            ->orderBy('chronomap_objects.time_object_id')
            ->orderBy('chronomap_objects.time_object_field_id');
           
        if ($onlyNames){
            $query->orWhere(function($query) {
                $query->where('chronomap_objects.time_object_field_id','=', '')
                ->where('chronomap_objects.time_object_field_id','=', null);
            });
        }
        if ($onlyIds){
            $query->whereIn('chronomap_objects.time_object_id',$onlyIds);
        }
        $rows = $query ->get();
        $objects = $this->prepareObjects($rows);
        return $objects;
    }

    /**
     * @param $rows
     * @return array
     */
    private function prepareObjects($rows)
    {
        $timeObjects = array();
        foreach ($rows as $row) {
            $timeObjectId = $row->time_object_id;

            $object = array();
            $object['serverHash'] = $row->value_hash;
            $value = ObjectValue::getObject($row->value_hash);

            $object['value'] = $value['value'];
            $object['dateBegin'] = $value["dateBegin"];
            $object['dateEnd'] = $value["dateEnd"];

            $object['timeObjectId'] = $timeObjectId;
            $object['type'] = $row->type;
            if (!$row->time_object_field_id) {
                if ($row->change_type == 'delete') {
                    unset( $timeObjects[$timeObjectId]);
                }
                else {
                    $timeObjects[$timeObjectId] = $object;
                    $timeObjects[$timeObjectId]['timeObjectFields'] = array();
                }
            }
            else {
                $timeObjectFieldId = $row->time_object_field_id;
                if (!isset($timeObjects[$timeObjectId])) {
                    continue;
                }

                $object['timeObjectFieldId'] = $timeObjectFieldId;
                $timeObjects[$timeObjectId]['timeObjectFields'][$timeObjectFieldId] = $object;
            }
        }
        return $timeObjects;
    }

    /**
     * Save objects to DB
     * @param $objects
     */
    public function saveObjects($objects)
    {
        foreach ($objects as $object){
            if (isset($object['serverHash'])){
                $valueHash = $object['serverHash'];
            }
            else {
                $storage_object = array('dateBegin'=>$object['dateBegin'],'dateEnd'=>$object['dateEnd'],'value'=>$object['value']);
                $valueHash =  ObjectValue::createObject($storage_object);
            }

            $chronomapObject = new ChronomapObject();
            $chronomapObject->map_id = $this->map_id;
            $chronomapObject->version = $this->version;
            $chronomapObject->type =$object['type'];
            $chronomapObject->time_object_id = $object['timeObjectId'];
            $chronomapObject->time_object_field_id = isset($object['timeObjectFieldId']) ? $object['timeObjectFieldId'] : null;
            $chronomapObject->value_hash = $valueHash;
            $chronomapObject->change_type =  isset($object['changeType']) ? $object['changeType'] : null;
            $chronomapObject->save();

            if (isset($object['timeObjectFields'])){
                $this->saveObjects($object['timeObjectFields']);
            }
        }
    }

    /**
     * Create base version of map. Base version contains all objects, not the delta with previous version.
     */
    public function createBaseVersion()
    {
        $objects = $this->getVersionObjectsFromDB();

        DB::table('chronomap_objects')
            ->where('chronomap_objects.map_id','=', $this->map_id)
            ->where('chronomap_objects.version','=', $this->version)
            ->delete();

        $this->saveObjects($objects);

        $this->base_version =  $this->version;
        $this->save();
    }

    /**
     * Set deleted version flag
     */
    public function setDeleted()
    {
        $this->is_deleted = true;
        $this->save();
    }
  
}
