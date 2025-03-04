<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{

    public function getProfile(Request $request)
    {
        $userId = $request->input('user_Id');


        $user = DB::select("SELECT * FROM users WHERE user_id = ?", [$userId]);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 500);
        }

        return response()->json(['success' => true, 'user' => $user], 201);
    }


    public function updateProfile(Request $request)
    {
        $userId = $request->input('user_Id');

        $user = DB::table('users')->where('user_id', $userId)->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        // Prepare update data
        $updateData = [
            'name' => $request->input('name'),
            'phone' => $request->input('phone'),
            'address' => $request->input('address'),
            'profile_pic' => $request->input('profile_pic')
        ];

        // Remove null values to prevent overwriting with NULL
        // $updateData = array_filter($updateData, fn($value) => !is_null($value));

        // Update user data in the database
        $updated = DB::table('users')->where('user_id', $userId)->update($updateData);

        return $updated
            ? response()->json(['success' => true, 'message' => 'Profile updated'], 201)
            : response()->json(['success' => false, 'message' => 'No changes made'], 400);
    }



    public function getVolunteerProfile(Request $request)
    {
        $userId = $request->input('user_Id');

        $volunteer = DB::select("SELECT * FROM volunteers WHERE user_id = ?", [$userId]);

        if (!$volunteer) {
            return response()->json(['success' => false, 'message' => 'Volunteer not found'], 500);
        }

        return response()->json(['success' => true, 'volunteer' => $volunteer], 201);
    }


    public function updateVolunteerProfile(Request $request)
    {
        $userId = $request->input('user_Id');
        $skills = $request->input('skills');
        $availability = $request->input('availability');

        $sql = 'UPDATE volunteers SET skills = ?, availability = ? WHERE user_id = ?';
        $values = [$skills, $availability, $userId];
        $result = DB::update($sql, $values);

        if ($result) {
            return response()->json(['success' => true, 'message' => 'Volunteer profile updated'], 201);
        } else {
            return response()->json(['success' => false, 'message' => 'Profile update failed'], 500);
        }
    }


    public function getBloodDonorProfile(Request $request)
    {
        $userId = $request->input('user_Id');

        $bloodDonor = DB::select("SELECT * FROM blood_donors WHERE user_id = ?", [$userId]);

        if (!$bloodDonor) {
            return response()->json(['success' => false, 'message' => 'Blood donor not found'], 500);
        }

        return response()->json(['success' => true, 'bloodDonor' => $bloodDonor], 201);
    }


    public function updateBloodDonorProfile(Request $request)
    {
        $userId = $request->input('user_Id');
        $bloodGroup = $request->input('blood_group');
        $lastDonation = $request->input('last_donation');

        $sql = 'UPDATE blood_donors SET blood_group = ?, last_donation = ? WHERE user_id = ?';
        $values = [$bloodGroup, $lastDonation, $userId];
        $result = DB::update($sql, $values);

        if ($result) {
            return response()->json(['success' => true, 'message' => 'Blood donor profile updated'], 201);
        } else {
            return response()->json(['success' => false, 'message' => 'Profile update failed'], 500);
        }
    }


    public function getDoctorProfile(Request $request)
    {
        $userId = $request->input('user_Id');

        $doctor = DB::select("SELECT * FROM doctors WHERE user_id = ?", [$userId]);

        if (!$doctor) {
            return response()->json(['success' => false, 'message' => 'Doctor not found'], 500);
        }

        return response()->json(['success' => true, 'doctor' => $doctor], 201);
    }


    public function updateDoctorProfile(Request $request)
    {
        $userId = $request->input('user_Id');
        $specialization = $request->input('specialization');
        $freeTime = $request->input('freeTime');
        $chamberLocation = $request->input('chamber_Location');

        $sql = 'UPDATE doctors SET specialization = ?, free_time = ?, chamber_location = ? WHERE user_id = ?';
        $values = [$specialization, $freeTime, $chamberLocation, $userId];
        $result = DB::update($sql, $values);

        if ($result) {
            return response()->json(['success' => true, 'message' => 'Doctor profile updated'], 201);
        } else {
            return response()->json(['success' => false, 'message' => 'Profile update failed'], 500);
        }
    }
    public function updateAdminProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'admin_id' => 'required|exists:admins,admin_id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 400);
        }

        $adminId = $request->input('admin_id');
        $name = $request->input('name');
        $email = $request->input('email');
        $password = bcrypt($request->input('password'));
        $sql = 'UPDATE admins SET name = ?, email = ?, password = ? WHERE admin_id = ?';
        $values = [$name, $email, $password, $adminId];
        $result = DB::update($sql, $values);

        if ($result) {
            return response()->json(['success' => true, 'message' => 'Admin Updated'], 201);
        } else {
            return response()->json(['success' => false, 'message' => 'Update failed'], 500);
        }
    }



    public function approveUser(Request $request, $status)
    {
        $status = filter_var($status, FILTER_VALIDATE_BOOLEAN); // Convert to boolean

        $adminId = $request->input('admin_id');
        $userId = $request->input('user_Id');

        // Check if admin exists
        $adminExists = DB::table('admins')->where('admin_id', $adminId)->exists();
        if (!$adminExists) {
            return response()->json(['success' => false, 'message' => 'Admin access denied'], 403);
        }

        // Update user approval status
        $updated = DB::table('users')->where('user_id', $userId)->update(['approved' => $status]);

        return $updated
            ? response()->json(['success' => true, 'message' => 'User approval status updated'], 201)
            : response()->json(['success' => false, 'message' => 'Update failed'], 500);
    }


}
