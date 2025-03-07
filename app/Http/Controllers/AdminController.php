<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AdminService;

class AdminController extends Controller
{
    protected $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    public function register(Request $request)
    {
        $result = $this->adminService->register($request->all());

        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], 400);
        }

        return response()->json([
            'success' => true,

            'message' => $result['message'],
            'adminId' => $result['adminId'],
        ], 201);
    }

    public function login(Request $request)
    {
        $result = $this->adminService->login($request->all());

        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], 401);
        }

        return response()->json([
            'success' => true,
            'role' => 'admin',
            'message' => $result['message'],
            'adminId' => $result['adminId'],
            'token' => $result['token'],
        ], 201);
    }
}
