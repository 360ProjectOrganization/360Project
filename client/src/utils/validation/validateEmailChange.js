export function validateEmailChange({email}){
    const errors = {};
    const trimmedEmail = email.trim();

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
    return errors;
}