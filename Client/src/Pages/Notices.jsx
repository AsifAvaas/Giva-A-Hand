import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import axios from 'axios';

function Notices() {
    const [notices, setNotices] = useState([]);
    const userId = localStorage.getItem('userID');
    const fetchNotices = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/notice');

            if (response.status === 201) {
                setNotices(response.data.data);
                console.log(response.data.data);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleJoin = async (notice_id) => {
        console.log(notice_id);
        try {
            const response = await axios.post('http://localhost:8000/api/noticeGet', {
                notice_id,
                user_id: userId,
            });

            if (response.status === 201) {
                console.log(response.data);
                alert("You've joined the cause");
            } else {
                console.error(response.data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="mt-24 min-h-36">
                    {' '}
                    {notices.length > 0 &&
                        notices.map((notice, index) => (
                            <div key={index} className="border p-2 my-2">
                                <h1>{notice.notice_id}</h1>
                                <h2>{notice.notice_title}</h2>
                                <p>{notice.notice_message}</p>
                                {notice.notice_pic && <img src={notice.notice_pic} alt={notice.notice_title} />}
                                <button className="mt-2" onClick={() => handleJoin(notice.notice_id)}>
                                    Join the cause
                                </button>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Notices;
