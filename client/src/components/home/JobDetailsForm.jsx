import { jobPostingApi } from "../../utils/api.js";
import JobPostingForm from "../company-portal/JobPostingForm.jsx";

export default function JobDetailsForm({ posting, onSuccess, onCancel }) {
    return (
        <JobPostingForm
            initialValues={{
                title: posting?.title ?? "",
                location: posting?.location ?? "",
                description: posting?.description ?? "",
            }}
            submitLabel="Update"
            submittingLabel="Saving..."
            onCancel={onCancel}
            onSubmit={async (values) => {
                await jobPostingApi.update(posting._id, values);
                onSuccess?.(values);
            }}
        />
    )
}