import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import axios from 'axios';
import VolunteerProfile from '../Components/VolunteerProfile';

function Profile() {
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [originalProfile, setOriginalProfile] = useState({}); // Store original data

    const userId = localStorage.getItem('userID');

    const fetchProfile = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/profile', { user_Id: userId });
            setProfile(response.data.user);
            setOriginalProfile(response.data.user); // Store original data for reverting
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEdit = () => {
        setOriginalProfile(profile); // Save the current state before editing
        setIsEditing(true);
    };

    const handleBack = () => {
        setProfile(originalProfile); // Restore original data
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        console.log('Updated Profile:', profile);
        try {
            const response = await axios.post('http://localhost:8000/api/updateProfile', { user_Id: profile.user_id, ...profile });
            if (response.status === 201) {
                console.log('Profile updated successfully');
                fetchProfile();
            }
        } catch (error) {
            console.log(error);
        }
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="bg-white shadow-md mt-40 rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">Profile</h1>

                    <div className="text-lg mb-2">
                        <span className="font-semibold">Name:</span>
                        {isEditing ? <input type="text" name="name" value={profile.name || ''} onChange={handleChange} className="ml-2 p-1 border rounded" /> : <span> {profile.name}</span>}
                    </div>

                    <div className="text-lg mb-2">
                        <span className="font-semibold">Email:</span>
                        {isEditing ? <input type="email" name="email" value={profile.email || ''} onChange={handleChange} className="ml-2 p-1 border rounded" /> : <span> {profile.email}</span>}
                    </div>

                    <div className="text-lg mb-2">
                        <span className="font-semibold">Password:</span> <span>protected</span>
                    </div>

                    <div className="text-lg mb-2">
                        <span className="font-semibold">Mobile no:</span>
                        {isEditing ? <input type="text" name="phone" value={profile.phone || ''} onChange={handleChange} className="ml-2 p-1 border rounded" /> : <span> {profile.phone}</span>}
                    </div>

                    <div className="text-lg mb-2">
                        <span className="font-semibold">Address:</span>
                        {isEditing ? <input type="text" name="address" value={profile.address || ''} onChange={handleChange} className="ml-2 p-1 border rounded w-full" /> : <span> {profile.address}</span>}
                    </div>

                    <div className="text-lg mb-2">
                        <span className="font-semibold">Role:</span>
                        {isEditing ? (
                            <select name="role" value={profile.role || ''} onChange={handleChange} className="ml-2 p-1 border rounded">
                                <option value="doctor">Doctor</option>
                                <option value="blood_donor">Blood Donor</option>
                                <option value="volunteer">Volunteer</option>
                                <option value="receiver">Receiver</option>
                            </select>
                        ) : (
                            <span> {profile.role}</span>
                        )}
                    </div>

                    <div className="mt-4">
                        {isEditing ? (
                            <>
                                <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mr-2">
                                    Save
                                </button>
                                <button onClick={handleBack} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
                                    Back
                                </button>
                            </>
                        ) : (
                            <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* {profile.role === 'volunteer' && <VolunteerProfile />} */}
        </div>
    );
}

export default Profile;
