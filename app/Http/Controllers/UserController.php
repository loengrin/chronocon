<?php

namespace App\Http\Controllers;

use Auth;
use Hash;

use App\Models\Chronomap;
use App\Models\User;
use App\Models\Tracking;
use App\Services\NotificationService;
use App\Libs\MobileDetector;

use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;

/**
 * Class UserController
 * @package App\Http\Controllers
 */
class UserController extends Controller
{
    /**
     * @param Request $request
     * @param null $login
     * @return \Illuminate\Http\Response
     */
    public function get(Request $request, $login=null)
    {
        if ($login){
            $user = User::getUserByLogin($login);
        }
        else {
            $user = Auth::check() ? $request->user() : null;
        }
        return response()->json($user ? $user->getPublicFields() : null);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function signin(Request $request)
    {
        if ($request->json()->has('token')){
	        return $this->signinSocial($request);
        }
        $userdata = array(
            'login'  =>  $request->json()->get('login'),
            'password'  => $request->json()->get('password'),
            'social_network' => null
        );
        if (Auth::attempt($userdata)) {    
            $rights = null;
            if ($request->get('mapId')){
                $chronomap = Chronomap::getChronomap($request->get('mapId'));
                $rights = $chronomap->getMapRights($request->user());   
            }
            
            return response()->json(['user'=>$request->user()->getPublicFields(),'rights'=>$rights]);
        }
        else {
            return response()->json(false);
        }
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function signout(Request $request)
    {
        Auth::logout(); 
        $rights = null;
        if ($request->get('mapId'))
        {
            $chronomap = Chronomap::getChronomap($request->get('mapId'));
            $rights = $chronomap->getMapRights($request->user());   
        }
        return response()->json(['rights'=>$rights]);
    }

    /**
     * @param Request $request
     * @param NotificationService $notificationService
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request, NotificationService $notificationService)
    {
        if (User::where('login','=',$request->json()->get('login'))->count()){
             return response()->json(false);
        }
        $request->merge(['password' => Hash::make($request->json()->get('password'))]);                
      
        $user = User::create($request->json()->all());
        $user->password = Hash::make($request->json()->get('password'));
        $user->lang = \App::getLocale();
        $user->save();
        Auth::login($user);
        $rights = null;
        if ($request->get('mapId'))
        {
            $chronomap = Chronomap::getChronomap($request->get('mapId'));
            $rights = $chronomap->getMapRights($user);   
        }
        $notificationService->notifyRegister($request->json()->all(), $user);
        return response()->json(['id'=>$user->id,'rights'=>$rights]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $fields = $request->json()->all();
        if (!isset($fields['password']) || !$fields['password']){
            unset($fields['password']);
        }
        else {
            $fields['password'] = Hash::make($fields['password']);
        }
        unset($fields['passwordAgain']);
        User::where('login','=',$fields['login'])->update($fields);
        return response()->json(true);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function signinSocial(Request $request)
    {
 	$token = $request->json()->get('token');
        if ($user = User::getByToken($token)) {
            Auth::login($user);
            $rights = null;
            if ($request->get('mapId')){
                $chronomap = Chronomap::getChronomap($request->get('mapId'));
                $rights = $chronomap->getMapRights($request->user());
            }

            return response()->json(['user'=>$request->user()->getPublicFields(),'rights'=>$rights]);
        }
        else {
            return response()->json(false);
        }
    }

    /**
     * 
     * @param Request $request
     * @return type
     */
    public function insertTracking(Request $request, $action)
    {
        Tracking::insert($action, session()->getId(), MobileDetector::isMobileDevice(), $request->user() ? $request->user()->email : '');
        return response()->json(true);
    }
}
