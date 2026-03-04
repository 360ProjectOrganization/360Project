import { jobPostingApi } from "../../utils/api.js";
import JobPostingForm from "./JobPostingForm.jsx";

export default function EditJobForm({ posting, onSuccess, onCancel }) {
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
                //TODO: add API call when it is implemented, basic example below, could change depedning on how API endpoint is implemented
                // await jobPostingApi.updateJobPosting(posting._id, values);
                onSuccess?.(values);
            }}
        />
    );
}