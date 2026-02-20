import "./HeaderButton.css"
import { clearToken } from "../../../utils/api";

function Logout() {
    function handleUserLogout(){
        clearToken();
    };

    return (
        <button className="logout-button" onClick={handleUserLogout}>
            <a href="/"> {/* To be added later */}
                Logout
            </a>
        </button>
    )
};

export default Logout;