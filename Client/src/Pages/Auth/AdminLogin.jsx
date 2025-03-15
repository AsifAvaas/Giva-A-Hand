import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/adminLogin.css';
function AdminLogin() {
    const backend = import.meta.env.VITE_BACKEND_PORT;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backend}/api/admin/login`, { email, password });
            if (response.status === 201) {
                setMsg('Login successful');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('adminId', response.data.adminId);
                localStorage.setItem('role', response.data.role);

                navigate('/');
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            setError('Invalid credentials');
            console.error(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email:</label>
                        <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300" />
                    </div>

                    {error && <div className="text-red-500">{error}</div>}
                    {msg && <div className="text-green-500">{msg}</div>}
                    <button
                        className="w-full px-4 py-3 font-bold
                            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                            rounded-md hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
                            transform hover:-translate-y-0.5 active:translate-y-0
                            transition-all duration-200 ease-in-out
                            focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
                            shadow-lg hover:shadow-xl
                            text-white text-xl tracking-wider
                            flex items-center justify-center"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
