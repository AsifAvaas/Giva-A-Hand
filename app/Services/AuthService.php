<?php
namespace App\Services;

use App\Models\User;
use App\Models\Doctor;
use App\Models\Volunteer;
use App\Models\BloodDonor;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthService
{
    public function register(array $data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|string|in:doctors,receivers,blood_donors,volunteers',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
        ]);

        $modelMapping = [
            'doctors' => Doctor::class,
            'volunteers' => Volunteer::class,
            'blood_donors' => BloodDonor::class,
        ];

        if (array_key_exists($data['role'], $modelMapping)) {
            $roleModel = new $modelMapping[$data['role']];
            $roleModel->user_id = $user->user_id;
            $roleModel->save();
        }

        return response()->json([
            'message' => 'User registered successfully',
            'user_id' => $user->user_id,
            'user' => $user
        ], 201);
    }

    public function login(array $credentials)
    {
        $validator = Validator::make($credentials, [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'failed', 'error' => $validator->errors()], 401);
        }

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('authToken')->plainTextToken;

        $volunteer = Volunteer::where('user_id', $user->user_id)->first();
        $doctor = Doctor::where('user_id', $user->user_id)->first();
        $bloodDonor = BloodDonor::where('user_id', $user->user_id)->first();

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

    public function logout($user)
    {
        $user->tokens->each(function ($token) {
            $token->delete();
        });

        return response()->json(['message' => 'Successfully logged out']);
    }
}