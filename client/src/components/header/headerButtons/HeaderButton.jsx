import { useNavigate } from "react-router-dom";
import "./HeaderButton.css";

function HeaderButton({title, link}){
    let naviagte = useNavigate();
    return(
        <button className="header-button" onClick={() => naviagte(link)}>
            {title}
        </button>
    )
}

export default HeaderButton;