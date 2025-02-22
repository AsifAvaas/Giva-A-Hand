<?php
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;



Route::post('/admin/register', [AdminController::class, 'register']);
Route::post('/admin/login', [AdminController::class, 'login']);



Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);

Route::post('/profile', [ProfileController::class, 'getProfile']);
Route::put('/profile', [ProfileController::class, 'updateProfile']);
Route::post('/volunteer/profile', [ProfileController::class, 'getVolunteerProfile']);
Route::put('/volunteer/profile', [ProfileController::class, 'updateVolunteerProfile']);
Route::post('/bloodDonor/profile', [ProfileController::class, 'getBloodDonorProfile']);
Route::put('/bloodDonor/profile', [ProfileController::class, 'updateBloodDonorProfile']);
Route::post('/doctor/profile', [ProfileController::class, 'getDoctorProfile']);
Route::put('/doctor/profile', [ProfileController::class, 'updateDoctorProfile']);
Route::post('/admin/profile', [ProfileController::class, 'getAdminProfile']);
Route::put('/admin/profile', [ProfileController::class, 'updateAdminProfile']);
Route::put('/admin/approve/{data}', [ProfileController::class, 'approveUser']);


Route::get('/allUsers', [UserController::class, 'getAllUsers']);
Route::get('/volunteers/users', [UserController::class, 'getVolunteers']);
Route::get('/doctors/users', [UserController::class, 'getDoctors']);
Route::get('/donors/users', [UserController::class, 'getDonors']);
