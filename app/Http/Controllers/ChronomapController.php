<?php

namespace App\Http\Controllers;

use Auth;

use App\Models\Chronomap;
use App\Models\ChronomapVersion;
use App\Models\ArticleValue;
use App\Models\Comment;
use App\Services\NotificationService;
use App\Services\ImageService;
use App\Libs\MobileDetector;
use App\Models\Tracking;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;

/**
 * Class ChronomapController
 * @package App\Http\Controllers
 */
class ChronomapController extends Controller
{
    const BLOG_HREF = 'http://outlander-yy.livejournal.com';

      
    /**
     * Return list of maps
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $this->maps($request, true);
    }
    
    public function usersMaps(Request $request)
    {
        return $this->maps($request, false);
    }
    
    public function maps(Request $request, $isReady)
    {
        if(!$request->lang) {
            $lang = $request->getPreferredLanguage(['en','ru']);
            return redirect('/'.$lang);
        }
        
        if(!in_array($request->lang, ['en','ru']) ) {
            abort(404);
        }
        Tracking::insert("Open maps: ".($isReady ? 'all': 'users'), session()->getId(), MobileDetector::isMobileDevice(), $request->user() ? $request->user()->email : '', \App::getLocale());
  
        
        $chronomapsByCategories = Chronomap::getByCategories([
           'lang'=>\App::getLocale(),
        ], $isReady ? ['ancient','middle_ages','modern','fantasy'] : ['users']);

        $labels = Lang::get('messages');
        return view('chronomaps', [
            'chronomapsByCategories' => $chronomapsByCategories,
            'env' => \App::environment(),
            'page'=>'',
            'title'=>$labels[$isReady ? 'Maps' : 'Users maps'],
            'isReady'=>$isReady,
            'lang'=>\App::getLocale(),
            'labels' => $labels,
            'isMobile' => MobileDetector::isMobileDevice(),
            'hreflangs' => ['ru'=>'/ru/' ,'en'=>'/en/']
        ]);
    }

    /**
     * Return list of maps for object import
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getForImport(Request $request)
    {
        $chronomaps = Chronomap::getByFilters([
           'is_published'=>true
        ]);
        return response()->json($chronomaps);
    }

    /**
     * @param string $lang
     * @param int $id
     * @param int|null $version
     * @return mixed
     */
    public function chronomapById($lang, $id, $version = null)
    {
        return $this->chronomap($id, null, $version);
    }

    /**
     * @param string $lang
     * @param string $url
     * @param int|null $version
     * @return \Illuminate\Http\Response
     */
    public function chronomapByUrl($lang, $url, $version = null)
    {
        return $this->chronomap(null, $url, $version);
    }
    
     /**
     * @return \Illuminate\Http\Response
     */
    public function xxAge()
    {
        \App::setLocale('ru');
        return $this->chronomap(null, 'XX_century', null, true);
    }

