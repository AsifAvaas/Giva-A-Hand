import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Auth/Login';
import Signup from './Pages/Auth/Signup';
import Profile from './Pages/Profile';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
}

export default App;
