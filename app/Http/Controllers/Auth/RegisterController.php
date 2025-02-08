<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;


use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        try {

            $role = $request->input("role");
            $name = $request->input("name");
            $email = $request->input("email");
            $password = $request->input("password");
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => "required|string|email|max:255|unique:$role",
                'password' => 'required|string|min:8',
            ]);

            if ($role === 'admins') {
                Admin::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => Hash::make($password),
                ]);
                return response()->json(['success' => 'true', 'message' => 'Admin created successfully'], 201);
            } else if ($role === 'users') {
                User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => Hash::make($password),
                ]);
                return response()->json(['success' => 'true', 'message' => 'User created successfully'], 201);
            }


            return response()->json(['success' => 'false', 'message' => 'Role not found'], 404);
        } catch (ValidationException $e) {
            // Return a 400 Bad Request with validation errors
            return response()->json([
                'success' => 'false',
                'message' => 'Invalid Credentials',
                'errors' => $e->errors(),
            ], 400);
        } catch (\Exception $e) {
            // Catch all other exceptions and return a 500 status
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
