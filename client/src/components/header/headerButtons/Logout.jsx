import "./HeaderButton.css"
import { clearToken } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import {successEvent } from "../../../utils/toast/successEvent.js";

function Logout() {
    const success = successEvent("Logging out...");
    const navigate = useNavigate();

    function sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function handleUserLogout(){
        clearToken();
        navigate("/");
        success();
        sleep(1800).then(() => {
            window.location.reload();
        });
        
    };

    return (
        <button className="header-button" onClick={handleUserLogout}>
            Logout
        </button>
    )
};

export default Logout;