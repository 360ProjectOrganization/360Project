import applicantImg from "../../imgs/Applicant.png";
import employerImg from "../../imgs/Employer.png";
import "./login.css"
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
            <section className="background">
                <BackButton functionToCall={goHome}/>
                <section className="registerPage">
                    <section className="registerCard"> 
                        <h2 roleText>Are You Logging In As An</h2>
                        <section className = "imgContainer">
                            <figure>
                                <figcaption>Applicant</figcaption>
                                <img src={applicantImg} alt="" onClick={setLoginTypeApplicant}/>
                                
                            </figure>
                            <figure onClick={setLoginTypeEmployer}>
                                <figcaption>Employer</figcaption>
                                <img src={employerImg} alt="" onClick={setLoginTypeEmployer}/>
                            </figure>
                        </section>
                        <button type="submit" onClick={register}>I Don't Have An Account</button>
                    </section>
                    <footer>Admin Login <span onClick={setLoginTypeAdmin} style={{cursor: 'pointer'}}><u>Here</u></span></footer>
                </section>
            </section>)}
            {onLoginScreen&&(<LoginForm typeOfUser = {loginType} setLoginType={setLoginType} setOnLoginScreen = {setOnLoginScreen}/>)}
        </section>
    )
}