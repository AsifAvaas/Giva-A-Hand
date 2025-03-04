import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Admin() {
    const [notices, setNotices] = useState([]);
    const navigate = useNavigate();
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

    return (
        <div className="container min-h-48 ">
            <button onClick={() => navigate('/newNotice')}>Add a notice</button>
            {notices.length > 0 &&
                notices.map((notice, index) => (
                    <div onClick={() => navigate(`/notice/${notice.notice_id}`)} key={index} className="border p-2 my-2">
                        <h2>{notice.notice_id}</h2>
                        <h2>{notice.notice_title}</h2>
                        <p>{notice.notice_message}</p>
                        <img src={notice.notice_pic} alt={notice.notice_title} />
                    </div>
                ))}
        </div>
    );
}

export default Admin;
