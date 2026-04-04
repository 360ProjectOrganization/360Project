import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, clearToken } from "../../utils/api";
import "./EditProfileForm.css";
import { validateEmailChange } from "../../utils/validation/validateEmailChange";
import { validatePasswordChange } from "../../utils/validation/validatePasswordChange";

function EditProfileForm(){
    const navigate = useNavigate();
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordRetype, setPasswordRetype] = useState("");

    const [errors, setErrors] = useState([]);
    const [textErrorEmail, setTextErrorEmail] = useState("");
    const [textErrorPassword, setTextErrorPassword] = useState("");

    async function handleNewEmail(e){
        e.preventDefault();
        const emailError = validateEmailChange({email: newEmail})
        setErrors(emailError);
        if (Object.keys(emailError).length > 0) {
            return;
        }
        try {
            const payload = {
                newEmail,
                password
            };
            await authApi.changeEmail(payload);
            navigate("/");
            clearToken();
            window.location.reload();
        } catch (error) {
            setTextErrorEmail("Incorrect Password");
        }
    };

    async function handleNewPassword(e){
        e.preventDefault();
        const passwordError = validatePasswordChange({password: newPassword, confirmPassword: passwordRetype});
        setErrors(passwordError);
        if (Object.keys(passwordError).length > 0) {
            return;
        }
        try {
            const payload = {
                currentPassword,
                newPassword
            };
            await authApi.changePassword(payload);
            navigate("/");
            clearToken();
            window.location.reload();
        } catch (error) {
            setTextErrorPassword("Incorrect Old Password");
        }
    };

    return(
        <>
            <div id="edit-profile-section">
                <form id="edit-profile-form">
                    <div className="update-section">
                        <p><strong>Change Email</strong></p>
                        <label>New Email: </label>
                        <input type="email" placeholder="abc@example.com" onChange={(e) => setNewEmail(e.target.value)}/>
                        <br />
                        <label>Password: </label>
                        <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
                        <p className="error-text">{errors.email ? errors.email : textErrorEmail}</p>
                        <button id="change-email-button" onClick={handleNewEmail}>
                            Update Email
                        </button>
                    </div>

                    <div className="update-section">
                        <p><strong>Change Password</strong></p>
                        <label>Old Password: </label>
                        <input type="password" placeholder="password" onChange={(e) => setCurrentPassword(e.target.value)}/>
                        <br />
                        <label>New Password: </label>
                        <input type="password" placeholder="new password" onChange={(e) => setNewPassword(e.target.value)} />
                        <br />
                        <label>Retype New Password: </label>
                        <input type="password" placeholder="retype new password" onChange={(e) => setPasswordRetype(e.target.value)} />
                        <br />
                        <p className="error-text">{errors.password ? errors.password : errors.confirmPassword ? errors.confirmPassword : textErrorPassword}</p>
                        <button id="change-password-button" onClick={handleNewPassword}>
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default EditProfileForm;