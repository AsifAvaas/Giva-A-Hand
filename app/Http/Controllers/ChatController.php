<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;

class ChatController extends Controller
{
    // Start a conversation
    public function startConversation(Request $request)
    {
        $request->validate([
            'user_one_id' => 'required|exists:users,user_id',
            'user_two_id' => 'required|exists:users,user_id',
        ]);

        $conversation = Conversation::firstOrCreate([
            'user_one_id' => $request->user_one_id,
            'user_two_id' => $request->user_two_id,
        ]);

        return response()->json($conversation);
    }

    // Send a message
    public function sendMessage(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'sender_id' => 'required|exists:users,user_id',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'conversation_id' => $request->conversation_id,
            'sender_id' => $request->sender_id,
            'message' => $request->message,
        ]);

        return response()->json($message);
    }

    // Get messages from a conversation
    public function getMessages($conversationId)
    {
        $messages = Message::where('conversation_id', $conversationId)
            ->with([
                'sender' => function ($query) {
                    $query->select('user_id', 'name'); // Use user_id instead of id
                }
            ])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }
}
