import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../utils/api.js";

export default function ProtectedRoute({ children, requiredRole }) {
    const token = getToken();

    if (!token) {
        return <Navigate to="/Login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        if (requiredRole && decoded.role !== requiredRole) {
            return <Navigate to="/" replace />;
        }

        return children;
    }
    catch (err) {
        return <Navigate to="/Login" replace />;
    }
}