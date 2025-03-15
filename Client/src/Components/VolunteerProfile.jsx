import axios from 'axios';
import React, { useEffect, useState } from 'react';

function VolunteerProfile() {
    const backend = import.meta.env.VITE_BACKEND_PORT;
    const userId = localStorage.getItem('userID');
    const [volunteer, setVolunteer] = useState({
        skills: '',
        availability: '',
    });

    const [form, setForm] = useState({
        user_Id: userId,
        skills: '',
        availability: 'Occasional',
    });
    const [isEditing, setIsEditing] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.post(`${backend}/api/volunteer/profile`, { user_Id: userId });
            if (response.status === 201) {
                const data = response.data.volunteer[0];
                console.log(data);
                setVolunteer(data);
            } else {
                console.log('somethiung went wrong');
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async () => {
        console.log('Updated Profile:', userId);
        console.log('Updated Profile:', form);
        try {
            const response = await axios.put(`${backend}/api/volunteer/profile`, { user_Id: form.user_Id, skills: form.skills, availability: form.availability });
            if (response.status === 201) {
                console.log('Profile updated successfully');
                fetchData();
            } else {
                console.log('somethiung went wrong');
            }
        } catch (error) {
            console.log(error);
        }
        setIsEditing(false);
    };
    return (
        <div className="container mx-auto p-4">
            <div className="bg-white p-6 rounded-lg">
                <h1 className="text-2xl">Volunteer Information</h1>
                <div className="text-lg mb-2">
                    <span className="font-semibold">Skills:</span>
                    {isEditing ? <input type="text" name="skills" value={form.skills || ''} onChange={handleChange} className="ml-2 p-2 border rounded" /> : <span> {volunteer.skills}</span>}
                </div>
                <div className="text-lg mb-2">
                    <span className="font-semibold">Availability:</span>
                    {isEditing ? (
                        <select name="availability" value={form.availability || ''} onChange={handleChange} className="ml-2 p-2 border rounded">
                            {['Occasional', 'Full-Time', 'Part-Time'].map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <span> {volunteer.availability}</span>
                    )}
                </div>

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
    );
}

export default VolunteerProfile;
