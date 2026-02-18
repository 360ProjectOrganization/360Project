import applicantImg from "../../imgs/Applicant.png";
import employerImg from "../../imgs/Employer.png";
import { useState } from 'react'
import LoginForm from "./LoginForm";
import BackButton from "./BackButton";
export default function ChoseLoginType(){
    const[onLoginScreen,setOnLoginScreen] = useState(false);
    const[loginType, setLoginType] = useState()
    console.log(onLoginScreen,loginType)
    const setLoginTypeAdmin = ()=>{
        setLoginType("Admin");
        setOnLoginScreen(true);
    }
    const setLoginTypeApplicant = ()=>{
        setLoginType("Applicant");
        setOnLoginScreen(true);
    }
    const setLoginTypeEmployer = ()=>{
        setLoginType("Employer");
        setOnLoginScreen(true);
    }
    const goHome = ()=>{
        window.location.href="/";
    }
    //DO NOT FORGET ABOUT THIS
    const register = ()=>{
        // TO-DO LINK TO REGISTER HANDLER
        window.location.href="/";
    }


    return(
        <section>
           { !onLoginScreen &&(
            <section>
                <BackButton functionToCall={goHome}/>
                <header>You Are Logging In As An</header>
                <section>
                    <figure>
                        <figcaption>Applicant</figcaption>
                        <img src={applicantImg} alt="" onClick={setLoginTypeApplicant}/>
                        
                    </figure>
                    <figure onClick={setLoginTypeEmployer}>
                        <figcaption>Employer</figcaption>
                        <img src={employerImg} alt="" onClick={setLoginTypeEmployer}/>
                    </figure>
                </section>
                <button onClick={register}>I Don't Have An Account</button>
                <footer>Admin Login <span onClick={setLoginTypeAdmin}><u>Here</u></span></footer>
            </section>)}
            {onLoginScreen&&(<LoginForm typeOfUser = {loginType} setLoginType={setLoginType} setOnLoginScreen = {setOnLoginScreen}/>)}
        </section>
    )
}