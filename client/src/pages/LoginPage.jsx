import ChoseLoginType from "../components/auth/login/ChoseLoginType";
import Header from "../components/header/Header";

export default function LoginPage(loginType){
    return(
        <>
            <Header />
            <ChoseLoginType/>
        </>
    )
}