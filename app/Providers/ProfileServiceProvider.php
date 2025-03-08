<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\ProfileService;

class ProfileServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(ProfileService::class, function ($app) {
            return new ProfileService();
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
