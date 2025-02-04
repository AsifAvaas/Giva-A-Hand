import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/navbar.css';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const token = localStorage.getItem('token');

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn("No token found. Redirecting to login.");
                window.location.href = '/login';
                return;
            }
    
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            localStorage.clear();
            window.location.href = '/login';
        } catch (error) {
            console.error("Logout failed:", error);
            localStorage.clear();
            window.location.href = '/login';
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
