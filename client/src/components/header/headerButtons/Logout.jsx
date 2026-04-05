import "./HeaderButton.css"
import { clearToken } from "../../../utils/api";
import { useNavigate } from "react-router-dom";

function Logout() {
    let navigate = useNavigate();
    function handleUserLogout(){
        clearToken();
        navigate("/");
        window.location.reload();
    };

    return (
        <button className="header-button" onClick={handleUserLogout}>
            Logout
        </button>
    )
};

export default Logout;