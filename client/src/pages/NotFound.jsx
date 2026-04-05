import {Link} from "react-router-dom";

export default function NotFound() {
    return (
        <div className="not-found-container">
            <h1>404</h1>
            <p>That page doesn't exist.</p>
            <Link to="/">Go Home</Link>
        </div>
    );
}