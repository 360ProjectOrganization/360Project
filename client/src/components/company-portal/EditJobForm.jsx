import { jobPostingApi } from "../../utils/api.js";
import JobPostingForm from "./JobPostingForm.jsx";

export default function EditJobForm({ posting, onSuccess, onCancel }) {
    return (
        <JobPostingForm
            initialValues={{
                title: posting?.title ?? "",
                location: posting?.location ?? "",
                description: posting?.description ?? "",
                status: posting?.status ?? "ACTIVE",
                tags: posting?.tags ?? [],
            }}
            submitLabel="Update"
            submittingLabel="Saving..."
            showStatusField={true}
            showTagsField={true}
            onCancel={onCancel}
            onSubmit={async (values) => {
                await jobPostingApi.update(posting._id, values);
                onSuccess?.(values);
            }}
        />
    );
}