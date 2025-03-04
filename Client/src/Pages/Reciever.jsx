import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Reciever() {
    const backend = import.meta.env.VITE_BACKEND_PORT;
    const id = localStorage.getItem('userID');
    const navigate = useNavigate();
    const [userRequest, setUserRequest] = useState([]);
    const fetchRequest = async () => {
        try {
            const response = await axios.post(`${backend}/api/request/user`, { seeker_id: id });
            if (response.status === 201) {
                console.log(response.data.data);
                setUserRequest(response.data.data);
            } else {
                console.log('No request found');
            }
        } catch (error) {}
    };
    useEffect(() => {
        fetchRequest();
    }, []);
    return (
        <div>
            <section className="help-section">
                <h2 className="section-title">Need help?</h2>

                <div className="feature-cards">
                    <div className="feature-card">
                        <div className="card-image sponsor-image"></div>
                        <h3>Sponsor</h3>
                        <p>If you need sponsors for education and creative arts programs, outreach, and skate sessions.</p>
                        <button onClick={() => navigate('/volunteer/page')} className="card-btn">
                            Contact ➔
                        </button>
                    </div>
                    <div className="feature-card">
                        <div className="card-image blood-bank-image"></div>
                        <h3>Blood Bank</h3>
                        <p>If you need volunteers for our blood donation programs, outreach, and awareness sessions.</p>
                        <button onClick={() => navigate('/BloodDonor/page')} className="card-btn">
                            Need ➔
                        </button>
                    </div>

                    <div className="feature-card">
                        <div className="card-image doctor-image"></div>
                        <h3>Doctor</h3>
                        <p>If you need doctors who will give you free treatment. So, without any hesitation you can contact us.</p>
                        <button onClick={() => navigate('/doctor/page')} className="card-btn">
                            Contact ➔
                        </button>
                    </div>
                </div>
            </section>
            <div className="container ">
                {userRequest.map((request, index) => (
                    <div key={index} className="request-card border p-3 rounded m-3 bg-slate-300">
                        <img className="max-w-56 rounded-xl" src={request.helper_data.profile_pic} alt="Profile Pic" />
                        {/* <h3>{request.helper_data.profile_pic}</h3> */}
                        <h1>Name:</h1>
                        <h3>{request.helper_data.name}</h3>
                        <h1>Email:</h1>
                        <h3>{request.helper_data.email}</h3>
                        <h1>Phone:</h1>
                        <h3>{request.helper_data.phone}</h3>
                        <h4>Message</h4>
                        <p>{request.message}</p>
                        {request.status === 1 ? <p className="text-green-700">Accepted</p> : <p className="text-red-600">Not Accepted</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Reciever;
