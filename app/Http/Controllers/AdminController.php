<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function getProfile(Request $request)
    {
        
        $adminId = $request->input('admin_id');
        $role = $request->input('role');

        
        if ($role !== 'admins') {
            return response()->json(['success' => false, 'message' => 'Unauthorized access'], 403);
        }

        
        $admin = Admin::find($adminId);

        if (!$admin) {
            return response()->json(['success' => false, 'message' => 'Admin not found'], 404);
        }

        return response()->json([
            'success' => true,
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'phone' => $admin->phone ?? null,
                
            ]
        ], 200);
    }

    public function updateProfile(Request $request)
{
    
    $adminId = $request->input('admin_id');
    $role = $request->input('role');

    
    if ($role !== 'admins') {
        return response()->json(['success' => false, 'message' => 'Unauthorized access'], 403);
    }

    
    $admin = Admin::find($adminId);

    if (!$admin) {
        return response()->json(['success' => false, 'message' => 'Admin not found'], 404);
    }

    
    $request->validate([
        'name' => 'nullable|string|max:255',
        'email' => 'nullable|email|unique:admins,email,' . $admin->id,
        'password' => 'nullable|min:8|required_with:confirm_password|same:confirm_password',
        'confirm_password' => 'nullable|min:8',
        'phone' => 'nullable|string|max:255'
    ]);

    
    $admin->update([
        'name' => $request->input('name', $admin->name),
        'email' => $request->input('email', $admin->email),
        'password' => $request->filled('password') ? Hash::make($request->password) : $admin->password,
        'phone' => $request->input('phone', $admin->phone),
    ]);

    
    return response()->json([
        'success' => true,
        'message' => 'Profile updated successfully',
        'admin' => [
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
            'phone' => $admin->phone ?? null,
        ]
    ], 200);
}

}
