import { jobPostingApi } from "../../utils/api.js";
import JobPostingForm from "./JobPostingForm.jsx";

export default function CreateJobForm({ companyId, onSuccess, onCancel }) {
    return (
        <JobPostingForm
            submitLabel="Create"
            submittingLabel="Creating..."
            onCancel={onCancel}
            onSubmit={async (values) => {
                await jobPostingApi.createJobPosting(companyId, values);
                onSuccess?.();
            }}
        />
    );
}