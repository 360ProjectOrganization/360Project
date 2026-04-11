import { toast } from "react-toastify";

export function successEvent(sentence){
    const accept = () => {
        toast.success(`${sentence}`, {
            autoClose: 1600,
        });
    }
    return accept;
}