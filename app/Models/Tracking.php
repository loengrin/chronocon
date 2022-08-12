<?php

namespace App\Models;

use Cache;
use Config;
use DB;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Tracking
 * @package App\Models
 */
class Tracking extends Model
{
    protected $table = "tracking";
    /**
     * @param array $value
     * @return string
     */
    public static function insert($action, $sessionId, $isMobile, $email, $lang='')
    {
        $object = new Tracking;
        $object->action = $action;
        $object->session_id = $sessionId;
        $object->is_mobile = $isMobile;
        $object->email = $email;
        $object->lang = $lang;
        $object->created_at = date('Y-m-d H:i:s');
        $object->save();
    }
}
