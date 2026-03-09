import {jobPostingApi} from "../../utils/api.js";
import JobPostingForm from "../company-portal/JobPostingForm.jsx";

/*
Notes for future timmi:
- Needs to check if they hve already applied
- Need to check if theya re a company (companies cannot apply, but they can view the details), so check the user role
- if it's a company and they look at their own job posting, maybe provide a redirect tothe edit job posting?
- Still need to apply search inputs and the tags 
- The tags should be set, so whatever is implemented in the backend just copy that

*/

export default function JobDetailsForm({posting, onSuccess, onCancel}) {
    return (
        <JobPostingForm 
            initialValues={{
                title: posting?.title ?? "",
                location: posting?.location ?? "",
                description: posting?.description ?? "",
            }}
            submitLabel="Apply"
            submittingLabel="Applying..."
            onCancel={onCancel}
            onSubmit={async (values) => {
                await jobPostingApi.apply(); // TODO: needs to pass in users id 
                onSuccess?.(values);
            }}
        
        />
    )
}