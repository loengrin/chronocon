<?php

namespace App\Providers;

use \App\Services\ImageService;
use Illuminate\Support\ServiceProvider;

class ImageServiceProvider extends ServiceProvider
{
    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register() 
    {
        $this->app->singleton('ImageService', function($app)
        {
            return new ImageService();
        });
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return ['\App\Services\ImageService'];
    }

}