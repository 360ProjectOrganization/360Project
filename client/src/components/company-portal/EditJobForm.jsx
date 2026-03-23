import { useState } from "react";
import { jobPostingApi } from "../../utils/api.js";
import JobPostingForm from "./JobPostingForm.jsx";
import CloseStatus from "./CloseStatus.jsx";

export default function EditJobForm({ posting, onClosePosting, onSuccess, onCancel }) {
    const [postingToClose, setPostingToClose] = useState(null);
    const [statusResetTrigger, setStatusResetTrigger] = useState(0);
    const [closureReason, setClosureReason] = useState(null);

    return (
        <>
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
                statusResetTrigger={statusResetTrigger}
                onStatusChange={(newStatus) => {
                    if (newStatus === "CLOSED") setPostingToClose(posting);
                }}
                onCancel={onCancel}
                onSubmit={async (values) => {
                    const payload = values.status === "CLOSED" ? { ...values, closureReason: closureReason ?? posting?.closureReason } : values;
                    await jobPostingApi.update(posting._id, payload);
                    onSuccess?.(payload);
                }}
            />
            <CloseStatus
                postingToClose={postingToClose}
                onClose={() => {
                    setStatusResetTrigger((t) => t + 1);
                    setPostingToClose(null);
                }}
                onClosePosting={async (jobId, reason) => {
                    setClosureReason(reason);
                    await onClosePosting?.(jobId, reason);
                    setPostingToClose(null);
                }}
            />
        </>
    );
}