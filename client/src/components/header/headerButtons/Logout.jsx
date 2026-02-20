import "./HeaderButton.css"
import { clearToken } from "../../../utils/api";

function Logout() {
    function handleUserLogout(){
        clearToken();
    };

    return (
        <button className="logout-button" onClick={handleUserLogout}>
            <a href="/">
                Logout
            </a>
        </button>
    )
};

export default Logout;