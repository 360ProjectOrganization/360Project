import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import RegisterApplicantPage from './pages/RegisterApplicantPage.jsx';
import RegisterEmployerPage from './pages/RegisterEmployerPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register-applicant" element={<RegisterApplicantPage />} />
                <Route path="/register-employer" element={<RegisterEmployerPage />} />
                <Route path="/Login" element={<LoginPage/>} />
            </Routes>
        </div>
    );
}

export default App;
