<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\NoticeService;

class NoticeServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(NoticeService::class, function () {
            return new NoticeService();
        });
    }
}
