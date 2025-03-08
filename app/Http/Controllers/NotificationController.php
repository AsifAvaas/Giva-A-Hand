<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Fetch Unread Notifications
    public function getUnreadNotifications(Request $request)
    {
        $user = User::where('user_id', $request->user_id)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'success' => true,
            'notifications' => $user->unreadNotifications
        ]);
    }

    // Fetch All Notifications (Read & Unread)
    public function getAllNotifications(Request $request)
    {
        $user = User::where('user_id', $request->user_id)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'success' => true,
            'notifications' => $user->notifications
        ]);
    }

    // Mark a Single Notification as Read
    public function markAsRead(Request $request, $notificationId)
    {
        $user = User::where('user_id', $request->user_id)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $notification = $user->notifications()->where('id', $notificationId)->first();

        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $notification->markAsRead();

        return response()->json(['success' => true, 'message' => 'Notification marked as read']);
    }

    // Mark All Notifications as Read
    public function markAllAsRead(Request $request)
    {
        $user = User::where('user_id', $request->user_id)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->unreadNotifications->markAsRead();

        return response()->json(['success' => true, 'message' => 'All notifications marked as read']);
    }
}
