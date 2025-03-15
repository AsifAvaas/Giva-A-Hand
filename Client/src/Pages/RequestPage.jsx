import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ChatPage() {
    const { id } = useParams();
    const userId = localStorage.getItem('userID'); // Logged-in user ID
    const backend = import.meta.env.VITE_BACKEND_PORT;
    const [request, setRequest] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [conversationId, setConversationId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSeeker, setIsSeeker] = useState(null); // Track if user is a seeker or helper

    // Fetch the request and check if a conversation exists
    const fetchRequest = async () => {
        try {
            const response = await axios.get(`${backend}/api/request/${id}`);
            if (response.data.success) {
                setRequest(response.data.data);
                const userIsSeeker = response.data.data.seeker.user_id == userId; // Check if the logged-in user is the seeker
                setIsSeeker(userIsSeeker);
                checkConversation(response.data.data.seeker.user_id, response.data.data.helper.user_id);
            } else {
                setError('No request found.');
            }
        } catch (error) {
            setError('Error fetching request.');
        } finally {
            setLoading(false);
        }
    };

    // Check if the conversation already exists, or create it
    const checkConversation = async (seekerId, helperId) => {
        try {
            const response = await axios.post(`${backend}/api/chat/start`, {
                user_one_id: seekerId,
                user_two_id: helperId,
            });
            setConversationId(response.data.id); // Set the conversation ID
            fetchMessages(response.data.id); // Fetch existing messages
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    // Fetch all messages for a given conversation
    const fetchMessages = async (conversationId) => {
        try {
            const response = await axios.get(`${backend}/api/chat/messages/${conversationId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Send a message
    const sendMessage = async () => {
        if (message.trim() === '') return;
        try {
            await axios.post(`${backend}/api/chat/send`, {
                conversation_id: conversationId,
                sender_id: isSeeker ? request.seeker.user_id : request.helper.user_id, // Send as seeker or helper based on who is logged in
                message: message,
            });
            setMessage(''); // Clear the message input
            fetchMessages(conversationId); // Refresh the messages
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        fetchRequest();
    }, []);

    if (loading) return <div className="text-center mt-10 text-lg font-semibold">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Chat</h1>

            {/* Request Info Section */}
            <div className="p-4 border rounded-lg mb-6 shadow-md">
                <h2 className="text-xl font-semibold text-gray-800">Request Details</h2>
                <p className="text-gray-700">
                    <span className="font-semibold">Message:</span> {request.message}
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Status:</span>
                    {request.status === 0 ? <span className="text-yellow-500 font-semibold">Pending</span> : <span className="text-green-500 font-semibold">Completed</span>}
                </p>
            </div>

            {/* Helper or Seeker Information Section */}
            {isSeeker ? (
                <div className="p-4 border rounded-lg flex items-center gap-4 shadow-md mb-6">
                    <img src={request.helper.profile_pic} alt={request.helper.name} className="w-16 h-16 rounded-full border" />
                    <div>
                        <h2 className="text-lg font-semibold">{request.helper.name}</h2>
                        <p className="text-gray-600">{request.helper.email}</p>
                        <p className="text-gray-600">{request.helper.phone}</p>
                    </div>
                </div>
            ) : (
                <div className="p-4 border rounded-lg flex items-center gap-4 shadow-md mb-6">
                    <img src={request.seeker.profile_pic} alt={request.seeker.name} className="w-16 h-16 rounded-full border" />
                    <div>
                        <h2 className="text-lg font-semibold">{request.seeker.name}</h2>
                        <p className="text-gray-600">{request.seeker.email}</p>
                        <p className="text-gray-600">{request.seeker.phone}</p>
                    </div>
                </div>
            )}

            {/* Messages Section */}
            <div className="h-60 overflow-y-auto p-4 bg-gray-50 rounded-lg shadow-md mb-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message mt-1 flex ${msg.sender.user_id === (isSeeker ? request.seeker.user_id : request.helper.user_id) ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex flex-col p-2 rounded-lg ${msg.sender.user_id === (isSeeker ? request.seeker.user_id : request.helper.user_id) ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'}`}>
                            <div className="text-sm font-semibold text-gray-800">{msg.sender.name}</div>
                            <div>{msg.message}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message Input Section */}
            <div className="flex gap-4">
                <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage(); // Call sendMessage when Enter is pressed
                        }
                    }}
                />
                <button onClick={sendMessage} className="p-2 w-24 bg-blue-500 text-white rounded-lg">
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatPage;
