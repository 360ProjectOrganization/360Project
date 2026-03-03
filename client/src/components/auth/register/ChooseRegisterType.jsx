import { Link, useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import ChooseUserTypeFlow from "../ChooseUserTypeFlow";

export default function ChooseRegisterType() {
    const navigate = useNavigate();
    const goHome = () => navigate("/");

    return (
        <ChooseUserTypeFlow 
            titleText="You Are Registering As An"
            onBack={goHome}
            bottomButton={
                <Link to="/Login" className="register-card-link-button">
                    I already have an account
                </Link>
            }
            renderNext={(type, helpers) => (
                <RegisterForm
                    typeOfUser={type}
                    setOnRegisterScreen={helpers.setOnNextScreen}
                    setRegisterType={helpers.setSelectedType}
                />
            )}
        />
    );
}
