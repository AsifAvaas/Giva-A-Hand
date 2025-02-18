import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import axios from 'axios';

function AdminPage() {
    const adminId = localStorage.getItem('adminId');
    const [volunteer, setVolunteer] = useState('');
    const [doctor, setDoctor] = useState('');
    const [donor, setDonor] = useState('');
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/allUsers');
            if (response.status === 201) {
                setDoctor(response.data.doctors);
                setVolunteer(response.data.volunteers);
                setDonor(response.data.bloodDonors);
            } else {
                console.log('server error');
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = async (id, status) => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/admin/approve/${status}`, { admin_id: adminId, user_Id: id });
            if (response.status === 201) {
                fetchUsers();
            } else {
                console.log('server error');
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <Navbar />
            <div className=" container p-6 mt-24">
                <h1 className="text-3xl mb-16">Admin Page</h1>
                {volunteer && volunteer.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-4">Volunteers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {volunteer.map((vol) => (
                                <div key={vol.user_id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                                    <h3 className="text-xl font-semibold mb-2">{vol.name}</h3>
                                    <p className="text-gray-700">
                                        <strong>Email:</strong> {vol.email}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Phone:</strong> {vol.phone}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Address:</strong> {vol.address}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Skills:</strong> {vol.skills}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Availability:</strong> {vol.availability}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Approved:</strong> {vol.approved ? '✅ Yes' : '❌ No'}
                                    </p>
                                    {vol.approved ? (
                                        <button onClick={() => handleChange(vol.user_id, 'false')} className="bg-red-600 p-2 text-white rounded mt-2">
                                            Disapprove
                                        </button>
                                    ) : (
                                        <button onClick={() => handleChange(vol.user_id, 'true')} className="bg-green-700 p-2 text-white rounded mt-2">
                                            Approve
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {doctor && doctor.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-4">Doctors</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {doctor.map((doc) => (
                                <div key={doc.user_id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                                    <h3 className="text-xl font-semibold mb-2">{doc.name}</h3>
                                    <p className="text-gray-700">
                                        <strong>Email:</strong> {doc.email}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Phone:</strong> {doc.phone}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Address:</strong> {doc.address}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Blood Group:</strong> {doc.blood_group}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Last Donation:</strong> {doc.last_donation}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Approved:</strong> {doc.approved ? '✅ Yes' : '❌ No'}
                                    </p>
                                    {doc.approved ? (
                                        <button onClick={() => handleChange(doc.user_id, 'false')} className="bg-red-600 p-2 text-white rounded mt-2">
                                            Disapprove
                                        </button>
                                    ) : (
                                        <button onClick={() => handleChange(doc.user_id, 'true')} className="bg-green-700 p-2 text-white rounded mt-2">
                                            Approve
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {donor && donor.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-4">Blood Donors</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {donor.map((don) => (
                                <div key={don.user_id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                                    <h3 className="text-xl font-semibold mb-2">{don.name}</h3>
                                    <p className="text-gray-700">
                                        <strong>Email:</strong> {don.email}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Phone:</strong> {don.phone}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Address:</strong> {don.address}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Blood Group:</strong> {don.blood_group}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Last Donation:</strong> {don.last_donation}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Approved:</strong> {don.approved ? '✅ Yes' : '❌ No'}
                                    </p>
                                    {don.approved ? (
                                        <button onClick={() => handleChange(don.user_id, 'false')} className="bg-red-600 p-2 text-white rounded mt-2">
                                            Disapprove
                                        </button>
                                    ) : (
                                        <button onClick={() => handleChange(don.user_id, 'true')} className="bg-green-700 p-2 text-white rounded mt-2">
                                            Approve
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPage;
