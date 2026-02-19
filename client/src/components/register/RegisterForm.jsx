import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { validateRegisterForm } from "../../utils/validation/validateRegisterForm";
import { authApi, setToken, setAuthUser } from "../../utils/api.js";

export default function RegisterForm({ role }) {
    const isEmployer = role === "employer";

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitError("");

        const inputErrors = validateRegisterForm({ name, email, password, confirmPassword }, role);
        setErrors(inputErrors);

        //if errors is oempty then input is valid
        if (Object.keys(inputErrors).length > 0) {
            return;
        }

        setLoading(true); // in case user presses Reguster button multiple times, this should prevent multiple requests
        try {
            const payload = {
                role: isEmployer ? "company" : "applicant",
                email,
                password,
                name
            };

            const data = await authApi.register(payload);
            setToken(data.token);
            setAuthUser(data.user);
            navigate("/");
        }
        catch (err) {
            setSubmitError(err.message || "Registration failed");
        }
        finally { // doesnt matter if request fails or not
            setLoading(false);
        }
    }

    return (
        <section className="registerPage">

            {/* TODO: header will go here if we want it on the registration page (can be added when its implemented) */}

            <section className="registerCard">
                <h2>You are registering as an {" "}
                    <span className="roleText">
                        {isEmployer ? "employer" : "applicant"}
                    </span>
                </h2>

                <form onSubmit={handleSubmit}> {/*only inputs and button */}
                    <section className="nameInputSection">
                        <label>{isEmployer ? "Company Name" : "Full Name"}</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={isEmployer ? "Carson versus The Computer" : "Alice Chains"} />
                        {errors.name && <p className="error">{errors.name}</p>}
                    </section>

                    <section className="emailInputSection">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="carson@thecomputer.com" />
                        {errors.email && <p className="error">{errors.email}</p>}
                    </section>

                    <section className="passwordInputSection">
                        <label>Password</label>
                        <div className="passwordWrapper">
                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button type="button" className="togglePassword" onClick={() => setShowPassword(previousSelection => !previousSelection)} aria-label={showPassword ? "Hide password" : "Show password"}>
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.password && <p className="error">{errors.password}</p>}
                    </section>

                    <section className="confirmPasswordInputSection">
                        <label>Confirm Password</label>
                        <div className="passwordWrapper">
                            <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <button type="button" className="togglePassword" onClick={() => setShowConfirmPassword(prev => !prev)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                    </section>

                    {submitError && <p className="error">{submitError}</p>}
                    
                    <button type="submit" disabled={loading}>{loading ? "Registering…" : "Register"}</button>
                </form>

                <p>                
                    Register as {isEmployer ? "applicant" : "employer"} <Link to={isEmployer ? "/register-applicant" : "/register-employer"}>here</Link> 
                </p>
            </section>
        </section>
    );
}