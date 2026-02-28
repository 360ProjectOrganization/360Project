import RegisterForm from "./RegisterForm";
import ChooseUserTypeFlow from "../UserType/ChooseUserTypeFlow";

export default function ChooseRegisterType() {
    const goHome = () => (window.location.href = "/");
    
    return (
        <ChooseUserTypeFlow 
            titleText="You Are Registering As An"
            onBack={goHome}
            bottomButton={
                <button onClick={() => (window.location.href = "/Login")}>
                    I already have an account
                </button>
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