import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/auth.css';
function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/admin/login', { email, password });
            if (response.status === 201) {
                setMsg('Login successful');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('adminId', response.data.adminId);

                navigate('/admin/home');
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
                <h2 className="text-2xl font-bold text-center">Login</h2>
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
                    <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        Login
                    </button>
                    <p className="text-sm text-center text-gray-600">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-indigo-600 hover:underline">
                            Sign Up
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
