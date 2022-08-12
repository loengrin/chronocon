<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Libs\ULogin;

/**
 * Class User
 * @package App\Models
 */
class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'login','about','is_subscribed'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * @param string $login
     * @return mixed
     */
    public static function getUserByLogin($login)
    {
         return self::where('login','=',$login)->get()->first();
    }

    /**
     * @return array
     */
    public function getPublicFields()
    {
        $columns = $this->getFillable();      
        $attributes = $this->getAttributes();
        $publicAttrs = [];
        foreach ($columns as $column) {
            if (array_key_exists($column, $attributes) && $column != 'password' ) {
                $publicAttrs[$column] = $attributes[$column];
            }
        }
        $publicAttrs['id'] = $attributes['id'];
        return $publicAttrs;
    }

    /**
     * @param string $token
     * @return User
     */
    public static function getByToken($token)
    {
        $s = file_get_contents('https://ulogin.ru/token.php?token=' . $token. '&host=' . $_SERVER['HTTP_HOST']);
        $userFromApi = json_decode($s, true);
        $user = self::where('social_network',$userFromApi['network'])->where('social_id',$userFromApi['identity'])->get()->first();
        if (!$user){
            $user = new User();
            $user->login = ULogin::generateNickname(function ($login){
              User::getUserByLogin($login);
            }, $userFromApi['nickname']);

            $user->name = $userFromApi['first_name']." ".$userFromApi['last_name'];
            $user->email = $userFromApi['email'];
            $user->social_network = $userFromApi['network'];
            $user->social_id = $userFromApi['identity'];
            $user->lang = \App::getLocale();
            $user->save();
        }
        return $user;
    }
    
}
