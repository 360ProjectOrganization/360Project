import { useEffect, useState, createContext, useContext  } from "react";
import { jwtDecode } from "jwt-decode";
import { getToken, applicantApi, companyApi, adminApi } from "../utils/api";

const ProfilePictureContext = createContext(null);

export function ProfilePictureGlobal({children}){
    const [image, setImage] = useState("");
    const [token, setToken] = useState("");
    const [id, setId] = useState("");
    const [role, setRole] = useState("");
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const available_token = getToken();
        if(available_token){
            setToken(available_token);
        };
    }, [refresh]);
    
    useEffect(() => {
        if(!token) return;
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setId(decoded.id);
    }, [token, role]);

    useEffect(() => {
        if(!id || !role) return;
        async function getPfp(){
            let url = ""
            switch (role){
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
            const response = await fetch(url, { method: "GET" });
            const blob = await response.blob();
            setImage(URL.createObjectURL(blob));
        }
        getPfp();
    }, [id, role, refresh]);

    const refreshPfp = () => setRefresh(i => i + 1);

    return (
        <ProfilePictureContext.Provider value={{image, refreshPfp}}>
            {children}
        </ProfilePictureContext.Provider>
    );
}

export function usePfp(){
    const context = useContext(ProfilePictureContext);
    return context;
}