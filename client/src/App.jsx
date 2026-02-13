import { Routes, Route } from 'react-router-dom';
import RegisterApplicantPage from './pages/RegisterApplicantPage.jsx';
import RegisterEmployerPage from './pages/RegisterEmployerPage.jsx';

function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/register-applicant" element={<RegisterApplicantPage />} />
                <Route path="/register-employer" element={<RegisterEmployerPage />} />
            </Routes>
        </div>
    );
}

export default App;
