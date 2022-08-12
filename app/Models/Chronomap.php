<?php

namespace App\Models;

use DB;
use App\Services\ImageService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class Chronomap
 * @package App\Models
 */
class Chronomap extends Model
{
    /**
     * Count versions before creating base version
     */
    const BASE_VERSIONS_STEP = 7;

    /**
     * @param array $filters
     * @return Collection
     */
    public static function getByFilters(array $filters=[]) : Collection
    {    
        $query = self::where('is_deleted','!=','1');
               
        foreach ($filters as $field=>$value){
          $query->where($field,'=',$value);
        }
        $query->where('category','<>', '', 'and');
        return $query->orderBy('ordering', 'asc')->get();
    }
    
        /**
     * @param array $filters
     * @return Collection
     */
    public static function getByCategories(array $filters=[], $categories) : array
    {    
        $maps = self::getByFilters($filters);
        $labels = ['ancient'=>'Ancient history','middle_ages'=>'Middle Ages','modern'=>'Modern history','fantasy'=>'Fantasy'];
        $mapsByCategories = [];
        foreach($maps as $map) {
            if(!in_array($map->category, $categories)) {
                continue;
            }
            if(!isset($mapsByCategories[$map->category])) {
                $mapsByCategories[$map->category] = [
                    'category' => $map->category,
                    'label' => $labels[$map->category] ?? '',
                    'maps' => [],
                ];
            }
            $mapsByCategories[$map->category]['maps'][] = $map;
        }
        
        
        
        return $mapsByCategories;
    }

    /**
     * @param int $userId
     * @return Collection
     */
    public static function getByUser(int $userId): Collection
    {
        return self::where('is_deleted','!=','1')->
            join('user_chronomap_right', 'chronomaps.id', '=', 'user_chronomap_right.chronomap_id')->
            where('user_id','=',$userId)->
            orderBy('created_at', 'asc')->get();
    }
    /**
     * 
     * @param type $id
     * @param type $url
     * @param type $link
     * @return Chronomap Chronomap
     */
    public static function getChronomap($id, $url = null, $lang = null)
    {
        if($id){
            return Chronomap::find($id);
        }
        else{
            return Chronomap::where('url', $url)->where('lang',$lang)->first();
        }
    }

    /**
     * @return string
     */
    public function getLink()
    {
        return "/".$this->lang.($this->url ? "/".$this->url : "/id/".$this->id);    
    }
    
    public function getMapLink()
    {
        return "/".$this->lang.'/map'.($this->url ? "/".$this->url : "/id/".$this->id);    
    }
    
     /**
     * @return string
     */
    public function getChainLink($chain)
    {
        return $this->getLink()."/chain".(isset($chain['url']) && $chain['url'] ? "/".$chain['url'] : "/id/".$chain['id']);    
    }
    
    /**
     * @return array
     */
    public function getChains()
    {
        $mainObject = $this->getObjectById('MAIN');
        return $mainObject['value']['eventChains'];    
    }
    
    /**
     * @return array
     */
    public function getChain($chainId, $chainUrl)
    {
        $chains = $this->getChains();
        foreach($chains as $chain) {
        
            if($chain['id'] == $chainId) {
                return $chain;
            }
            if(isset($chain['url']) && ($chain['url'] == $chainId)) {
                return $chainUrl;
            }
        }
            
    }

    /**
     * @return array
     */
    public function owners()
    {
        return $this->belongsToMany('App\Models\User', 'user_chronomap_right');
    }

    /**
     * @param User|null $user
     * @return null|string
     */
    public function getMapRights($user)
    {
        if (!$user) {
            return null;
        }
        if ($user->is_admin) {
            return 'owner';
        }
        foreach ($this->owners as $owner){
            if($owner->id == $user->id){
                return 'owner';
            }
        }
        if($this->is_open_editing) {
            return 'editor';
        }
        return null;
    }

    /**
     * @return mixed
     */
    public function chronomapVersions()
    {
        return $this->hasMany('App\Models\ChronomapVersion','map_id');
    }

    /**
     * @return array
     */
    public function getVersions()
    {
        $versions = $this->chronomapVersions()
                ->where('is_deleted','!=', 1)
                ->with('author')
                ->orderBy('created_at', 'desc')
                ->get();
        $result = [];
        foreach ($versions as $version){
            $result[] = [
                'version'=>$version->version,
                'description'=>$version->description,
                'userDescription'=>$version->user_description,
                'created_at'=>$version->created_at->format('Y-m-d H:i:s'),
                'login'=>$version->author ? $version->author->login : ''
            ];
        }
        return $result;
    }

    /**
     * @param $version
     * @param $lang
     * @return string
     */
    public function getBaseUrl($version)
    {
        $url = '/'.$this->lang.'/map/'.($this->url ? $this->url : 'id/'.$this->id);
        $url .= $version != $this->current_version ? '/version/'.$this->lang : '';
        return $url;
    }

    /**
     * @param $name
     * @param $image
     * @param $description
     * @param $lang
     * @param $discussHref
     * @param $article
     */
    public function saveDescription($name, $image, $description, $lang, $discussHref, $article)
    {
        $this->name = $name;
        $this->image = $image;
        $this->description = $description;
        $this->lang = $lang;
        $this->discuss_href = $discussHref;
        $this->article = $article;

        $this->save();
    }

    /**
     * @return int
     */
    private function getNextVersionNumber()
    {
        $maxVersion = DB::table('chronomap_versions')->where('chronomap_versions.map_id','=', $this->id)->max('version');        
        return $maxVersion ? $maxVersion+1 : 1;
    }

