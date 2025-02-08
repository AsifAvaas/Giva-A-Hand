<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function getProfile(Request $request)
    {

        $userId = $request->input('user_Id');


        $user = User::find($userId);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        return response()->json([
            'success' => true,

            'user' => $user,

        ], 200);
    }


    public function updateProfile(Request $request)
    {
        $userId = $request->input('user_Id'); // Ensure correct key case
        $user = User::find($userId);


        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        // Validation
        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => "nullable|email|unique:users,email,{$user->user_id},user_id", // Fixed unique rule
            'password' => 'nullable|min:8|same:confirm_password', // Removed required_with
            'confirm_password' => 'nullable|min:8',
            'phone' => 'nullable|string|max:255'
        ]);

        // Update fields
        $user->update([
            'name' => $request->input('name', $user->name),
            'email' => $request->input('email', $user->email),
            'password' => $request->filled('password') ? Hash::make($request->password) : $user->password,
            'phone' => $request->input('phone', $user->phone),
            'address' => $request->input('address', $user->address),
            'profile_pic' => $request->input('profile_pic', $user->profile_pic),
            'role' => $request->input('role', $user->role),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user,
        ], 201);
    }




}
