import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../BackButton";
import { authApi, setToken, setAuthUser } from "../../../utils/api.js";
import { useState } from "react";
import { successEvent } from "../../../utils/toast/successEvent.js";
import { usePfp } from "../../../context/ProfilePictureContext.jsx";

export default function LoginForm({ typeOfUser, setOnLoginScreen, setLoginType }) {
    const success = successEvent("Successfully Logged In")
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const returnTo = location.state?.returnTo || "/";
    const openPostingId = location.state?.openPostingId || null;
    const { refreshPfp } = usePfp();

    const back = ()=>{
        setOnLoginScreen(false)
        setLoginType(null)
    }
    const [errorMessage, setErrorMessage] = useState()
    const onSubmit = async(data)=> {
        try {
            const payload = {
                role: typeOfUser === "Admin"
                    ? "administrator"
                    : typeOfUser === "Employer"
                    ? "company"
                    : "applicant",
                email: data.email,
                password: data.password

            }
            const response = await authApi.login(payload);
            setToken(response.token);
            setAuthUser(response.user);
            refreshPfp();
            navigate(returnTo, {
                state: openPostingId ? { openPostingId } : undefined,
            });
            success();
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
