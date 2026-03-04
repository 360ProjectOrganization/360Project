import { jobPostingApi } from "../../utils/api";
import JobPostingForm from "./JobPostingForm";

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