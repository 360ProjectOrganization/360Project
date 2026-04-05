import { toast } from "react-toastify";

export function successEvent(itemString){
    const accept = () => {
        toast.success(`${itemString} Successfully Uploaded`, {
            autoClose: 3500,
        });
    }
    return accept;
}