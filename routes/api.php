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


Route::post("/profile", [UserController::class, "getProfile"]);
Route::post("/updateProfile", [UserController::class, "updateProfile"]);

Route::post('/admins/profile', [AdminController::class, 'getProfile']);
Route::post('/admins/updateProfile', [AdminController::class, 'updateProfile']);

// Route::post('/blood_donors/profile', [BloodDonorController::class, 'getProfile']);
// Route::post('/blood_donors/updateProfile', [BloodDonorController::class, 'updateProfile']);

// Route::post('/recievers/profile', [RecieverController::class, 'getProfile']);
// Route::post('/recievers/updateProfile', [RecieverController::class, 'updateProfile']);

// Route::post('/volunteer_infos/profile', [VolunteerInfoController::class, 'getProfile']);
// Route::post('/volunteer_infos/updateProfile', [VolunteerInfoController::class, 'updateProfile']);