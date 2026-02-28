import ChooseRegisterType from "../components/auth/register/ChooseRegisterType";
import Header from "../components/header/Header";

export default function RegisterPage(registerType){
    return(
        <>
            <Header />
            <ChooseRegisterType/>
        </>
    )
}