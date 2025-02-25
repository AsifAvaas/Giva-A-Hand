import React from 'react';
import Navbar from '../Components/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';

function VolunteerPage() {
    const [volunteers, setVolunteers] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:8000/api/volunteers/users')
            .then((response) => {
                setVolunteers(response.data.volunteers);
                console.log(response.data.volunteers);
            })
            .catch((error) => {
                console.error('There was an error fetching the volunteers!', error);
            });
    }, []);
    return (
        <div>
            <Navbar />
            <div className=" container p-6" style={{ marginTop: '80px' }}>
                {volunteers && volunteers.length > 0 ? (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-4">Volunteers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {volunteers.map((volunteer) => (
                                <div key={volunteer.user_id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                                    <h3 className="text-xl font-semibold mb-2">{volunteer.name}</h3>
                                    <p className="text-gray-700">
                                        <strong>Email:</strong> {volunteer.email}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Phone:</strong> {volunteer.phone}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Address:</strong> {volunteer.address}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Skills:</strong> {volunteer.skills}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Availability:</strong> {volunteer.availability}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 text-center mt-4">No volunteers found.</p>
                )}
            </div>
        </div>
    );
}

export default VolunteerPage;
