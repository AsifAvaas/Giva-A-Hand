import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/navbar.css';

function Navbar() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userID');

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('No token found. Redirecting to login.');
                window.location.href = '/login';
                return;
            }

            await axios.post(
                'http://localhost:8000/api/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            localStorage.clear();
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
            localStorage.clear();
            window.location.href = '/login';
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/notifications/unread', { user_id: userId });
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.notifications.length);
        } catch (error) {
            console.error('Fetch notifications failed:', error);
        }
    };

    const fetchAllNotifications = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/notifications/all', { user_id: userId });
            const notifications = response.data.notifications;
            setNotifications(notifications);
            setUnreadCount(0);
        } catch (error) {
            console.error('Fetch notifications failed:', error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleNotifications = async () => {
        setShowDropdown(!showDropdown);

        if (!showDropdown && unreadCount > 0) {
            try {
                await axios.post('http://localhost:8000/api/notifications/read-all', { user_id: userId });
                setUnreadCount(0);
            } catch (error) {
                console.error('Error marking notifications as read:', error);
            }
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="navbar-brand">
                    Give A Hand
                </Link>

                <div className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
                    <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </div>

                <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    {token ? (
                        <div className="nav-buttons">
                            {role !== 'admin' && (
                                <div className="notification-container">
                                    <div className="notification-container">
                                        <div onClick={toggleNotifications} className="notification-icon">
                                            <i className="fas fa-bell"></i>
                                            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                                        </div>
                                    </div>

                                    {showDropdown && (
                                        <div className="notification-dropdown">
                                            {notifications.length > 0 ? (
                                                notifications.map((notification, index) => (
                                                    <div key={index} className="notification-item">
                                                        {notification.data.message}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="notification-item">No new notifications</div>
                                            )}
                                            <div onClick={fetchAllNotifications} to="/all-notifications" className="see-all-btn hover:pointer">
                                                See All Notifications
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {userId && (
                                <Link to="/profile" className="nav-link">
                                    <i className="fas fa-user"></i> Profile
                                </Link>
                            )}
                            {role === 'admin' && (
                                <Link to="/dashboard" className="nav-link">
                                    <i className="fas fa-user"></i> DashBoard
                                </Link>
                            )}
                            {role !== 'admin' && role !== 'receivers' && (
                                <Link to="/notices" className="nav-link">
                                    Notices
                                </Link>
                            )}
                            <button className="nav-button logout-btn" onClick={handleLogout}>
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
