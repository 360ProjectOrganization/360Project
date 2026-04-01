import { useForm } from "react-hook-form"
import { authApi } from "../../utils/api";
import { validateRegisterForm } from "../../utils/validation/validateRegisterForm";
import { useState } from "react";

export default function CreateNewAdminForm(){
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const [errors, setErrors] = useState({});
    const [createdAdmin, setCreatedAdmin] = useState(false);

    const {register, handleSubmit, reset} = useForm();
    const onSubmit = (async (newAdminInfo)=>{
        try {
            setErrors({});
            const inputError = validateRegisterForm({name: newAdminInfo.username, email: newAdminInfo.email, password: newAdminInfo.password, confirmPassword: newAdminInfo.confirmPassword}, "administrator");
            setErrors(inputError);
            if (Object.keys(inputError).length > 0) {
               return;
            }   
            const payload = {
                role:  "administrator",
                email: newAdminInfo.email,
                password: newAdminInfo.password,
                name: newAdminInfo.username
            };
            console.log("Creating new admin with payload:", payload);
            await authApi.register(payload);
            console.log("New admin created successfully");
            reset();
            setCreatedAdmin(true);
            await delay(2000);
            setCreatedAdmin(false);
        } catch (err) {
            console.error("Error creating new admin:", err);
        }
    })
    return(
        <section className="registerPage">
            <form onSubmit={handleSubmit(onSubmit)} className="registerCard ">
            <h2 className="roleText">Create New Admin</h2>
            <input type="text" name="" id="" placeholder="Username" {...register("username")}/>
            {errors.name && <p className="error">{errors.name}</p>}
            <input type="email" name="" id="" placeholder="Email" {...register("email")}/>
            {errors.email && <p className="error">{errors.email}</p>}
            <input type="password" name="" id=""placeholder="Password" {...register("password")}/>
            {errors.password && <p className="error">{errors.password}</p>}
            <input type="password" name="" id=""placeholder="Confirm Password" {...register("confirmPassword", {required:{value: true}})}  />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            <button type="submit">Create New Admin</button>
            {createdAdmin && <p className="success">New admin created successfully!</p>}
        </form>
        </section>
    )
}