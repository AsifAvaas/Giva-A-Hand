import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
function Navbar() {
    const token = localStorage.getItem('token');

    const handleLogout = async () => {
        console.log(token);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_PORT}/api/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );
            if (response.status === 200) {
                localStorage.clear();
                window.location.href = '/login';
            } else {
                console.log('error');
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="w-full bg-slate-800 h-16 text-white text-2xl flex justify-between items-center px-4">
            <div>
                <Link className="mx-2" to="/">
                    Give A Hand
                </Link>
            </div>
            <div>
                {token ? (
                    <>
                        <button>
                            <Link className="mx-2" to="/profile">
                                Profile
                            </Link>
                        </button>
                        <button className="mx-2" onClick={handleLogout}>
                            {' '}
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button>
                            <Link className="mx-2" to="/login">
                                Login
                            </Link>
                        </button>
                        <button>
                            {' '}
                            <Link className="mx-2" to="/signup">
                                Signup
                            </Link>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Navbar;
