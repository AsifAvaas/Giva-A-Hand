import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Helper() {
    const backend = import.meta.env.VITE_BACKEND_PORT;
    const [userRequest, setUserRequest] = useState([]);
    const id = localStorage.getItem('helperId');

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

    return (
        <div className="container mx-auto p-4">
            {userRequest.length === 0 ? (
                <p className="text-center text-gray-500">No requests found</p>
            ) : (
                userRequest.map((request, index) => (
                    <div key={request.request_id} className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
                        <div className="border-b border-gray-300 pb-2 mb-4">
                            <h3 className="text-lg font-semibold">Status: {request.status === 1 ? 'Approved' : 'Pending'}</h3>
                        </div>
                        <p className="text-sm text-gray-700">
                            <strong>Message:</strong> {request.message}
                        </p>
                        {request.user_details && (
                            <div className="mt-4 pt-4 border-t border-gray-300">
                                <p className="text-sm font-medium">
                                    <strong>Name:</strong> {request.user_details.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Email:</strong> {request.user_details.email}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Phone:</strong> {request.user_details.phone}
                                </p>
                                <img src={request.user_details.profile_pic} alt="Profile Pic" className="mt-2 w-24 h-24 rounded-full object-cover" />
                            </div>
                        )}

                        {/* Button to change status */}
                        <div className="mt-4">
                            <button onClick={() => changeStatus(request.request_id, request.status)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                Change Status
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Helper;
