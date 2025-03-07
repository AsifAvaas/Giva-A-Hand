import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Reciever() {
    const backend = import.meta.env.VITE_BACKEND_PORT;
    const id = localStorage.getItem('userID');
    const navigate = useNavigate();
    const [userRequest, setUserRequest] = useState([]);
    const fetchRequest = async () => {
        try {
            const response = await axios.post(`${backend}/api/request/user`, { seeker_id: id });
            if (response.status === 201) {
                console.log(response.data.data);
                setUserRequest(response.data.data);
            } else {
                console.log('No request found');
            }
        } catch (error) {}
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <section className="help-section">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-blue-500">Need help?</h2>

                <div className="feature-cards">
                    <div className="feature-card">
                        <div className="card-image sponsor-image"></div>
                        <h3>Sponsor</h3>
                        <p>If you need sponsors for education and creative arts programs, outreach, and skate sessions.</p>
                        <button onClick={() => navigate('/volunteer/page')} className="card-btn">
                            Contact ➔
                        </button>
                    </div>
                    <div className="feature-card">
                        <div className="card-image blood-bank-image"></div>
                        <h3>Blood Bank</h3>
                        <p>If you need volunteers for our blood donation programs, outreach, and awareness sessions.</p>
                        <button onClick={() => navigate('/BloodDonor/page')} className="card-btn">
                            Need ➔
                        </button>
                    </div>

                    <div className="feature-card">
                        <div className="card-image doctor-image"></div>
                        <h3>Doctor</h3>
                        <p>If you need doctors who will give you free treatment. So, without any hesitation you can contact us.</p>
                        <button onClick={() => navigate('/doctor/page')} className="card-btn">
                            Contact ➔
                        </button>
                    </div>
                </div>
            </section>
            <div className="container ">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {userRequest.map((request, index) => (
                        <div
                            onClick={() => requestPage(request.status, request.request_id)}
                            key={index}
                            className="bg-white rounded-2xl shadow-lg p-8 transform perspective-1000 hover:rotate-2 hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-100"
                        >
                            <div className="relative mb-6 transform hover:-rotate-1 transition-transform duration-300">
                                <img className="max-w-56 rounded-xl" src={request.helper_data.profile_pic} alt="Profile Pic" />

                                <div className="space-y-6 p-6">
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Name</label>
                                        <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">{request.helper_data.name}</h3>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                                        <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">{request.helper_data.email}</h3>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
                                        <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">{request.helper_data.phone}</h3>
                                    </div>
                                    <div className="mt-8">
                                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Message</label>
                                        <p className="mt-2 text-gray-600 bg-gray-50 rounded-lg p-4 italic">{request.message}</p>
                                    </div>
                                    {request.status === 1 ? <p className="text-green-700">Accepted</p> : <p className="text-red-600">Not Accepted</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Reciever;
