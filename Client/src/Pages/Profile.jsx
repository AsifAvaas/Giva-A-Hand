import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import axios from 'axios';
import VolunteerProfile from '../Components/VolunteerProfile';
import BloodDonorProfile from '../Components/BloodDonorProfile';
import DoctorProfile from '../Components/DoctorProfile';
import '../styles/profile.css';

const DefaultAvatar = () => (
    <div className="default-avatar">
      <i className="fas fa-user"></i>
    </div>
  );
  
function Profile() {
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const userId = localStorage.getItem('userID');

    const [form, setForm] = useState({
        user_Id: userId,
        name: '',
        phone: '',
        address: '',
        profile_pic: '',
    });

    const fetchProfile = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/profile', { user_Id: userId });
            setProfile(response.data.user[0]);
            setForm(response.data.user[0]);
            console.log(response.data.user[0]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        console.log('Updated Profile:', form.user_id);
        try {
            const response = await axios.put('http://localhost:8000/api/profile', { user_Id: form.user_id, name: form.name, phone: form.phone, address: form.address, profile_pic: form.profile_pic });
            if (response.status === 201) {
                console.log('Profile updated successfully');
                fetchProfile();
            }
        } catch (error) {
            console.log(error);
        }
        setIsEditing(false);
    };

    const handleFileInput = async (e) => {
        const pic = e.target.files[0];
        console.log(pic);

        if (!pic) return;
        const data = new FormData();
        data.append('file', pic);
        data.append('upload_preset', 'Giva_a_Hand');
        data.append('cloud_name', 'dptn5t2e6');
        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dptn5t2e6/image/upload', data);
            const picUrl = response.data.secure_url;

            console.log(picUrl);

            // Update the form state with the image URL
            setForm((prevForm) => ({
                ...prevForm,
                profile_pic: picUrl,
            }));
        } catch (error) {
            console.log('Error uploading image:', error);
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="profile-container">
                <div className="profile-image-wrapper">
                {profile.profile_pic ? (
        <>
            <img src={profile.profile_pic} alt="Profile" className="profile-image" />
            <div className="profile-text-overlay">Profile</div>
        </>
        ) : (<><DefaultAvatar />
            <div className="profile-text-overlay">Profile</div>
        </>
            )}
                </div>
                {isEditing && <input type="file" onChange={handleFileInput}></input>}
                    <div className="text-lg mb-2">
                        <span className="font-semibold">Name:</span>
                        {isEditing ? <input type="text" name="name" value={form.name || ''} onChange={handleChange} className="ml-2 p-2 border rounded" /> : <span> {profile.name}</span>}
                    </div>

                    <div className="text-lg mb-2">
                        <span className="font-semibold">Email:</span>
                        <span> {profile.email}</span>
                    </div>

                    <div className="text-lg mb-2">
                        <span className="font-semibold">Password:</span> <span>protected</span>
                    </div>

                    <div className="text-lg mb-2">
                        <span className="font-semibold">Mobile no:</span>
                        {isEditing ? <input type="text" name="phone" value={form.phone || ''} onChange={handleChange} className="ml-2 p-2 border rounded" /> : <span> {profile.phone}</span>}
                    </div>

                    <div className="text-lg mb-2">
                        <span className="font-semibold">Address:</span>
                        {isEditing ? <input type="text" name="address" value={form.address || ''} onChange={handleChange} className="ml-2 p-2 border rounded w-full" /> : <span> {profile.address}</span>}
                    </div>
                    {profile.approved ? (
                        <div className="text-green-700">Your profile is approved by the admin</div>
                    ) : (
                        <div className="text-red-700">
                            Your profile is not approved by the admin <span className="text-gray-700"> Please complete all the info</span>
                        </div>
                    )}
 
                    <div className="mt-4">
                        {isEditing ? (
                            <>
                                <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mr-2">
                                    Save
                                </button>
                                <button onClick={handleEdit} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
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
            {profile.role === 'blood_donors' && <BloodDonorProfile />}
            {profile.role === 'doctors' && <DoctorProfile />}
            {profile.role === 'volunteers' && <VolunteerProfile />}
        </div>
    );
}

export default Profile;
