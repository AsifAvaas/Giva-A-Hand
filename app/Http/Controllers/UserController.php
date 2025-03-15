<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserService;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function getAllUsers()
    {
        $result = $this->userService->getAllUsers();

        if (isset($result['error'])) {
            return response()->json(['success' => false, 'message' => $result['message'], 'error' => $result['error']], 500);
        }

        return response()->json([
            'success' => true,
            'volunteers' => $result['volunteers'],
            'doctors' => $result['doctors'],
            'bloodDonors' => $result['bloodDonors']
        ], 201);
    }

    public function getVolunteers()
    {
        $result = $this->userService->getVolunteers();

        if (isset($result['error'])) {
            return response()->json(['success' => false, 'message' => $result['message'], 'error' => $result['error']], 500);
        }

        return response()->json(['success' => true, 'volunteers' => $result['volunteers']], 201);
    }

    public function getDoctors()
    {
        $result = $this->userService->getDoctors();

        if (isset($result['error'])) {
            return response()->json(['success' => false, 'message' => $result['message'], 'error' => $result['error']], 500);
        }

        return response()->json(['success' => true, 'doctors' => $result['doctors']], 201);
    }

    public function getDonors()
    {
        $result = $this->userService->getDonors();

        if (isset($result['error'])) {
            return response()->json(['success' => false, 'message' => $result['message'], 'error' => $result['error']], 500);
        }

        return response()->json(['success' => true, 'bloodDonors' => $result['bloodDonors']], 201);
    }
}
