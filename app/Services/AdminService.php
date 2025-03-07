<?php

namespace App\Services;

use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use Illuminate\Support\Facades\Validator;

class AdminService
{
    public function register($data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return ['error' => $validator->errors()];
        }

        $admin = Admin::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        return [
            'success' => true,
            'message' => 'Admin registered successfully',
            'adminId' => $admin->admin_id,
        ];
    }

    public function login($data)
    {
        $validator = Validator::make($data, [
            'email' => 'required|string|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return ['error' => $validator->errors()];
        }

        $admin = Admin::where('email', $data['email'])->first();

        if (!$admin || !Hash::check($data['password'], $admin->password)) {
            return ['error' => 'Invalid credentials'];
        }

        $token = $admin->createToken('authToken')->plainTextToken;

        return [
            'success' => true,
            'message' => 'Login successful',
            'adminId' => $admin->admin_id,
            'token' => $token,
        ];
    }
}
