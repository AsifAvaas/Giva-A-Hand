import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../styles/helper.css';
import { useNavigate } from 'react-router-dom';

function Helper() {
    const backend = import.meta.env.VITE_BACKEND_PORT;
    const [userRequest, setUserRequest] = useState([]);
    const id = localStorage.getItem('helperId');
    const navigate = useNavigate();

    const fetchRequest = async () => {
        try {
            const response = await axios.post(`${backend}/api/request/helper`, { helper_id: id });
            if (response.status === 201) {
                console.log(response.data.data);
                setUserRequest(response.data.data);
            } else {
                console.log('No request found');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const changeStatus = async (requestId, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        console.log(requestId);
        try {
            const response = await axios.put(`${backend}/api/request/approve`, {
                approver_id: id,
                request_id: requestId,
                status: newStatus,
            });

            if (response.status === 201) {
                // Update the local state after status change
                // setUserRequest((prevRequests) => prevRequests.map((request) => (request.request_id === requestId ? { ...request, status: newStatus } : request)));
                fetchRequest();
                console.log('Status updated');
            } else {
                console.log('Failed to update status');
                console.log(response.data);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    useEffect(() => {
        fetchRequest();
    }, []);

    const requestPage = (status, requestId) => {
        if (status === 1) {
            navigate(`/request/${requestId}`);
        } else {
            alert('Request not accepted');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {userRequest.length === 0 ? (
                <p className="text-center text-xl text-gray-500 mt-8">No requests found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userRequest.map((request, index) => (
                        <div key={request.request_id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Request Details</h3>
                                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${request.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{request.status === 1 ? 'Approved' : 'Pending'}</span>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <h3>Message :</h3>

                                    <p className="text-gray-700 leading-relaxed">{request.message}</p>
                                </div>

                                {request.user_details && (
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <img src={request.user_details.profile_pic} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
                                            <div>
                                                <h4 className="font-medium text-gray-800">{request.user_details.name}</h4>
                                                <p className="text-gray-600 text-sm">{request.user_details.email}</p>
                                                <p className="text-gray-600 text-sm">{request.user_details.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => changeStatus(request.request_id, request.status)}
                                    className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    {request.status === 1 ? 'Change Status' : 'Approve Request'}
                                </button>
                                <button onClick={() => requestPage(request.status, request.request_id)}>See more</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Helper;
