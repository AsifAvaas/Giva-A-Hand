import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import axios from 'axios';

function Profile() {
    const [profile, getProfile] = useState({});
    const port = import.meta.env.VITE_BACKEND_PORT;
    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${port}/api/profileInfo`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
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
                <div className="bg-white shadow-md rounded-lg p-6">
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
