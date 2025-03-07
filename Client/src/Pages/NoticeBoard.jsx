import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';

function NoticeBoard() {
    const { id } = useParams();
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotice = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/notice/${id}`);

            if (response.status === 201) {
                setNotice(response.data.data);
            } else {
                setError('Failed to fetch notice');
            }
        } catch (error) {
            setError('Error fetching notice');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotice();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 ">
            <Navbar />
            <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{notice.notice_title}</h2>
                <p className="text-gray-700 mb-4">{notice.notice_message}</p>
                {notice.notice_pic && <img src={notice.notice_pic} alt="Notice" className="w-full h-auto rounded-lg shadow-md mb-6" />}

                {/* Users List */}
                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Users Joined:</h3>
                    {notice.users.length > 0 ? (
                        <div className="space-y-4">
                            {notice.users.map((user) => (
                                <div key={user.user_id} className="bg-gray-50 p-4 rounded-lg shadow">
                                    <h4 className="text-lg font-semibold text-gray-700">{user.name}</h4>
                                    <p className="text-gray-600">
                                        <strong>Email:</strong> {user.email}
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Phone:</strong> {user.phone}
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Role:</strong> {user.role}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No users have joined this notice yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NoticeBoard;
