import { useForm } from "react-hook-form"
import { authApi } from "../../utils/api";
import { validateRegisterForm } from "../../utils/validation/validateRegisterForm";
import { useState } from "react";

export default function CreateNewAdminForm(){

    const [errors, setErrors] = useState({});

    const {register, handleSubmit, reset} = useForm();
    const onSubmit = ((newAdminInfo)=>{
        try {
            setErrors(validateRegisterForm({name: newAdminInfo.username, email: newAdminInfo.email, password: newAdminInfo.password, confirmPassword: newAdminInfo.confirmPassword}, "administrator"));
            if (Object.keys(inputErrors).length > 0) {
            return;
            }   
            const payload = {
                role:  "administrator",
                email: newAdminInfo.email,
                password: newAdminInfo.password,
                name: newAdminInfo.username
            };
            console.log("Creating new admin with payload:", payload);
            authApi.register(payload);
            console.log("New admin created successfully");
            reset();
        } catch (err) {
            console.error("Error creating new admin:", err);
        }
    })
    return(
        <section className="registerPage">
            <form onSubmit={handleSubmit(onSubmit)} className="registerCard ">
            <h2 className="roleText">Create New Admin</h2>
            <input type="text" name="" id="" placeholder="Username" {...register("username", {required:{value: true}})}/>
            {errors.name && <p className="error">{errors.name}</p>}
            <input type="email" name="" id="" placeholder="Email" {...register("email", {required:{value: true}})} />
            {errors.email && <p className="error">{errors.email}</p>}
            <input type="password" name="" id=""placeholder="Password" {...register("password", {required:{value: true}})}  />
            {errors.password && <p className="error">{errors.password}</p>}
            <input type="password" name="" id=""placeholder="Confirm Password" {...register("confirmPassword", {required:{value: true}})}  />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            <button type="submit">Create New Admin</button>
        </form>
        </section>
    )
}