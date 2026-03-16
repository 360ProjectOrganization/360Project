import { useState, useEffect } from "react";
import "./EditProfileForm.css"

function EditProfileForm(){

    return(
        <>
            <div id="edit-profile-section">
                <form id="edit-profile-form">
                    <h2>Edit Profile</h2>
                    <div className="update-section">
                        <p>Change Email?</p>
                        
                        <label>New Email: </label>
                        <input type="text"/>

                        <br />
                        <label>Password: </label>
                        <input type="password"/>

                        <br />
                        <button id="change-email-button">
                            Update Email
                        </button>
                    </div>

                    <div className="update-section">
                        <p>Change Password</p>
                        <button id="change-password-button">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default EditProfileForm;