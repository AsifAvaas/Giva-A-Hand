<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\BloodDonorController;
use App\Http\Controllers\RecieverController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VolunteerInfoController;
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

Route::get('/admin/profile', [AdminController::class, 'getProfile']);
Route::post('/admin/updateProfile', [AdminController::class, 'updateProfile']);

Route::get('/blood-donor/profile', [BloodDonorController::class, 'getProfile']);
Route::post('/blood-donor/updateProfile', [BloodDonorController::class, 'updateProfile']);

Route::get('/reciever/profile', [RecieverController::class, 'getProfile']);
Route::post('/reciever/updateProfile', [RecieverController::class, 'updateProfile']);

Route::get('/volunteer/profile', [VolunteerInfoController::class, 'getProfile']);
Route::post('/volunteer/updateProfile', [VolunteerInfoController::class, 'updateProfile']);