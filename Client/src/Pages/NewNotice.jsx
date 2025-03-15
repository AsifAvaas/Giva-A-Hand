import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function NewNotice() {
    const adminId = localStorage.getItem('adminId');
    const backend = import.meta.env.VITE_BACKEND_PORT;
    const navigate = useNavigate();
    const [form, setForm] = useState({
        admin_id: adminId,
        notice_title: '',
        notice_message: '',
        notice_pic: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitted Notice:', form);
        try {
            const response = await axios.post(`${backend}/api/notice`, form);
            if (response.status === 201) {
                console.log('Notice posted successfully');
                navigate('/');
            } else {
                console.log('Error posting notice');
                console.log(response);
            }
        } catch (error) {
            console.error(error);
        }
        // Add API call here to submit notice data
    };

    const handleFileChange = async (e) => {
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
                notice_pic: picUrl,
            }));
        } catch (error) {
            console.log('Error uploading image:', error);
        }
    };
    return (
        <div>
            <Navbar />
            <div className="max-w-2xl mx-auto mt-24 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Create a New Notice</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="notice_title" value={form.notice_title} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea name="notice_message" value={form.notice_message} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                        Submit Notice
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewNotice;
