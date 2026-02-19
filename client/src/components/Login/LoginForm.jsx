import { useForm } from "react-hook-form"
import BackButton from "./BackButton";
import { authApi, setToken, setAuthUser } from "../../utils/api.js";
import { useState } from "react";
export default function LoginForm({typeOfUser, setOnLoginScreen, setLoginType}){
    const { register, handleSubmit} = useForm();
    const back = ()=>{
        setOnLoginScreen()
        setLoginType()
    }
    const [errorMessage, setErrorMessage] = useState()
    const onSubmit = async(data)=> {
        try {
            const payload = {
                role: typeOfUser === "Admin"
                    ? "admin"
                    : typeOfUser === "Employer"
                    ? "company"
                    : "applicant",
                email: data.email,
                password: data.password

            }
            const response = await authApi.login(payload);
            setToken(response.token);
            setAuthUser(response.user);
            window.location.href="/";
        } catch (error) {
            setErrorMessage(error.message || "Login failed")
        } 
    };
    return(
       <section className="background">
            <BackButton functionToCall={back}/>
            <section className="registerPage">
                <section className="registerCard">
                    <h2 className="roleText">JobLy {typeOfUser}</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="email"className="emailInputSection" name="email" placeholder="Email" {...register("email", { 
                                    required:{
                                        value: true
            
                                    }
                                    })}/>
                        <input className="passwordInputSection" type="password" name="password" placeholder="Password" {...register("password", { 
                                    required:{
                                        value: true,
                                    }
                                    })}/>
                        {errorMessage && (<p className="error">{errorMessage}</p>)}
                        <button type="submit">Login</button>
                    </form>
                </section>
            </section>
        </section>
    )
}