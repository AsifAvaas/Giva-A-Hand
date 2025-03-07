import { Routes, Route } from 'react-router-dom';

import '@fortawesome/fontawesome-free/css/all.min.css';

import Home from './Pages/Home';
import Login from './Pages/Auth/Login';
import Signup from './Pages/Auth/Signup';
import Profile from './Pages/Profile';
import AdminLogin from './Pages/Auth/AdminLogin';
import AdminPage from './Pages/AdminPage';
import VolunteerPage from './Pages/VolunteerPage';
import DoctorPage from './Pages/DoctorPage';
import BloodDonor from './Pages/BloodDonor';
import NewNotice from './Pages/NewNotice';
import Notices from './Pages/Notices';
import NoticeBoard from './Pages/NoticeBoard';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<AdminPage />} />
            <Route path="/volunteer/page" element={<VolunteerPage />} />
            <Route path="/doctor/page" element={<DoctorPage />} />
            <Route path="/BloodDonor/page" element={<BloodDonor />} />
            <Route path="/newNotice" element={<NewNotice />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/notice/:id" element={<NoticeBoard />} />
        </Routes>
    );
}

export default App;
