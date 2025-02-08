<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Hash;

use Laravel\Sanctum\PersonalAccessToken;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $email = $request->input("email");
        $password = $request->input("password");
        $role = $request->input("role");
        $id = "";
        if ($role === "admins") {
            $user = Admin::where("email", $email)->first();
            $id = $user->admin_id;
        } else if ($role === "users") {
            $user = User::where("email", $email)->first();
            $id = $user->user_id;
        } else {
            return response()->json([
                "success" => false,
                "message" => "User not found"
            ], 401);
        }

        if (!Hash::check($password, $user->password)) {
            return response()->json([
                "success" => false,
                "message" => "Invalid Password"
            ], 401);
        }

        // Generate the API token
        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'userId' => $id,
            'token' => $token,
            'role' => $role,
        ], 201);
    }


    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json([
                'message' => 'Token not provided'
            ], 401);
        }

        $accessToken = PersonalAccessToken::findToken($token);
        if (!$accessToken) {
            return response()->json([
                'message' => 'Invalid token'
            ], 401);
        }
        $accessToken->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);

    }
}