    /**
     * @param int $id
     * @param string $url
     * @param int|null $version
     * @return \Illuminate\Http\Response
     */
    public function chronomap($id, $url, $version, $isXXage = false)
    {
        $chronomap = Chronomap::getChronomap($id, $url ,\App::getLocale());
        if(!$chronomap) {
            abort(404);
        }
        if($chronomap->url && !$url) {
            return redirect("/".\App::getLocale()."/map/".$chronomap->url);
        }
        $version = $version ? $version : $chronomap->current_version;
        $discussHref = $chronomap->discuss_href ? $chronomap->discuss_href : self::BLOG_HREF;

        $article = $chronomap->article ? ArticleValue::getArticle($chronomap->article) : '';
        $article = str_replace("\n", "<br>",$article);

        $hreflangs = [];
        if($chronomap->url && $chronomap->other_langs) {
            $hreflangs = [
                'ru'=>'/ru/map/'.$chronomap->url,
                'en'=>'/en/map/'.$chronomap->url,
            ];
        }
        return view('chronomap/chronomap', [
            'env' => \App::environment(),
            'title' => $chronomap->name,
            'lang'=>\App::getLocale(),
            'labels' => Lang::get('messages'),
            'chronomapVersion' => $version,
            'chronomapId'=>$chronomap->id,
	    'chronomapName'=>$chronomap->name,
            'article' => $article,
            'is_begin' => !request()->has('zoom'),
            'seo_keywords'=> $chronomap->seo_keywords,
            'discussHref'=> $discussHref,
	    'image'=> $chronomap->image,
            'hreflangs' => $hreflangs,
            'description'=> $chronomap->description,
            'base_url' => $chronomap->getBaseUrl($version),
            'isMobile' => MobileDetector::isMobileDevice(),
            'isXXage'=> $isXXage
        ]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getByUser(Request $request)
    {
       if (!Auth::check()){
          return response()->json(['result'=>"NO RIGHTS"]);  
       }
       $chronomaps = Chronomap::getByUser($request->user()->id);
       return response()->json(['maps'=>$chronomaps]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function init(Request $request)
    {
        $chronomap = Chronomap::getChronomap($request->get('mapId'));    
        $response = array();
        $version = ChronomapVersion::getVersion($request->get('mapId'), $request->get('version'));
        $response['objects'] = $version->getVersionObjects();
        $user =  Auth::check() ? $request->user() : null;
        $response['rights'] = $chronomap->getMapRights($user);
        $response['user'] = Auth::check() ? $request->user()->getPublicFields() : null;    
        $response['baseUrl'] = $chronomap->getBaseUrl($version->version);

        return response()->json($response);
    }

    /**
     * @param Request $request
     * @param int $mapId
     * @param NotificationService $notificationService
     * @return \Illuminate\Http\Response
     */
    public function createVersion(Request $request, $mapId, NotificationService $notificationService)
    {
        $requestFields = $request->json()->all();
        Log::info($request->json()->all());

        $chronomap = Chronomap::getChronomap($mapId);
        $user =  Auth::check() ? $request->user() : null;    
        $rights = $chronomap->getMapRights($user);  
        if (!$rights) {
            return response()->json(['result'=>"NO RIGHTS"]);
        }
        $newVersionNumber = $chronomap->addNewVersion($requestFields ,$user->id);

        $notificationService->notifyAddChronomapVersion($chronomap->id, $chronomap->name, 
                $requestFields['commitMessage'], $user);
        return response()->json(['result'=>"OK",'version'=>$newVersionNumber]);
    }

    /**
     * @param int $mapId
     * @return \Illuminate\Http\Response
     */
    public function getVersions($mapId)
    {
       $chronomap = Chronomap::getChronomap($mapId);
       $versions = $chronomap->getVersions();
       return response()->json($versions);
    }

    /**
     * @param Request $request
     * @param int $mapId
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $request,$mapId)
    {
        $chronomap = Chronomap::getChronomap($mapId);
        $user =  Auth::check() ? $request->user() : null;    
        $rights = $chronomap->getMapRights($user);  
     
        if ($rights != 'owner') {
            return response()->json(['result'=>"NO RIGHTS"]);  
        }
        $chronomap->setDeleted();
        return response()->json(['result'=>"SUCCESS"]);
    }

    /**
     * @param Request $request
     * @param int $mapId
     * @return \Illuminate\Http\Response
     */
    public function deleteLastVersion(Request $request,$mapId)
    {
        $chronomap = Chronomap::getChronomap($mapId);
        $user =  Auth::check() ? $request->user() : null;    
        $rights = $chronomap->getMapRights($user);  
     
        if ($rights != 'owner') {
            return response()->json(['result'=>"NO RIGHTS"]);  
        }
        $chronomap->deleteLastVersion();
        return response()->json(['result'=>"SUCCESS"]);
    }

    /**
     * @param int $mapId
     * @return \Illuminate\Http\Response
     */
    public function getObjectsGroupedByTypes($mapId)
    {
        $chronomap = Chronomap::getChronomap($mapId ,null ,\App::getLocale());
        $objects = $chronomap->getObjectsGroupedByTypes();
        return response()->json($objects);
    }

    /**
     * @param Request $request
     * @param int $mapId
     * @return \Illuminate\Http\Response
     */
    public function getObjectsByIds(Request $request,$mapId)
    {
        $chronomap = Chronomap::getChronomap($mapId ,null ,\App::getLocale());
        $objectIds = $request->json()->all();
        $objects = $chronomap->getObjectsByIds($objectIds);
        return response()->json($objects);
    }

    /**
     * @param Request $request
     * @param ImageService $imageService
     * @param NotificationService $notificationService
     * @return \Illuminate\Http\Response
     */
    public function create(
        Request $request,
        ImageService $imageService,
        NotificationService $notificationService)
    {
        $requestFields = $request->json()->all();
        $user =  Auth::check() ? $request->user() : null;    
        if (!$user) {
            return response()->json(['result'=>"NO RIGHTS"]);
        }
        $chronomap = Chronomap::createChronomap(
            $requestFields['name'],
            $requestFields['image'],
            $requestFields['description'],
            $requestFields['lang'],
            $requestFields['article'],
            isset($requestFields['discussHref']) ? $requestFields['discussHref'] : null,
            isset($requestFields['copyOfMapId']) ? $requestFields['copyOfMapId'] : null,
            isset($requestFields['mapTypeOptions']) ? $requestFields['mapTypeOptions'] : null,
            $imageService
        );
        
        $chronomap->addNewVersion($requestFields ,$user->id);
        $notificationService->notifyCreateChronomap($requestFields, $user);
        return response()->json(['result'=>"OK",'mapId'=>$chronomap->id]);
    }

    /**
     * @param Request $request
     * @param string $lang
     * @param int $mapId
     * @return \Illuminate\Http\Response
     */
    public function chronomapDiscuss(Request $request, $lang, $mapId)
    {
 	    $chronomap = Chronomap::getChronomap($mapId);
	    return view(
	        'chronomap/discuss', [
            'env' => \App::environment(),
            'title' => $chronomap->name,
	        'chronomapId' => $chronomap->id,
            'labels' => Lang::get('messages'), 
            'lang'=>\App::getLocale(),
	        'comments'=> \App\Comment::getList('chronomap', $mapId)
        ]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function chronomapComment(Request $request)
    {
        $fields = $request->json()->all();
        
        $comment = new Comment;
        $comment->email = $fields['email'] ?? '';
        $comment->map_id = $fields['mapId'];
        $comment->subject = $fields['subject'] ?? '';
        $comment->message = $fields['message'] ?? '';
        $comment->user_id = $request->user() ? $request->user()->id : null;
        $comment->is_mobile = MobileDetector::isMobileDevice();
        $comment->save();
        return response()->json(['result'=>"OK"]);
    }
    
    public function mapInfoById(Request $request, $lang, $id)
    {
        return $this->mapInfo($request, $id, null);
    }
    
    public function mapInfoByUrl(Request $request, $lang, $url)
    {
        return $this->mapInfo($request, null, $url);
    }
    
    public function mapInfo(Request $request, $id, $url)
    {
        $chronomap = Chronomap::getChronomap($id, $url ,\App::getLocale());
        if(!$chronomap) {
            abort(404);
        }
        Tracking::insert("Open map info: ".$id." ".$url." (".$chronomap->name.")", session()->getId(), MobileDetector::isMobileDevice(), $request->user() ? $request->user()->email : '', \App::getLocale());
  
        if($chronomap->url && !$url) {
            return redirect("/".\App::getLocale()."/".$chronomap->url);
        }
        
        $hreflangs = [];
        if($chronomap->url && $chronomap->other_langs) {
            $hreflangs = [
                'ru'=>'/ru/'.$chronomap->url,
                'en'=>'/en/'.$chronomap->url,
            ];
        }
        
        $article = $chronomap->article ? ArticleValue::getArticle($chronomap->article) : '';
        $article = str_replace("\n", "<br>",$article);
    
        if(!$article) {
            return redirect($chronomap->getMapLink());
        }
        return view('map_info/map', [
            'env' => \App::environment(),
            'chronomap' => $chronomap,
            'article'=>$article,
            'hreflangs' => $hreflangs,
            'lang'=>\App::getLocale(),
            'labels' => Lang::get('messages'),
            'isMobile' => MobileDetector::isMobileDevice()
        ]);
    }
    
     public function chainByIdAndMapId($lang, $mapId, $chainId)
    {
        return $this->chainInfo($mapId, null, $chainId, null );
    }
    
    public function chainByIdAndMapUrl($lang, $mapUrl, $chainId)
    {
        return $this->chainInfo(null, $mapUrl, $chainId, null);
    }
    
     public function chainInfo($id, $url, $chainId, $chainUrl)
    {
        $chronomap = Chronomap::getChronomap($id, $url ,\App::getLocale());
        if(!$chronomap) {
            abort(404);
        }
       
        $chain = $chronomap->getChain($chainId, $chainUrl);
        if(!$chain) {
            abort(404);
        }
        
        $article = isset($chain['article']) && $chain['article'] ? ArticleValue::getArticle($chain['article']) : '';
        $article = str_replace("\n", "<br>",$article);
   
       
        return view('map_info/chain', [
            'env' => \App::environment(),
            'chronomap' => $chronomap,
            'article'=>$article,
            'chain'=>$chain,
            'lang'=>\App::getLocale(),
            'labels' => Lang::get('messages'),
            'isMobile' => MobileDetector::isMobileDevice()
        ]);
    }
    
    
}
