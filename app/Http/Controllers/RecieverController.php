<?php
namespace App\Http\Controllers;

use App\Models\Recievers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RecieverController extends Controller
{
    public function getProfile(Request $request)
    {
        
        $recieverId = $request->input('reciever_id');
        $role = $request->input('role');

        
        if ($role !== 'recievers') {
            return response()->json(['success' => false, 'message' => 'Unauthorized access'], 403);
        }

        
        $reciever = Recievers::find($recieverId);

        if (!$reciever) {
            return response()->json(['success' => false, 'message' => 'Reciever not found'], 404);
        }

        return response()->json([
            'success' => true,
            'reciever' => [
                'id' => $reciever->id,
                'name' => $reciever->name,
                'email' => $reciever->email,
                'phone' => $reciever->phone ?? null,
                'reason' => $reciever->reason ?? null,
                'address' => $reciever->address ?? null,
                'profile_pic' => $reciever->profile_pic ?? null,
                'approved' => $reciever->approved ?? null,
            ]
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        
        $recieverId = $request->input('reciever_id');
        $role = $request->input('role');

        
        if ($role !== 'recievers') {
            return response()->json(['success' => false, 'message' => 'Unauthorized access'], 403);
        }

        
        $reciever = Recievers::find($recieverId);

        if (!$reciever) {
            return response()->json(['success' => false, 'message' => 'Reciever not found'], 404);
        }

        
        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:recievers,email,' . $reciever->id,
            'password' => 'nullable|min:8|required_with:confirm_password|same:confirm_password',
            'confirm_password' => 'nullable|min:8',
            'phone' => 'nullable|string|max:255',
            'reason' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'profile_pic' => 'nullable|url',
            'approved' => 'nullable|boolean'
        ]);

        
        $reciever->update([
            'name' => $request->input('name', $reciever->name),
            'email' => $request->input('email', $reciever->email),
            'phone' => $request->input('phone', $reciever->phone),
            'reason' => $request->input('reason', $reciever->reason),
            'address' => $request->input('address', $reciever->address),
            'profile_pic' => $request->input('profile_pic', $reciever->profile_pic),
            'approved' => $request->input('approved', $reciever->approved),
            'password' => $request->filled('password') ? Hash::make($request->password) : $reciever->password,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'reciever' => [
                'id' => $reciever->id,
                'name' => $reciever->name,
                'email' => $reciever->email,
                'phone' => $reciever->phone ?? null,
                'reason' => $reciever->reason ?? null,
                'address' => $reciever->address ?? null,
                'profile_pic' => $reciever->profile_pic ?? null,
                'approved' => $reciever->approved ?? null,
                
            ]
        ], 200);
    }
}
