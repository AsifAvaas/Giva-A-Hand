<?php
namespace App\Services;

use Illuminate\Support\Facades\DB;

class NoticeService
{
    public function createNotice($adminId, $noticeTitle, $noticeMessage, $noticePic)
    {
        $admin = DB::table('admins')->where('admin_id', $adminId)->first();
        if (!$admin) {
            return ['error' => 'Invalid admin_id'];
        }

        DB::table('notice')->insert([
            'admin_id' => $adminId,
            'notice_title' => $noticeTitle,
            'notice_message' => $noticeMessage,
            'notice_pic' => $noticePic,
        ]);

        return ['success' => true, 'message' => 'Notice posted successfully'];
    }

    public function updateNotice($noticeId, $adminId, $noticeTitle, $noticeMessage, $noticePic)
    {
        $admin = DB::table('admins')->where('admin_id', $adminId)->first();
        if (!$admin) {
            return ['error' => 'Invalid admin_id'];
        }

        $updated = DB::table('notice')->where('notice_id', $noticeId)->update([
            'notice_title' => $noticeTitle,
            'notice_message' => $noticeMessage,
            'notice_pic' => $noticePic,
        ]);

        return $updated ? ['success' => true, 'message' => 'Notice updated successfully'] : ['error' => 'Notice not found or no changes made'];
    }

    public function getAllNotices()
    {
        return DB::table('notice')->get();
    }

    public function getNoticeById($id)
    {
        $result = DB::select("SELECT n.notice_id, n.notice_title, n.notice_message, n.notice_pic, u.user_id, u.name, u.email, u.phone, u.role FROM notice n LEFT JOIN notice_users nu ON n.notice_id = nu.notice_id LEFT JOIN users u ON nu.user_id = u.user_id WHERE n.notice_id = ?", [$id]);

        if (empty($result)) {
            return ['error' => 'Notice not found or no users joined'];
        }

        return [
            'notice_id' => $result[0]->notice_id,
            'notice_title' => $result[0]->notice_title,
            'notice_message' => $result[0]->notice_message,
            'notice_pic' => $result[0]->notice_pic,
            'users' => array_filter(array_map(function ($user) {
                return $user->user_id ? [
                    'user_id' => $user->user_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role
                ] : null;
            }, $result))
        ];
    }

    public function addUserToNotice($noticeId, $userId)
    {
        DB::table('notice_users')->insert(['notice_id' => $noticeId, 'user_id' => $userId]);
        return ['success' => true, 'message' => 'Notice fetched successfully'];
    }
}