import React from 'react';
import Navbar from '../Components/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';

function BloodDonor() {
    const [donors, setDonors] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:8000/api/donors/users')
            .then((response) => {
                setDonors(response.data.bloodDonors);
                console.log(response.data.bloodDonors);
            })
            .catch((error) => {
                console.error('There was an error fetching the doctors!', error);
            });
    }, []);
    return (
        <div>
            <Navbar />
            <div className="container p-6 mt-20">
                {donors && donors.length > 0 ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-center">Doctors</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {donors.map((donors) => (
                                <div key={donors.user_id} className="bg-white shadow-md rounded-lg p-6 border border-gray-300 transition-transform transform hover:scale-105 duration-300">
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{donors.name}</h3>
                                    <p className="text-gray-700">
                                        <strong>Email:</strong> {donors.email}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Phone:</strong> {donors.phone}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Address:</strong> {donors.address}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Blood Group:</strong> {donors.blood_group}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Last Donation:</strong> {donors.last_donation || 'N/A'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 text-center mt-10">No donors found.</p>
                )}
            </div>
        </div>
    );
}

export default BloodDonor;
