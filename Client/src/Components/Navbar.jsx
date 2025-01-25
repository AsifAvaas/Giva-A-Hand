import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/navbar.css';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const token = localStorage.getItem('token');

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_PORT}/api/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                localStorage.clear();
                window.location.href = '/login'; 
            } else {
                console.error('Failed to logout. Please try again.');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="navbar-brand">
                    Give A Hand
                </Link>

                {/* Menu toggle button for mobile view */}
                <button
                    className="menu-toggle"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>

                <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    {token ? (
                        <div className="nav-buttons">
                            <Link to="/profile" className="nav-link">
                                <i className="fas fa-user"></i> Profile
                            </Link>
                            <button
                                className="nav-button logout-btn"
                                onClick={handleLogout}
                            >
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="nav-buttons">
                            <Link to="/login" className="nav-link">
                                <i className="fas fa-sign-in-alt"></i> Login
                            </Link>
                            <Link to="/signup" className="nav-button signup-btn">
                                <i className="fas fa-user-plus"></i> Signup
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
