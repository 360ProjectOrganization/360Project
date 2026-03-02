import { Link, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import ChooseUserTypeFlow from "../ChooseUserTypeFlow";

export default function ChoseLoginType(){
    const navigate = useNavigate();
    const goHome = () => navigate("/");

    return (
        <ChooseUserTypeFlow 
            titleText="You Are Logging In As An"
            onBack={goHome}
            bottomButton={
                <Link to="/register" className="register-card-link-button">
                    I don't have an account
                </Link>
            }
            footer={(selectAdmin) => (
                <footer>
                    Admin Login{" "}
                    <u style={{ cursor: "pointer" }} onClick={selectAdmin}>Here</u>
                </footer>
            )}
            renderNext={(type, helpers) => (
                <LoginForm
                    typeOfUser={type}
                    setLoginType={helpers.setSelectedType}
                    setOnLoginScreen={helpers.setOnNextScreen}
                />
            )}
        />
    );
}
