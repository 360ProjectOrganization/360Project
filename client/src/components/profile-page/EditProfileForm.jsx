import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, clearToken } from "../../utils/api";
import "./EditProfileForm.css";

function EditProfileForm(){
    const navigate = useNavigate();
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordRetype, setPasswordRetype] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    async function handleNewEmail(e){
        e.preventDefault();
        
        if(newEmail === "") {
            setEmailError("New Email Field Blank");
            return;
        }else if(!newEmail.includes("@") || !newEmail.includes(".")){
            setEmailError("Please enter valid email address");
            return;
        }else if(password === ""){
            setEmailError("Current Password is Required");
            return;
        }

        try {
            const payload = {
                newEmail,
                password
            };
            await authApi.changeEmail(payload);
            // Force user to sign in again
            navigate("/");
            clearToken();
            window.location.reload();
        } catch (error) {
            console.log(error);
            setEmailError("Incorrect Password");
        }
    }

    async function handleNewPassword(e){
        e.preventDefault();
        let pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$");

        if(currentPassword === "" || newPassword === "" || passwordRetype === ""){
            setPasswordError("One or more password fields is empty");
            return;
        }else if(!pattern.test(newPassword)){
            setPasswordError("Password Does not Meet Criteria");
            return;
        }else if(newPassword != passwordRetype){
            setPasswordError("Password and Retyped Password Don't Match");
            return;
        }

        try {
            const payload = {
                currentPassword,
                newPassword
            };
            await authApi.changePassword(payload);
            // Force user to sign in again
            navigate("/");
            clearToken();
            window.location.reload();
        } catch (error) {
            console.log(error);
            setPasswordError("Incorrect Old Password");
        }
    }

    return(
        <>
            <div id="edit-profile-section">
                <form id="edit-profile-form">
                    <div className="update-section">
                        <p><strong>Change Email</strong></p>
                        <label>New Email: </label>
                        <input 
                            type="email" 
                            placeholder="abc@example.com"
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <br />
                        <label>Password: </label>
                        <input 
                            type="password"
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="error-text">{emailError}</p>
                        <button 
                            id="change-email-button"
                            onClick={handleNewEmail}
                        >
                            Update Email
                        </button>
                    </div>

                    <div className="update-section">
                        <p><strong>Change Password</strong></p>
                        <p>Format: Atleast 1 uppercase, 1 lowercase, 1 number, 8+ length</p>
                        <label>Old Password: </label>
                        <input 
                            type="password"
                            placeholder="password"
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <br />
                        <label>New Password: </label>
                        <input 
                            type="password"
                            placeholder="new password"
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <br />
                        <label>Retype New Password: </label>
                        <input 
                            type="password"
                            placeholder="retype new password"
                            onChange={(e) => setPasswordRetype(e.target.value)}
                        />
                        <br />
                        <p className="error-text">{passwordError}</p>
                        <button 
                            id="change-password-button"
                            onClick={handleNewPassword}
                        >
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default EditProfileForm;