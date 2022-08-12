<?php

namespace App\Http\Middleware;

use Closure;
use Session;
use \App\Http\Middleware\Redirect;
/**
 * Class Lang
 * @package App\Http\Middleware
 */
class Lang
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        app()->setLocale($request->lang);
          
        return $next($request);
    }
}
