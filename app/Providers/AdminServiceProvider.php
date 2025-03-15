<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\AdminService;

class AdminServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(AdminService::class, function ($app) {
            return new AdminService();
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
