<?php
namespace App\Http\Controllers;

use App\Models\VolunteerInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class VolunteerInfoController extends Controller
{
    public function getProfile(Request $request)
    {
        
        $volunteerId = $request->input('volunteer_id');
        $role = $request->input('role');

        
        if ($role !== 'volunteer_infos') {
            return response()->json(['success' => false, 'message' => 'Unauthorized access'], 403);
        }

        
        $volunteer = VolunteerInfo::find($volunteerId);

        if (!$volunteer) {
            return response()->json(['success' => false, 'message' => 'Volunteer not found'], 404);
        }

        return response()->json([
            'success' => true,
            'volunteer' => [
                'id' => $volunteer->id,
                'name' => $volunteer->name,
                'email' => $volunteer->email,
                'phone' => $volunteer->phone ?? null,
                'address' => $volunteer->address ?? null,
                'skills' => $volunteer->skills ?? null,
                'availability' => $volunteer->availability ?? null,
                'profile_pic' => $volunteer->profile_pic ?? null,
                'approved' => $volunteer->approved ?? null,
            ]
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        
        $volunteerId = $request->input('volunteer_id');
        $role = $request->input('role');

        
        if ($role !== 'volunteer_infos') {
            return response()->json(['success' => false, 'message' => 'Unauthorized access'], 403);
        }

        
        $volunteer = VolunteerInfo::find($volunteerId);

        if (!$volunteer) {
            return response()->json(['success' => false, 'message' => 'Volunteer not found'], 404);
        }

       
        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:volunteer_infos,email,' . $volunteer->id,
            'password' => 'nullable|min:8|required_with:confirm_password|same:confirm_password',
            'confirm_password' => 'nullable|min:8',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'skills' => 'nullable|string|max:255',
            'availability' => 'nullable|string|max:255',
            'profile_pic' => 'nullable|url',
            'approved' => 'nullable|boolean'
        ]);

        
        $volunteer->update([
            'name' => $request->input('name', $volunteer->name),
            'email' => $request->input('email', $volunteer->email),
            'phone' => $request->input('phone', $volunteer->phone),
            'address' => $request->input('address', $volunteer->address),
            'skills' => $request->input('skills', $volunteer->skills),
            'availability' => $request->input('availability', $volunteer->availability),
            'profile_pic' => $request->input('profile_pic', $volunteer->profile_pic),
            'approved' => $request->input('approved', $volunteer->approved),
            'password' => $request->filled('password') ? Hash::make($request->password) : $volunteer->password,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'volunteer' => [
                'id' => $volunteer->id,
                'name' => $volunteer->name,
                'email' => $volunteer->email,
                'phone' => $volunteer->phone ?? null,
                'address' => $volunteer->address ?? null,
                'skills' => $volunteer->skills ?? null,
                'availability' => $volunteer->availability ?? null,
                'profile_pic' => $volunteer->profile_pic ?? null,
                'approved' => $volunteer->approved ?? null,
                
            ]
        ], 200);
    }
}
