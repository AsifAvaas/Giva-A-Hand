import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import axios from 'axios';

function DoctorPage() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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

    const handleConnect = (doctor) => {
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
        setMessage('');
        setError(null);
        setSuccess(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDoctor(null);
        setMessage('');
        setError(null);
        setSuccess(null);
    };

    const handleSendMessage = async () => {
        if (!message.trim()) {
            setError('Message cannot be empty');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        console.log(selectedDoctor.doctor_id);
        try {
            const response = await axios.post('http://localhost:8000/api/request', {
                seeker_id: localStorage.getItem('userID'),
                helper_id: selectedDoctor.doctor_id,
                helper_type: 'doctors',
                message: message,
            });

            if (response.status === 201) {
                setSuccess('Message sent successfully!');
                console.log('Message sent successfully!');
                setIsModalOpen(false);
                setMessage('');
            } else {
                setError('Failed to send message. Try again.');
                console.log('Failed to send message. Try again.');
            }
        } catch (err) {
            setError('Error sending message. Please try again later.');
            console.log('Error sending message. Please try again later.');
            console.log(err);
        }

        setLoading(false);
    };

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
                                    <button onClick={() => handleConnect(doctor)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                        Connect
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 text-center mt-10">No doctors found.</p>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && selectedDoctor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-2">Connect with {selectedDoctor.name}</h2>
                        <p className="text-gray-700 mb-4">
                            <strong>Email:</strong> {selectedDoctor.email}
                        </p>
                        <textarea className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" rows="4" placeholder="Write your message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        {success && <p className="text-green-500 mt-2">{success}</p>}
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                Close
                            </button>
                            <button onClick={handleSendMessage} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorPage;
