import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getToken, applicantApi, companyApi, adminApi } from "../../utils/api.js";

function ProfilePicture() {
    const [token, setToken] = useState("");
    const [id, setId] = useState("");
    const [role, setRole] = useState("");
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
        setRole(decoded.role);
        setId(decoded.id);
    }, [token, role])

    useEffect(() => {
        async function getUserPfp(){
            if(id){
                let url = ""
                switch(role){
                    case "applicant":
                        url = applicantApi.getPfpUrl(id);
                        break;
                    case "company":
                        url = companyApi.getPfpUrl(id);
                        break;
                    case "administrator":
                        url = adminApi.getPfpUrl(id);
                        break;
                    default:
                        return;
                }
                
                let response = await fetch(url, {
                    method: "GET"
                });
                
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
            <div>
                <img id="pfp"
                    src={image}
                    alt="pfp"
                    style={{
                            width: "3.5em",
                            height:"3.5em",
                            padding: "0.5em",
                            borderRadius: "6em"
                        }}
                ></img>
            </div>
        </>
    )
}

export default ProfilePicture;