import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import axios from 'axios';

function Profile() {
    const [profile, getProfile] = useState({});
    const port = import.meta.env.VITE_BACKEND_PORT;

    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userID');
    const fetchProfile = async () => {
        console.log('userID:', userId);
        console.log('role:', role);
        try {
            const response = await axios.post(`http://localhost:8000/api/${role}/profile`, { userId: userId });
            getProfile(response.data.user);
            console.log(response.data.user);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="bg-white shadow-md mt-40 rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">Profile</h1>
                    <p className="text-lg mb-2">
                        <span className="font-semibold">Name:</span> {profile.name}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Email:</span> {profile.email}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
