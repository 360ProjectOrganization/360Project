export function validateRegisterForm({name, email, password, confirmPassword}, role) {
    const errors = {};
    const isEmployer = role === "employer";

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    //Name rules
    if (!trimmedName) {
        errors.name = isEmployer ? "Company name is required" : "Full name is required";
    }
    else if (!isEmployer) { // applicant name should be first and last name
        const parts = trimmedName.split(/\s+/);

        if (parts.length < 2) {
            errors.name = "Enter first and last name";
        }
    }

    //Email rules 
    if (!trimmedEmail) {
        errors.email = "Email is required";
    }
    else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(trimmedEmail)) {
            errors.email = "Invalid email";
        }
    }

    //Passwor drules
    if (!password) {
        errors.password = "Email is required";
    }
    else {
        if (password.length < 8) errors.password = "Password must be at least 8 characters";
        else if (!/[A-Z]/.test(password)) errors.password = "Password must include an uppercase letter";
        else if (!/[a-z]/.test(password)) errors.password = "Password must include a lowercase letter";
        else if (!/[0-9]/.test(password)) errors.password = "Password must include an uppercase letter";
    }

    //confirm password stuff
    if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    }
    else if (confirmPassword !== password) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors; // if errors is empty then input is valid, otherwise the input it invalid
}