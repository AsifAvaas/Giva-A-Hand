import axios from 'axios';
import React, { useEffect, useState } from 'react';

function DoctorProfile() {
    const userId = localStorage.getItem('userID');
    const [doctor, setDoctor] = useState({
        specialization: '',
        freeTime: '',
        chamber_Location: '',
    });

    const [form, setForm] = useState({
        user_Id: userId,
        specialization: '',
        freeTime: '',
        chamber_Location: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/doctor/profile', { user_Id: userId });
            if (response.status === 201) {
                const data = response.data.doctor[0];
                setDoctor(data);
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
            const response = await axios.put('http://localhost:8000/api/doctor/profile', { user_Id: form.user_Id, specialization: form.specialization, freeTime: form.freeTime, chamber_Location: form.chamber_Location });
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
                <h1 className="text-2xl">Blood Donor Information</h1>
                <div className="text-lg mb-2">
                    <span className="font-semibold">Field of specialization:</span>
                    {isEditing ? <input type="text" name="specialization" value={form.specialization || ''} onChange={handleChange} className="ml-2 p-2 border rounded" /> : <span> {doctor.specialization}</span>}
                </div>
                <div className="text-lg mb-2">
                    <span className="font-semibold">Free time:</span>
                    {isEditing ? <input type="text" name="freeTime" value={form.freeTime || ''} onChange={handleChange} className="ml-2 p-2 border rounded" /> : <span> {doctor.freeTime}</span>}
                </div>

                <div className="text-lg mb-2">
                    <span className="font-semibold">Chamber location:</span>
                    {isEditing ? <input type="text" name="chamber_Location" value={form.chamber_Location || ''} onChange={handleChange} className="ml-2 p-2 border rounded" /> : <span> {doctor.chamber_Location}</span>}
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

export default DoctorProfile;
