import ChoseLoginType from "../components/Login/ChoseLoginType";
import Header from "../components/header/Header";

export default function LoginPage(loginType){
    return(
        <>
            <Header />
            <ChoseLoginType/>
        </>
    )
}