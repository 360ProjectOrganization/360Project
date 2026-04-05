import { toast } from "react-toastify";

export function successEvent(){
    const accept = () => {
        toast.success("Resume Successfully Uploaded", {
            autoClose: 3500,
        });
    }
    return accept;
}