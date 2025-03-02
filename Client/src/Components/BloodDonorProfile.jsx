import axios from 'axios';
import React, { useEffect, useState } from 'react';

function BloodDonorProfile() {
    const userId = localStorage.getItem('userID');
    const [donor, setDonor] = useState({
        blood_group: '',
        last_donation: '',
    });

    const [form, setForm] = useState({
        user_Id: userId,
        blood_group: '',
        last_donation: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/bloodDonor/profile', { user_Id: userId });
            if (response.status === 201) {
                const data = response.data.bloodDonor[0];
                setDonor(data);
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
            const response = await axios.put('http://localhost:8000/api/bloodDonor/profile', { user_Id: form.user_Id, blood_group: form.blood_group, last_donation: form.last_donation });
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
                    <span className="font-semibold">Blood Group:</span>
                    {isEditing ? (
                        <select name="blood_group" value={form.blood_group || ''} onChange={handleChange} className="ml-2 p-2 border rounded">
                            <option value="">Select Blood Group</option>
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                                <option key={group} value={group}>
                                    {group}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <span> {donor.blood_group}</span>
                    )}
                </div>
                <div className="text-lg mb-2">
                    <span className="font-semibold">Last donation date:</span>
                    {isEditing ? (
                        <input type="date" name="last_donation" value={form.last_donation || ''} onChange={handleChange} className="ml-2 p-2 border rounded" />
                    ) : (
                        <span> {donor.last_donation ? new Date(donor.last_donation).toISOString().split('T')[0] : ''}</span>
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

export default BloodDonorProfile;
