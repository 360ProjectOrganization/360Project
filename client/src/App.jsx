import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import CompanyPortalPage from './pages/CompanyPortalPage.jsx';

function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/Login" element={<LoginPage/>} />
                <Route path='/profile' element={<ProfilePage />} />
                <Route path='/company-portal' element={<CompanyPortalPage />} />
            </Routes>
        </div>
    );
}

export default App;
