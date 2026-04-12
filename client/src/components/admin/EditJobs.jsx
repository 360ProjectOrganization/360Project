import { validateCreateJobForm } from "../../utils/validation/validateCreateJobForm";
import { useEffect, useState } from "react"
import {jobPostingApi } from "../../utils/api";
import "../common/Card.css"
import { useForm } from "react-hook-form";
export default function EditJobs({setXButton, jobDetails, allCards, setAllCards, setFilteredCards}){
     const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const {register, handleSubmit} = useForm();
        const [thisTitle, setThisTitle] = useState(jobDetails.title);
        const [errors, setErrors] = useState({});
        const [editAdmin, setEditAdmin] = useState(false);
    
        const onSubmit = (async (updatedAdminInfo)=>{
            try {
                const inputError = validateCreateJobForm({title: updatedAdminInfo.title, location: updatedAdminInfo.location, description: updatedAdminInfo.description});
                setErrors(inputError);
                console.log("Validation errors:", inputError);
                if (Object.keys(inputError).length > 0) {
                    return;
                }
                const payload = {
                    title: updatedAdminInfo.title,
                    location: updatedAdminInfo.location,
                    description: updatedAdminInfo.description,
                    tags: updatedAdminInfo.tags?updatedAdminInfo.tags.split(", "): []
                };
                await jobPostingApi.update(jobDetails._id, payload);
                console.log(allCards);
                const newEntry = {
                    _id: jobDetails._id,
                    title: updatedAdminInfo.title,
                    location: updatedAdminInfo.location,
                    author: jobDetails.author,
                    tags: updatedAdminInfo.tags,
                    status: jobDetails.status,
                    description: updatedAdminInfo.description,

                };
                setThisTitle(updatedAdminInfo.title);
                const updatedList = [
                ...allCards.filter((job) => job._id !== jobDetails._id),
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
                        <h1>Edit {thisTitle}</h1>
                        <form className="editJobForm"onSubmit={handleSubmit(onSubmit)}>
                            <label htmlFor="">Title:
                            <input type="text" name="" id="" defaultValue={jobDetails.title} {...register("title")}/>
                            </label>
                            {errors.title && <p className="error">{errors.title}</p>}
                            <label htmlFor="">Location
                            <input type="text" name="" id="" defaultValue={jobDetails.location} {...register("location")}/>
                            </label>
                            {errors.location && <p className="error">{errors.location}</p>}
                            <label htmlFor="" >Description:
                            <textarea type="text" name="" id="" defaultValue={jobDetails.description} {...register("description")}/>
                            </label>
                            {errors.description && <p className="error">{errors.description}</p>}
                            <label htmlFor="">Tags:
                            <input type="text" name="" id=""  defaultValue={jobDetails.tags} {...register("tags")}/>
                            </label>
                            <button type="submit">Save</button>
                            {editAdmin && <p className="success">Job Updated successfully!</p>}
                        </form>
                    </section>
                </section>
            </section>
        )
}