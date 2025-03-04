import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import '../styles/home.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Helper from './Helper';
import Reciever from './Reciever';
import Admin from './Admin';

function Home() {
    const backend = import.meta.env.VITE_BACKEND_PORT;
    const role = localStorage.getItem('role');

    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Give A Hand</h1>
                    <p className="hero-description">
                        "Give a Hand" is a platform that connects sponsors, volunteers, and trusted organizations to create meaningful change. We empower communities, inspire volunteerism, and foster collaboration to address education, healthcare,
                        disaster relief, and more. Together, we make a lasting impact, one hand at a time.
                    </p>
                </div>
            </section>

            <div className="home-container">
                <h1 className="home-title">Welcome to Give A Hand</h1>
            </div>

            {role !== 'receivers' && role !== 'admin' && <Helper />}
            {role === 'receivers' && <Reciever />}
            {role === 'admin' && <Admin />}

            <footer className="footer">
                <div className="footer-content">
                    <p>"Give A Hand" is a platform that connects sponsors, volunteers, and trusted organizations to foster change.</p>
                    <div className="footer-contact">
                        <p>Get in touch</p>
                        <p>info@givehand.com.bd</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
