import { useForm } from "react-hook-form"
import BackButton from "./BackButton";

export default function LoginForm({typeOfUser, setOnLoginScreen, setLoginType}){
    const { register, handleSubmit, formState: {errors}} = useForm();
    const back = ()=>{
        setOnLoginScreen()
        setLoginType()
    }
    const onSubmit = async(data)=> {
        /*try {
            const responseLogin = await login(data.username, data.password);
            if(responseLogin === null){
                alert("Failed Login")
            }else{
                If we 
                const dataToCokie= {
                    accountId:responseLogin.accountId,
                    userName:responseLogin.email,
                    role: typeOfUser}
                await setCookie("userInfo", dataToCokie,{secure: false, maxAge: 1800});
                window.location.href="/home";
                
            }
        } catch (error) {
            console.log(error)
        } */
       console.log(data)
    };
    return(
       <section>
            <BackButton functionToCall={back}/>
            <section className="registerPage">
                <section className="registerCard">
                    <header className="roleText">JobLy {typeOfUser}</header>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input className="emailInputSection" name="email" placeholder="Email" {...register("email", { 
                                    required:{
                                        value: true,
                                        message: 'Please enter a valid Email'
                                    }
                                    })}/>
                        <input className="passwordInputSection" type="password" name="password" placeholder="Password" {...register("password", { 
                                    required:{
                                        value: true,
                                        message: 'Please set a Password'
                                    }
                                    })}/>
                        <button type="submit">Login</button>
                    </form>
                </section>
            </section>
        </section>
    )
}