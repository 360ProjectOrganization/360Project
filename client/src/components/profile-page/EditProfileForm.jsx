import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { authApi, clearToken } from "../../utils/api";
import "./EditProfileForm.css"

function EditProfileForm(){
    const navigate = useNavigate();
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");

    async function handleNewEmail(e){
        e.preventDefault();
        try {
            const payload = {
                newEmail,
                password
            };
            await authApi.changeEmail(payload);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    async function handleNewPassword(e){
        e.preventDefault();
        if(newPassword != newPassword2) return;
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
            console.log(error)
        }
    }

    return(
        <>
            <div id="edit-profile-section">
                <form id="edit-profile-form">
                    <div className="update-section">
                        <p>Change Email</p>
                        
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

                        <br />
                        <button 
                            id="change-email-button"
                            onClick={handleNewEmail}
                        >
                            Update Email
                        </button>
                    </div>

                    <div className="update-section">
                        <p>Change Password</p>
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
                            onChange={(e) => setNewPassword2(e.target.value)}
                        />
                        <br />

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