    /**
     * @param $versionNumber
     * @return ChronomapVersion
     */
    private function getVersion($versionNumber)
    {
        return ChronomapVersion::getVersion($this->id, $versionNumber);
    }

    /**
     * @param $objects
     * @param $currentVersion
     * @param $userId
     * @param $commitMessage
     * @param $userCommitMessage
     * @return int
     */
    public function saveVersion($objects, $currentVersion, $userId, $commitMessage, $userCommitMessage)
    {
        $newVersionNumber = $this->getNextVersionNumber();
        $version = new ChronomapVersion();
        $version->map_id = $this->id;
        $version->version = $newVersionNumber;
        $version->description = $commitMessage;
        $version->user_description = $userCommitMessage;
        $version->user_id = $userId;
        $version->prev_version = $currentVersion;
        $version->base_version = $currentVersion ? $this->getVersion($currentVersion)->base_version : 0;
        $version->save();
        
        $version->saveObjects($objects);
        
        $this->current_version = $newVersionNumber;
        $this->save();
        if($newVersionNumber % self::BASE_VERSIONS_STEP == 1){
            $version->createBaseVersion();
        }
        return $newVersionNumber;
    }

    /**
     * @param $editors_string
     * @param $isPublished
     * @param $isOpenEditing
     */
    public function setEditors($editors_string, $isPublished, $isOpenEditing)
    {
        $trimmed_editors_string = str_replace([' ','\n'], '', $editors_string);
        if (!$trimmed_editors_string) {
            return;
        }
        $editor_names = explode(',', $trimmed_editors_string);

        $editors = User::whereIn('login',$editor_names)->get();

        $this->owners()->sync($editors->pluck('id')->all());

        $this->is_published = $isPublished;
        $this->is_open_editing = $isOpenEditing;
        $this->save();

    }

    /**
     * Set map deleted flag
     */
    public function setDeleted()
    {
        $this->is_deleted = true;
        $this->save();
    }

    /**
     * Delete last version of map
     */
    public function deleteLastVersion()
    {
        $currentVersion = $this->getVersion($this->current_version);
        $currentVersion->setDeleted();

        $lastVersionNumber = DB::table('chronomap_versions')
            ->where('chronomap_versions.map_id','=', $this->id)
            ->where('chronomap_versions.is_deleted','!=', 1)
            ->max('version');

        $this->current_version = $lastVersionNumber;
        $this->save();
    }

    /**
     * Get object list by types
     * @return array
     */
    public function getObjectsGroupedByTypes()
    {
        $currentVersion = $this->getVersion($this->current_version);

        $objects = $currentVersion->getVersionObjectsFromDB(true);
        $result_array = array();
        foreach($objects as $object){
          $type = $object['type'];
          $result_array[$type][] = $object;
        }
        return $result_array;
    }

    /**
     * @param $objectsIds
     * @return array
     */
    public function getObjectsByIds($objectsIds)
    {
        $currentVersion = $this->getVersion($this->current_version);
        $objects = $currentVersion->getVersionObjectsFromDB(false, $objectsIds);
        return $objects;
    }

    /**
     * @param $objectId
     * @return mixed|null
     */
    public function getObjectById($objectId)
    {
        $objects = $this->getObjectsByIds([$objectId]);
        return isset($objects[$objectId]) ? $objects[$objectId] : null;
    }

    /**
     * Create new map
     * @param $name
     * @param $image
     * @param $description
     * @param $lang
     * @param $article
     * @param $discussHref
     * @param $copyOfMapId
     * @param $mapTypeOptions
     * @param ImageService $imageService
     * @return Chronomap
     */
    public static function createChronomap(
        $name,
        $image,
        $description,
        $lang,
        $article,
        $discussHref,
        $copyOfMapId,
        $mapTypeOptions,
        ImageService $imageService
    ){
        $chronomap = new Chronomap();
        $chronomap->name = $name;
        $chronomap->image = $image;
        $chronomap->description = $description;
        $chronomap->lang = $lang;
        $chronomap->article = $article;
        $chronomap->discuss_href = $discussHref;
        $chronomap->current_version = 0;
        $chronomap->copy_of_map_id = $copyOfMapId;
        $chronomap->save();

        if($mapTypeOptions){
            $dimensions = $imageService->createTales($mapTypeOptions['file'], $mapTypeOptions['maxScale']);
        }

        if($copyOfMapId){
           $chronomap->createCopy($copyOfMapId);
        }

        return $chronomap;
    }

    /**
     * Create new map version
     * @param $fields
     * @param $userId
     * @return int
     */
    public function addNewVersion($fields, $userId)
    {
        $newVersionNumber = $this->saveVersion(
            $fields['objects'],
            isset($fields['currentVersion']) ? $fields['currentVersion'] : 0,
            $userId,
            $fields['commitMessage'],
            $fields['userCommitMessage']
        );
        $this->saveDescription(
            $fields['name'],
            $fields['image'],
            $fields['description'],
            $fields['lang'],
            isset($fields['discussHref']) ? $fields['discussHref'] : '',
            isset($fields['article']) ? $fields['article'] : ''
        );
        $this->setEditors(
            $fields['editors'],
            $fields['published'] ?? '',
            $fields['openEditing'] ?? ''
        );

        return $newVersionNumber;
    }

    /**
     * Make copy of map
     * @param $oldMapId
     */
    public function createCopy($oldMapId)
    {
        $oldChronomap = self::getChronomap($oldMapId);
        $version = $oldChronomap->getVersion($oldChronomap->current_version);
        $objects = $version->getVersionObjects();

        $this->saveVersion($objects, 0, null, '', '');
    }
}
