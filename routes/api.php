<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post("/register", [RegisterController::class, "register"]);
// Route::post("/login", [LoginController::class, "login"]);
Route::middleware([EnsureFrontendRequestsAreStateful::class])->post('/login', [LoginController::class, 'login']);
Route::post("/logout", [LoginController::class, "logout"]);


Route::get("/profileInfo", [UserController::class, "getUserInfo"]);


