import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getToken, applicantApi } from "../../utils/api.js";
import "./ProfilePicture.css";

function ProfilePicture() {
    const [token, setToken] = useState("");
    const [id, setId] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        const available_token = getToken();
        if(available_token){
            setToken(available_token);
        };
    }, [])

    useEffect(() => {
        if(!token) return;
        const decoded = jwtDecode(token);
        setId(decoded.id);
    }, [token])

    useEffect(() => {
        async function getUserPfp(){
            if(id){
                const userPfpURL = applicantApi.getPfpUrl(id);
                const options = {
                    method: "GET"
                }
                let response = await fetch(userPfpURL, options);

                if(response.status === 200){
                    const imageBlob = await response.blob();
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    setImage(imageObjectURL);
                }
            }
        }
        getUserPfp();
    }, [id])

    return (
        <>
            <div id="pfp-container">
                <img 
                    src={image}
                    alt="pfp"
                    style={{maxWidth: "40%"
                        }}
                ></img>
            </div>
        </>
    )
}

export default ProfilePicture;