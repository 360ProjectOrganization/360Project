import { useForm } from "react-hook-form"

export default function CreateNewAdminForm(){
    const {register, handleSubmit} = useForm();
    const onSubmit = ((newAdminInfo)=>{
        console.log(newAdminInfo)
    })
    return(
        <section className="registerPage">
            <form onSubmit={handleSubmit(onSubmit)} className="registerCard ">
            <h2 className="roleText">Create New Admin</h2>
            <input type="text" name="" id="" placeholder="Username" {...register("username", {required:{value: true}})}/>
            <input type="email" name="" id="" placeholder="Email" {...register("email", {required:{value: true}})} />
            <input type="password" name="" id=""placeholder="Password" {...register("password", {required:{value: true}})}  />
            <input type="password" name="" id=""placeholder="Confirm Password" {...register("confirmPassword", {required:{value: true}})}  />
            <button type="submit">Create New Admin</button>
        </form>
        </section>
    )
}