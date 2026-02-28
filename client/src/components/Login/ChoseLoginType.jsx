import LoginForm from "./LoginForm";
import ChooseUserTypeFlow from "../UserType/ChooseUserTypeFlow";

export default function ChoseLoginType(){
    const goHome = () => (window.location.href = "/");

    return (
        <ChooseUserTypeFlow 
            titleText="You Are Logging In As An"
            onBack={goHome}
            bottomButton={
                <button onClick={() => (window.location.href = "/register")}>
                    I don't have an account
                </button>
            }
            footer={
                <footer>
                    Admin Login{" "}
                    <span onClick={() => (window.location.href = "/admin-login")} style={{ cursor: "pointer" }}>
                        <u>Here</u>
                    </span>
                </footer>
            }
            renderNext={(type, helpers) => {
                <LoginForm
                    typeOfUser={type}
                    setLoginType={helpers.setSelectedType}
                    setOnLoginScreen={helpers.setOnNextScreen}
                />
            }}
        />
    );
}