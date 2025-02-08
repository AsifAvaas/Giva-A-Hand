<?php
namespace App\Http\Controllers;

use App\Models\BloodDonors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class BloodDonorController extends Controller
{
    public function getProfile(Request $request)
    {

        $bloodDonorId = $request->input('userId');


        $bloodDonor = BloodDonors::find($bloodDonorId);

        if (!$bloodDonor) {
            return response()->json(['success' => false, 'message' => 'Blood donor not found'], 404);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'userId' => $bloodDonor->blood_donor_id,
                'name' => $bloodDonor->name,
                'email' => $bloodDonor->email,
                'phone' => $bloodDonor->phone ?? null,
                'blood_group' => $bloodDonor->blood_group ?? null,
                'last_donation' => $bloodDonor->last_donation ?? null,
                'address' => $bloodDonor->address ?? null,
                'profile_pic' => $bloodDonor->profile_pic ?? null,
                'approved' => $bloodDonor->approved ?? null,
            ]
        ], 200);
    }

    public function updateProfile(Request $request)
    {

        $bloodDonorId = $request->input('userId');



        $bloodDonor = BloodDonors::find($bloodDonorId);

        if (!$bloodDonor) {
            return response()->json(['success' => false, 'message' => 'Blood donor not found'], 404);
        }


        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:blood_donors,email,' . $bloodDonor->id,
            'password' => 'nullable|min:8|required_with:confirm_password|same:confirm_password',
            'confirm_password' => 'nullable|min:8',
            'phone' => 'nullable|string|max:255',
            'blood_group' => 'nullable|string|max:10',
            'last_donation' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'profile_pic' => 'nullable|url',
            'approved' => 'nullable|boolean'
        ]);


        $bloodDonor->update([
            'name' => $request->input('name', $bloodDonor->name),
            'email' => $request->input('email', $bloodDonor->email),
            'phone' => $request->input('phone', $bloodDonor->phone),
            'blood_group' => $request->input('blood_group', $bloodDonor->blood_group),
            'last_donation' => $request->input('last_donation', $bloodDonor->last_donation),
            'address' => $request->input('address', $bloodDonor->address),
            'profile_pic' => $request->input('profile_pic', $bloodDonor->profile_pic),
            'approved' => $request->input('approved', $bloodDonor->approved),
            'password' => $request->filled('password') ? Hash::make($request->password) : $bloodDonor->password,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => [
                'userId' => $bloodDonor->blood_donor_id,
                'name' => $bloodDonor->name,
                'email' => $bloodDonor->email,
                'phone' => $bloodDonor->phone ?? null,
                'blood_group' => $bloodDonor->blood_group ?? null,
                'last_donation' => $bloodDonor->last_donation ?? null,
                'address' => $bloodDonor->address ?? null,
                'profile_pic' => $bloodDonor->profile_pic ?? null,
                'approved' => $bloodDonor->approved ?? null,

            ]
        ], 200);
    }
}
