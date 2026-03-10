import { jobPostingApi } from "../../utils/api.js";
import JobPostingForm from "../company-portal/JobPostingForm.jsx";

import CompanyJobPostingDetails from "./JobPostingModals/CompanyJobPostingDetails.jsx";
import ApplicantJobPostingDetails from "./JobPostingModals/ApplicantJobPostingDetails.jsx";
import AdminJobPostingDetails from "./JobPostingModals/AdminJobPostingDetails.jsx";

export default function JobDetailsForm({ posting, role, onSuccess, onCancel }) {

    const roleComponents = {
        company: CompanyJobPostingDetails,
        applicant: ApplicantJobPostingDetails,
        administrator: AdminJobPostingDetails
    };

    const RoleComponent = roleComponent[role];

    if (!RoleComponent) {
        return <>need to login / register</> // TODO: reroute them after saving the post they're wanting to look at somehow (figure out later)
    }

    return (
        <RoleComponent posting={posting} onSuccess={onSuccess} onCancel={onCancel} />
    );
}