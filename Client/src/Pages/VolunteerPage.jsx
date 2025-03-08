import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import axios from 'axios';

function VolunteerPage() {
    const backend = import.meta.env.VITE_BACKEND_PORT;
    const [volunteers, setVolunteers] = useState([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        axios
            .get(`${backend}/api/volunteers/users`)
            .then((response) => {
                setVolunteers(response.data.volunteers);
                console.log(response.data.volunteers);
            })
            .catch((error) => {
                console.error('There was an error fetching the volunteers!', error);
            });
    }, []);

    const handleConnect = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setIsModalOpen(true);
        setMessage('');
        setError(null);
        setSuccess(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVolunteer(null);
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

        try {
            const response = await axios.post(`${backend}/api/request`, {
                seeker_id: localStorage.getItem('userID'),
                helper_id: selectedVolunteer.volunteer_id,
                helper_type: 'volunteers',
                message: message,
            });

            if (response.status === 201) {
                setSuccess('Message sent successfully!');
                setIsModalOpen(false);
                setMessage('');
            } else {
                setError('Failed to send message. Try again.');
            }
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Error sending message. Please try again later.');
        }

        setLoading(false);
    };

    return (
        <div>
            <Navbar />
            <div className="container p-6" style={{ marginTop: '80px' }}>
                {volunteers.length > 0 ? (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-4">Volunteers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {volunteers.map((volunteer) => (
                                <div key={volunteer.user_id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                                    <img src={volunteer.profile_pic} alt="profile photo" />
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
                                    <button onClick={() => handleConnect(volunteer)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                        Connect
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 text-center mt-4">No volunteers found.</p>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && selectedVolunteer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-2">Connect with {selectedVolunteer.name}</h2>
                        <p className="text-gray-700 mb-4">
                            <strong>Email:</strong> {selectedVolunteer.email}
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

export default VolunteerPage;
