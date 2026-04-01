import { useForm } from "react-hook-form";
import { adminApi } from "../../utils/api";
import { useState } from "react";
import { validateRegisterForm } from "../../utils/validation/validateRegisterForm";

export default function EditAdmin({setXButton, userDetails, allCards, setAllCards, setFilteredCards}){
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const {register, handleSubmit} = useForm();
    const [thisName, setThisName] = useState(userDetails.name);
    const [errors, setErrors] = useState({});
    const [editAdmin, setEditAdmin] = useState(false);

    const onSubmit = (async (updatedAdminInfo)=>{
        try {
            const inputError = validateRegisterForm({name: updatedAdminInfo.username, email: updatedAdminInfo.email, password: updatedAdminInfo.password === ""? "ThisWillPass3":updatedAdminInfo.password, confirmPassword: updatedAdminInfo.confirmPassword === ""? "ThisWillPass3":updatedAdminInfo.confirmPassword}, userDetails.type);
            setErrors(inputError);
            console.log("Validation errors:", inputError);
            if (Object.keys(inputError).length > 0) {
                return;
            }
            const payload = {
                role: userDetails.type,
                name: updatedAdminInfo.username,
                email: updatedAdminInfo.email,
                password: updatedAdminInfo.password
            };
            await adminApi.editUser(userDetails.id, payload);
            console.log(allCards);
            const newEntry = {
            _id: userDetails.id,
            name: updatedAdminInfo.username,
            email: updatedAdminInfo.email,
            type: userDetails.type
            };
            setThisName(updatedAdminInfo.username);
            const updatedList = [
            ...allCards.filter((user) => user._id !== userDetails.id),
            newEntry];
            setAllCards(updatedList);
            setFilteredCards(updatedList);
            setEditAdmin(true);
            await delay(2000);
            setEditAdmin(false);
            } catch (error) {
                console.error("Error updating admin information:", error);
            }
        });
    return(

        <section className="modal-overlay">
            <section className="registerCardAdmin" style={{"position": "relative", "border width": "2px", "border color": "black"}}> 
                <span className="Exit-Button" onClick={() => setXButton()}>X</span>
                <section>
                    <h1>Edit {thisName}</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="text" name="" id="" defaultValue={userDetails.name} {...register("username")}/>
                        {errors.name && <p className="error">{errors.name}</p>}
                        <input type="email" name="" id="" defaultValue={userDetails.email} {...register("email")}/>
                        {errors.email && <p className="error">{errors.email}</p>}
                        <input type="password" name="" id="" placeholder="Change Password" {...register("password")}/>
                        {errors.password && <p className="error">{errors.password}</p>}
                        <input type="password" name="" id="" placeholder="Confirm Password" {...register("confirmPassword")}/>
                        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                        <button type="submit">Save Changes</button>
                        {editAdmin && <p className="success">Account Updated successfully!</p>}
                    </form>
                </section>
            </section>
        </section>
    )

}