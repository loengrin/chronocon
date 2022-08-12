<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use App\Libs\MobileDetector;
use App\Models\Tracking;

/**
 * Class PageController
 * @package App\Http\Controllers
 */
class PageController extends Controller
{
    /**
     * @return array
     */
    public static function getMenu()
    {
        $lang = \App::getLocale();
        
        if($lang == 'ru') {
            return [''=>'Maps',
                'about'=>'About',
 		'progress'=>'Plans',
                'docs'=>'Docs',
                config('app.discuss_url')=>'Discuss',
                'donate'=>'Donate'
            ];
        }
        else {
            return [''=>'Maps',               
                'about'=>'About',
                'docs'=>'Docs',
                'donate'=>'Donate',
                 config('app.en_discuss_url')=>'Discuss',
                'contacts'=>'Contacts'];
        }
    }

    public static function getDocPages()
    {
        return [
            '1'=>'Introduction',
            '2'=>'Map creation',
            '3'=>'Objects (Properties)',
            '4'=>'Objects (Editing on the map)',
            '5'=>'Events'
        ];
    }

    /**
     * @param string $lang
     * @return \Illuminate\Http\Response
     */
    public function about(Request $request, $lang)
    {
         return $this->page($request, $lang, 'about');
    }

    /**
     * @param string $lang
     * @return \Illuminate\Http\Response
     */
    public function contacts(Request $request, $lang)
    {
         return $this->page($request, $lang, 'contacts');
    }

    /**
     * @param string $lang
     * @return \Illuminate\Http\Response
     */
    public function donate(Request $request, $lang)
    {
         return $this->page($request, $lang, 'donate');
    }

    /**
     * @param string $lang
     * @return \Illuminate\Http\Response
     */
    public function docs(Request $request, $lang, $pageNumber = null)
    {
         return $this->docPage($request, $lang, $pageNumber);
    }

    /**
     * @param string $lang
     * @return \Illuminate\Http\Response
     */
    public function progress(Request $request, $lang)
    {
         return $this->page($request, $lang, 'progress');
    }

    /**
     * @param string $lang
     * @param string $page
     * @return \Illuminate\Http\Response
     */
    public function page(Request $request, $lang, $page)
    {
        Tracking::insert("Open page: ".$page, session()->getId(), MobileDetector::isMobileDevice(), $request->user() ? $request->user()->email : '', \App::getLocale());
  
        $pages = self::getMenu();
        if (!isset($pages[$page])){
            return redirect('/'.$lang);
        }
        return view('static_pages/'.\App::getLocale().'/'.$page, [
            'env' => \App::environment(),
            'title' => $pages[$page],
            'page'=>$page,
            'lang'=>\App::getLocale(),
            'labels' => Lang::get('messages'),
            'isMobile' => MobileDetector::isMobileDevice(),
            'hreflangs' => ['ru'=>'/ru/'.$page,'en'=>'/en/'.$page]
        ]);
    }

    /*
     * @param string $lang
     * @param integer $pageNumber
     */
    public function docPage(Request $request, $lang,  $pageNumber = null)
    {
        $docPages = self::getDocPages();
        $pages = self::getMenu();
        if ($pageNumber && !isset($docPages[$pageNumber])){
            return redirect('/'.$lang."/docs");
        }
        Tracking::insert("Open doc page: ".($pageNumber ? $pageNumber : 'index'), session()->getId(), MobileDetector::isMobileDevice(), $request->user() ? $request->user()->email : '', \App::getLocale());
  
        return view('static_pages/'.\App::getLocale().'/docs/'.($pageNumber ? 'doc'.$pageNumber : 'index'), [
            'env' => \App::environment(),
            'title' => $pageNumber ? $docPages[$pageNumber] : $pages['docs'],
            'pageNumber'=>$pageNumber,
            'docPages'=>$docPages,
            'lang'=>\App::getLocale(),
            'labels' => Lang::get('messages'),
            'isMobile' => MobileDetector::isMobileDevice(),
            'hreflangs' => ['ru'=>'/ru/docs'.($pageNumber ? '/'.$pageNumber : '') ,'en'=>'/en/docs'.($pageNumber ? '/'.$pageNumber : '')]
        ]);
    }
}


