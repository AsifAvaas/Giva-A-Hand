import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Auth/Login';
import Signup from './Pages/Auth/Signup';
import Profile from './Pages/Profile';
import AdminLogin from './Pages/Auth/AdminLogin';
import AdminPage from './Pages/AdminPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/home" element={<AdminPage />} />
        </Routes>
    );
}

export default App;
