import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Auth/Login';
import Signup from './Pages/Auth/Signup';
import Profile from './Pages/Profile';
import AdminLogin from './Pages/Auth/AdminLogin';
import AdminPage from './Pages/AdminPage';
import VolunteerPage from './Pages/VolunteerPage';
import DoctorPage from './Pages/DoctorPage';
import BloodDonor from './Pages/BloodDonor';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/home" element={<AdminPage />} />
            <Route path="/volunteer/page" element={<VolunteerPage />} />
            <Route path="/doctor/page" element={<DoctorPage />} />
            <Route path="/BloodDonor/page" element={<BloodDonor />} />
        </Routes>
    );
}

export default App;
