<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;

use App\Models\Volunteer;
use App\Models\BloodDonor;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{

    public function register(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|string|in:doctors,receivers,blood_donors,volunteers',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }


        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);


        $modelMapping = [
            'doctors' => Doctor::class,
            'volunteers' => Volunteer::class,
            'blood_donors' => BloodDonor::class,
        ];

        if (array_key_exists($request->role, $modelMapping)) {
            $roleModel = new $modelMapping[$request->role];
            $roleModel->user_id = $user->user_id;
            $roleModel->save();
        }


        return response()->json([
            'message' => 'User registered successfully',
            'user_id' => $user->user_id,
            'user' => $user
        ], 201);
    }




    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'failed', 'error' => $validator->errors()], 401);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('authToken')->plainTextToken;

        // Check if the user is in one of the helper tables
        $volunteer = \App\Models\Volunteer::where('user_id', $user->user_id)->first();
        $doctor = \App\Models\Doctor::where('user_id', $user->user_id)->first();
        $bloodDonor = \App\Models\BloodDonor::where('user_id', $user->user_id)->first();

        $helperId = null;
        $helperType = null;

        if ($volunteer) {
            $helperId = $volunteer->volunteer_id;
            $helperType = 'volunteers';
        } elseif ($doctor) {
            $helperId = $doctor->doctor_id;
            $helperType = 'doctors';
        } elseif ($bloodDonor) {
            $helperId = $bloodDonor->blood_donor_id;
            $helperType = 'blood_donors';
        }

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'userId' => $user->user_id,
            'token' => $token,
            'role' => $user->role,
            'helperId' => $helperId,
            'helperType' => $helperType,
        ], 201);
    }



    public function logout(Request $request)
    {

        $request->user()->tokens->each(function ($token) {
            $token->delete();
        });

        return response()->json(['message' => 'Successfully logged out']);
    }
}
