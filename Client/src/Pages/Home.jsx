import React from 'react';
import Navbar from '../Components/Navbar';
import '../styles/home.css';

function Home() {
    const role = localStorage.getItem('role');
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

            {role === 'receivers' ? (
                <section className="help-section">
                    <h2 className="section-title">Need help?</h2>

                    <div className="feature-cards">
                        <div className="feature-card">
                            <div className="card-image sponsor-image"></div>
                            <h3>Sponsor</h3>
                            <p>If you need sponsors for education and creative arts programs, outreach, and skate sessions.</p>
                            <button className="card-btn">Contact ➔</button>
                        </div>
                        <div className="feature-card">
                            <div className="card-image blood-bank-image"></div>
                            <h3>Blood Bank</h3>
                            <p>If you need volunteers for our blood donation programs, outreach, and awareness sessions.</p>
                            <button className="card-btn">Need ➔</button>
                        </div>
                        <div className="feature-card">
                            <div className="card-image doctor-image"></div>
                            <h3>Doctor</h3>
                            <p>If you need doctors who will give you free treatement.So ,withiut any hesitation you can contact with us.</p>
                            <button className="card-btn">Contact ➔</button>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="features-section">
                    <h2 className="section-title">More way to give</h2>
                    <div className="feature-cards">
                        <div className="feature-card">
                            <div className="card-image volunteer-image"></div>
                            <h3>Volunteer</h3>
                            <p>We need volunteers for our informal education and creative arts programs, outreach, and skate sessions.</p>
                            <button className="card-btn">Do You ➔</button>
                        </div>
                        <div className="feature-card">
                            <div className="card-image blood-bank-image"></div>
                            <h3>Blood Bank</h3>
                            <p>We need volunteers for our blood donation programs, outreach, and awareness sessions.</p>
                            <button className="card-btn">Do You ➔</button>
                        </div>
                        <div className="feature-card">
                            <div className="card-image doctor-image"></div>
                            <h3>Doctor</h3>
                            <p>We need doctors for needy persons. It will be great if you treat those people freely who need your help .</p>
                            <button className="card-btn">Do You ➔</button>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
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
