<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class UserController extends Controller
{
    public function getUserInfo(Request $request)
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
        $user = $accessToken->tokenable;
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }


        return response()->json(['user' => $user], 200);










    }


}
