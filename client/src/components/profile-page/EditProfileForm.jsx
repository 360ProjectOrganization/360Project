import { useState, useEffect } from "react";
import { authApi, setToken, setAuthUser } from "../../utils/api";
import "./EditProfileForm.css"

function EditProfileForm(){
    const [newEmail, setNewEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    async function handleNewEmail(e){
        e.preventDefault();
        try {
            const payload = {
                newEmail,
                currentPassword
            };
            const response = await authApi.changeEmail(payload);
        } catch (error) {
            console.log(error);
        }

    }

    return(
        <>
            <div id="edit-profile-section">
                <form id="edit-profile-form">
                    <div className="update-section">
                        <p>Change Email?</p>
                        
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
                            onChange={(e) => setCurrentPassword(e.target.value)}
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
                        <button 
                            id="change-password-button"
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