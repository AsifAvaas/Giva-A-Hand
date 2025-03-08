<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RequestController;
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
Route::put('/admin/approve/{status}', [ProfileController::class, 'approveUser']);


Route::get('/allUsers', [UserController::class, 'getAllUsers']);
Route::get('/volunteers/users', [UserController::class, 'getVolunteers']);
Route::get('/doctors/users', [UserController::class, 'getDoctors']);
Route::get('/donors/users', [UserController::class, 'getDonors']);




Route::post('/request', [RequestController::class, 'Request']);
Route::put('/request/approve', [RequestController::class, 'ApproveRequest']);
Route::post('/request/user', [RequestController::class, 'UserRequest']);
Route::post('/request/helper', [RequestController::class, 'HelperRequest']);
Route::get('/request/{id}', [RequestController::class, 'RequestById']);


Route::post('/notice', [NoticeController::class, 'createNotice']);
Route::put('/notice/{notice_id}', [NoticeController::class, 'updateNotice']);
Route::get('/notice', [NoticeController::class, 'getAllNotices']);
Route::get('/notice/{id}', [NoticeController::class, 'getNoticeById']);
Route::post('/noticeGet', [NoticeController::class, 'addUserToNotice']);



Route::post('/notifications/unread', [NotificationController::class, 'getUnreadNotifications']);
Route::post('/notifications/all', [NotificationController::class, 'getAllNotifications']);
Route::post('/notifications/read/{id}', [NotificationController::class, 'markAsRead']);
Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);


Route::post('/chat/start', [ChatController::class, 'startConversation']);
Route::post('/chat/send', [ChatController::class, 'sendMessage']);
Route::get('/chat/messages/{conversationId}', [ChatController::class, 'getMessages']);



