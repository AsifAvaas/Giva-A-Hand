import React from 'react';
import Navbar from '../Components/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';

function DoctorPage() {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:8000/api/doctors/users')
            .then((response) => {
                setDoctors(response.data.doctors);
                console.log(response.data.doctors);
            })
            .catch((error) => {
                console.error('There was an error fetching the doctors!', error);
            });
    }, []);
    return (
        <div>
            <Navbar />
            <div className="container p-6 mt-20">
                {doctors && doctors.length > 0 ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-center">Doctors</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {doctors.map((doctor) => (
                                <div key={doctor.user_id} className="bg-white shadow-md rounded-lg p-6 border border-gray-300 transition-transform transform hover:scale-105 duration-300">
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{doctor.name}</h3>
                                    <p className="text-gray-700">
                                        <strong>Email:</strong> {doctor.email}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Phone:</strong> {doctor.phone}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Address:</strong> {doctor.address}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Specialization:</strong> {doctor.specialization}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Free time:</strong> {doctor.freeTime}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Chamber location:</strong> {doctor.chamber_Location}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 text-center mt-10">No doctors found.</p>
                )}
            </div>
        </div>
    );
}

export default DoctorPage;
