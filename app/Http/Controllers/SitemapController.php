<?php

namespace App\Http\Controllers;

use Auth;

use App\Models\Chronomap;
use App\Models\ObjectValue;

use Illuminate\Support\Facades\Lang;
use Illuminate\Http\Request;

/**
 * Class SitemapController
 * @package App\Http\Controllers
 */
class SitemapController extends Controller
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function sitemap(Request $request)
    {
        $pages = PageController::getMenu();
        $labels = Lang::get('messages');

        unset($pages['blog']);

        $chronomaps = Chronomap::getByFilters([
            'is_published'=>true
        ]);
        
        return view('sitemap/sitemap', [
            'env' => \App::environment(),
            'title' => $labels['Sitemap'],
            'lang'=>\App::getLocale(),
            'labels' => Lang::get('messages'),
            'pages' => $pages,
            'chronomaps'=>$chronomaps
       ]);
    }

    /**
     * @param string $lang
     * @param int $mapId
     * @return \Illuminate\Http\Response
     */
    public function sitemapChronomap($lang, $mapId)
    {
        $labels = Lang::get('messages');

        $object_types = array(
            'city'=>'Fixed objects',
            'army'=>'Mobile objects',
            'region'=>'Regions',
            'line'=>'Lines',
            'event'=>'Events');

        $chronomap = Chronomap::getChronomap($mapId ,null ,\App::getLocale());
        $objects = $chronomap->getObjectsGroupedByTypes();
        
        return view('sitemap/chronomap', [
            'env' => \App::environment(),
            'title' => $chronomap->name." - ". $labels['Sitemap'],
            'chronomapId' => $chronomap->id,
            'lang'=>\App::getLocale(),
            'labels' => Lang::get('messages'),
            'object_types' => $object_types,
            'objects'=>$objects
       ]);
    }

    /**
     * @param string $lang
     * @param int $mapId
     * @param string $objectId
     * @return \Illuminate\Http\Response
     */
    public function sitemapObject($lang, $mapId, $objectId)
    {
        $chronomap = Chronomap::getChronomap($mapId ,null ,\App::getLocale());
        $object = $chronomap->getObjectById($objectId);
        $article = isset($object['value']['article']) ? ObjectValue::getObject($object['value']['article'], false) : '';
        $article = str_replace("\n", "<br>",$article);     
    
        return view('sitemap/object', [
            'env' => \App::environment(),
            'title' => $object['value']['name'],
            'chronomapId' => $chronomap->id,
            'chronomapName' => $chronomap->name,
            'lang'=>\App::getLocale(),
            'labels' => Lang::get('messages'),
            'article' => $article,
            'object'=>$object,
            'objectId'=>$objectId,
       ]);
    }
}
