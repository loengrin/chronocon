<?php

namespace App\Providers;

use \App\Services\NotificationService;
use Illuminate\Support\ServiceProvider;

class NotificationServiceProvider extends ServiceProvider
{
    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register() 
    {
        $this->app->singleton('NotificationService', function($app)
        {
            return new NotificationService();
        });
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return ['\App\Services\NotificationService'];
    }

}