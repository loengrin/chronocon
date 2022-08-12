<?php

namespace App\Providers;

use \App\Services\Sha1Hasher;
use Illuminate\Support\ServiceProvider;

class Sha1HashServiceProvider extends ServiceProvider 
{
    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register() 
    {
        $this->app['hash'] = $this->app->share(function () 
        {
            return new Sha1Hasher();
        });
    }
    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides() 
    {
        return array('hash');
    }
}