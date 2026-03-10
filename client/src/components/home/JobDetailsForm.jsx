import { jobPostingApi } from "../../utils/api.js";
import JobPostingForm from "../company-portal/JobPostingForm.jsx";

export default function JobDetailsForm({ posting, role, onSuccess, onCancel }) {

    switch (role) {
        case "company":
            return (
                <>
                    COMPANY
                </>
            );
        case "applicant":
            return (
                <>
                    APPLICANT
                </>
            );
        case "administrator":
            return (
                <>
                    ADMIN
                </>
            );
        default:
            return (
                <>
                    need to login / register
                </>
            );
    }

}