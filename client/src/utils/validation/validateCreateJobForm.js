export function validateCreateJobForm({ title, location, description }) {
    const errors = {};

    if (!(title.trim())) errors.title = "Title is required";
    if (!(location.trim())) errors.location = "Location is required";
    if (!(description.trim())) errors.description = "Description is required";

    return errors;
}