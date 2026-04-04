export function validatePasswordChange({password, confirmPassword}){
    const errors = {}
    
    //Password rules
    if (!password) {
        errors.password = "Password is required";
    }
    else {
        if (password.length < 8) errors.password = "Password must be at least 8 characters";
        else if (!/[A-Z]/.test(password)) errors.password = "Password must include an uppercase letter";
        else if (!/[a-z]/.test(password)) errors.password = "Password must include a lowercase letter";
        else if (!/[0-9]/.test(password)) errors.password = "Password must include a number";
    }

    //confirm password stuff
    if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    }
    else if (confirmPassword !== password) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
}